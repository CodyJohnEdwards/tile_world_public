import "./status-modal.js"
import "./augment-aeons.js"
import "./inventory-modal.js"
import "./hone-sword.js"
import "./refine-bow.js"
import "./brew-tincture.js"
import "./distil-poison.js"
import "./configure-settings.js"
import "./login.js"

class Modals extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <status-modal></status-modal>
            <aeon-modal></aeon-modal>
            <inventory-modal></inventory-modal>
            <hone-modal></hone-modal>
            <refine-modal></refine-modal>
            <brew-modal></brew-modal>
            <distill-modal></distill-modal>
            <settings-modal></settings-modal>
            <login-modal></login-modal>
        `;
    }

    connectedCallback() {

    }
}

customElements.define('arcane-modals', Modals);