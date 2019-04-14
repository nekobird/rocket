import { DOMUtil, } from '../Rocket';
export class UIModal {
    constructor(properties) {
        this.closeKeyCodes = [27];
        this.closeOnOutsideClick = true;
        this.isActive = false;
        this.activeModalEl;
        this.lastTriggerOpenEl;
        this.triggerCloseClass = '_jsUIModalClose';
        this.triggerOpenClass = '_jsUIModalOpen';
        if (typeof properties !== 'undefined') {
            this.properties = properties;
        }
        this.openOnCondition = targetModalEl => {
            return true;
        };
        this.open = (modalEl, completeFn, context) => {
            modalEl.classList.add('_UIModal-active');
            completeFn();
        };
        this.close = (activeModalEl, completeFn, context) => {
            activeModalEl.classList.remove('_UIModal-active');
            completeFn();
        };
        this.transit = (currentModalEl, nextModalEl, completeFn, context) => {
            currentModalEl.classList.remove('_UIModal-active');
            nextModalEl.classList.add('_UIModal-active');
            completeFn();
        };
        this._eventOpen = new Event('UIModalOpen');
        this._eventClose = new Event('UIModalClose');
        this._eventTransit = new Event('UIModalTransit');
        this.startListening();
        return this;
    }
    set properties(properties) {
        if (typeof properties === 'object') {
            Object.assign(this, properties);
        }
    }
    getTargetModalElFromTriggerEl(triggerOpenEl) {
        let targetID = triggerOpenEl.dataset.uimodalTarget;
        return document.getElementById(targetID);
    }
    closeActiveModal() {
        if (this.isActive === true) {
            let completeFn = () => {
                this.isActive = false;
            };
            completeFn.bind(this);
            window.dispatchEvent(this._eventClose);
            this.close(this.activeModalEl, completeFn);
        }
        return this;
    }
    openModalByTriggerEl(triggerOpenEl) {
        let targetModalEl = this.getTargetModalElFromTriggerEl(triggerOpenEl);
        this.lastTriggerOpenEl = triggerOpenEl;
        this.openModalByTargetEl(targetModalEl, this);
        return this;
    }
    openModalByTargetEl(targetModalEl, context) {
        if (typeof targetModalEl === 'object' &&
            typeof targetModalEl.nodeType === 'number' &&
            targetModalEl.nodeType === 1 &&
            this.openOnCondition(targetModalEl)) {
            let completeFn = () => {
                this.activeModalEl = targetModalEl;
                this.isActive = true;
            };
            completeFn = completeFn.bind(this);
            if (this.isActive === true) {
                window.dispatchEvent(this._eventTransit);
                this.transit(this.activeModalEl, targetModalEl, completeFn, this);
            }
            else {
                window.dispatchEvent(this._eventOpen);
                this.open(targetModalEl, completeFn, this);
            }
        }
        return this;
    }
    _handleClick(event) {
        let triggerOpenEl = DOMUtil.findAncestorWithClass(event.target, this.triggerOpenClass, false);
        if (triggerOpenEl !== false) {
            event.preventDefault();
            this.openModalByTriggerEl(triggerOpenEl);
        }
        else if (this.isActive) {
            let triggerCloseEl = DOMUtil.findAncestorWithClass(event.target, this.triggerCloseClass, false);
            if (triggerCloseEl) {
                event.preventDefault();
                this.closeActiveModal();
            }
            if (this.closeOnOutsideClick === true) {
                if (DOMUtil.hasAncestor(event.target, this.activeModalEl) === false) {
                    this.closeActiveModal();
                }
            }
        }
        return this;
    }
    _handleKeyUp(event) {
        if (this.isActive === true) {
            for (let keyCode of this.closeKeyCodes) {
                if (event.keyCode === keyCode) {
                    this.closeActiveModal();
                }
            }
        }
        return this;
    }
    startListening() {
        window.addEventListener('click', this._handleClick.bind(this));
        window.addEventListener('keyup', this._handleKeyUp.bind(this));
        return this;
    }
    stopListening() {
        window.removeEventListener('click', this._handleClick);
        window.removeEventListener('keyup', this._handleKeyUp);
        return this;
    }
}
//# sourceMappingURL=UIModal.js.map