class RefineModal extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="modal fade" id="refineModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content arcane-container" style="background: #1f1f23;">
                        <div class="modal-header">
                            <h1 class="modal-title arcane-container-header fs-5" id="exampleModalLabel">Refine / Bow</h1>
                        </div>
                        <div class="modal-body">
                            <p>This is the status modal. Insert your content here.</p>
                            <p>This is the status modal. Insert your content here.</p>
                            <p>This is the status modal. Insert your content here.</p>
                            <p>This is the status modal. Insert your content here.</p>
                            <p>This is the status modal. Insert your content here.</p>
                            <p>This is the status modal. Insert your content here.</p>
                            <p>This is the status modal. Insert your content here.</p>
                            <p>This is the status modal. Insert your content here.</p>
                            <p>This is the status modal. Insert your content here.</p>
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

    }
}

customElements.define('refine-modal', RefineModal);
