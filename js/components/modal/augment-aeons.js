import {decorateUI} from "../../util/ui-decorator.js";
import {ServerEvent} from "../../constants/server_events.js";
import {ClientEvent} from "../../constants/client_events.js";

class AeonModal extends HTMLElement {
    constructor() {
        super();
        this.emanations = [];
        this.pleroma = 0;
        this.previousInventoryJSON = "";
        this.previousPleroma = null;
        this.innerHTML = `
<div class="modal fade" id="aeonModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content arcane-container" style="background: #1f1f23;">
            <div class="modal-header">
                <h1 class="modal-title arcane-container-header fs-5" id="exampleModalLabel">Amplify / Emanations</h1>
            </div>
            <div class="modal-body">
                <!-- EMANATION LIST -->
            </div>
            <div class="modal-footer">
                <div class="arcane-container-standalone-item">
                    <div class="arcane-container-item" data-bs-dismiss="modal">Exit</div>
                </div>
            </div>
        </div>
    </div>
</div>
        `;
    }

    connectedCallback() {
        registerGnoSysServerEventHandler(ServerEvent.PLAYER_UPDATE, (playerInfo) => {
            const slots = playerInfo.inventory.slots.filter(slot => slot.item._type === "Emanation");
            const json = JSON.stringify(slots);
            const pleroma = playerInfo.pleroma;

            if (json === this.previousInventoryJSON && pleroma === this.previousPleroma) return;

            this.previousInventoryJSON = json;
            this.previousPleroma = pleroma;
            this.emanations = slots;
            this.pleroma = pleroma;
            this.renderEmanations();
        });
    }

    renderEmanations() {
        const weights = { Weak: 1, Mild: 2, Strong: 3, Potent: 4 };

        const groups = {};
        this.emanations.forEach(slot => {
            const name = slot.item.name;
            if (!groups[name]) groups[name] = [];
            groups[name].push(slot);
        });

        const entries = Object.entries(groups).map(([name, slots]) => {
            let cost = 0;
            let count = 0;
            let top = slots[0];
            slots.forEach(s => {
                cost += s.item.resonance * s.count;
                count += s.count;
                if (s.item.resonance > top.item.resonance) top = s;
            });
            return { name, slots, cost, count, prefix: top.item.prefix, resonance: top.item.resonance };
        });

        entries.sort((a, b) => {
            let diff = a.resonance - b.resonance;
            if (diff === 0) {
                diff = weights[a.prefix] - weights[b.prefix];
            }
            return -diff;
        });

        const bodyHTML = entries.map(entry => {
            const disabled = this.pleroma < entry.cost;
            return `
            <div class="d-flex justify-content-start">
                <div class="arcane-container-standalone-item w-70 mx-2">
                    <div class="arcane-container-item">
                        <span class="w-40">${entry.prefix} Emanation of ${entry.name}</span>
                        <span class="w-20">| *** ${entry.resonance}</span>
                        <span class="w-20">| Quantity: ${entry.count}</span>
                    </div>
                </div>
                <div class="arcane-container-standalone-item mx-2">
                    <div class="arcane-container-item ${disabled ? 'btn-disabled' : ''}" data-name="${entry.name}" data-cost="${entry.cost}">Amplify / -${entry.cost} Pleroma </div>
                </div>
            </div>
            `;
        }).join("");

        const body = this.querySelector(".modal-body");
        body.innerHTML = bodyHTML;
        decorateUI(document);

        [...body.querySelectorAll('[data-name]')].forEach(el => {
            el.addEventListener('click', () => {
                if (el.classList.contains('btn-disabled')) return;
                const name = el.dataset.name;
                gnoSysTransmitClientEvent(ClientEvent.AMPLIFY_EMANATION, name);
            });
        });
    }
}

customElements.define('aeon-modal', AeonModal);
