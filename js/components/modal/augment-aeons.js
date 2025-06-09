import {decorateUI} from "../../util/ui-decorator.js";

class AeonModal extends HTMLElement {
    constructor() {
        super();
        this.emanations = [
            {
                item: {
                    prefix: "Mild",
                    name: "Vitality",
                    resonance: 2,
                    _type: "Emanation"
                },
                count: 23
            }
        ];
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
        this.renderEmanations();
    }

    renderEmanations() {
        const weights = { Weak: 1, Mild: 2, Strong: 3, Potent: 4 };
        const sorted = [...this.emanations].sort((a, b) => {
            let diff = a.item.resonance - b.item.resonance;
            if (diff === 0) {
                diff = weights[a.item.prefix] - weights[b.item.prefix];
            }
            return -diff;
        });

        const bodyHTML = sorted.map(slot => `
            <div class="d-flex justify-content-start">
                <div class="arcane-container-standalone-item w-70 mx-2">
                    <div class="arcane-container-item">
                        <span class="w-40">${slot.item.prefix} Emanation of ${slot.item.name}</span>
                        <span class="w-20">| *** ${slot.item.resonance}</span>
                        <span class="w-20">| Quantity: ${slot.count}</span>
                    </div>
                </div>
                <div class="arcane-container-standalone-item mx-2">
                    <div class="arcane-container-item">Amplify / -242 Pleroma </div>
                </div>
            </div>
        `).join("");

        const body = this.querySelector(".modal-body");
        body.innerHTML = bodyHTML;
        decorateUI(document);
    }
}

customElements.define('aeon-modal', AeonModal);
