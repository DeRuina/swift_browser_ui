import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { e as mdiPlus, f as mdiMinus, g as mdiAccount, h as mdiPencil } from './mdi.js';
import { c as createRipple } from './utils.js';

const cButtonCss = "/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%;}body{margin:0}main{display:block}h1{font-size:2em;margin:0.67em 0}hr{box-sizing:content-box;height:0;overflow:visible;}pre{font-family:monospace, monospace;font-size:1em;}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted;}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace, monospace;font-size:1em;}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-0.25em}sup{top:-0.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0;}button,input{overflow:visible}button,select{text-transform:none}button,[type=\"button\"],[type=\"reset\"],[type=\"submit\"]{-webkit-appearance:button}button::-moz-focus-inner,[type=\"button\"]::-moz-focus-inner,[type=\"reset\"]::-moz-focus-inner,[type=\"submit\"]::-moz-focus-inner{border-style:none;padding:0}button:-moz-focusring,[type=\"button\"]:-moz-focusring,[type=\"reset\"]:-moz-focusring,[type=\"submit\"]:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:0.35em 0.75em 0.625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal;}progress{vertical-align:baseline}textarea{overflow:auto}[type=\"checkbox\"],[type=\"radio\"]{box-sizing:border-box;padding:0;}[type=\"number\"]::-webkit-inner-spin-button,[type=\"number\"]::-webkit-outer-spin-button{height:auto}[type=\"search\"]{-webkit-appearance:textfield;outline-offset:-2px;}[type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit;}details{display:block}summary{display:list-item}template{display:none}[hidden]{display:none}:host{--csc-border-radius:4px;--csc-dark-grey:rgb(89, 89, 89);--csc-error:#e71d32;--csc-font-family:'museo-sans', sans-serif;--csc-light-grey:rgb(223, 225, 227);--csc-light-grey-blue:rgb(204, 244, 240);--csc-lightest-grey:rgba(223, 225, 227, 0.5);--csc-link:#025B97;--csc-mid-grey:rgb(128, 128, 128);--csc-primary:#002f5f;--csc-primary-ghost:rgba(0, 103, 120, 0.15);--csc-primary-ghost-hover:rgba(0, 103, 120, 0.25);--csc-primary-hover:rgb(80, 151, 141);--csc-primary-text-hover:rgba(0, 103, 120, 0.15);--csc-success:#51a808;--csc-warning:#ff5800}html{box-sizing:border-box}*,*:before,*:after{box-sizing:inherit}.md-ripple{display:block;position:absolute;pointer-events:none;border-radius:50%;transform:scale(0);background:currentColor;opacity:0.3}.md-ripple.animate{animation:mdRipple 0.7s backwards linear}:host{font-family:var(--csc-font-family)}@keyframes mdRipple{100%{opacity:0;transform:scale(2.5)}}::-ms-reveal{display:none}:host{--c-background-color:var(--csc-primary);--c-color:#fff;--c-hover-background:var(--csc-primary-hover);--c-outline-color:var(--csc-primary);--c-radius:4px;--c-tab-button-background:#fff;background-color:var(--c-background-color);border-radius:var(--c-radius);color:var(--c-color);display:inline-flex;overflow:hidden;transform:translateZ(0);transition:background-color 0.3s ease-in-out;align-self:baseline}:host(.grouped),:host(.no-radius){--c-radius:0}:host(.ghost){--c-background-color:var(--csc-primary-ghost);--c-color:var(--csc-primary);--c-hover-background:var(--csc-primary-ghost-hover)}:host(.ghost.inverted){--c-background-color:rgba(255, 255, 255, 0.15);--c-color:#fff;--c-hover-background:rgba(255, 255, 255, 0.25)}:host(.ghost.disabled){--c-background-color:var(--csc-lightest-grey);--c-hover-background:var(--csc-lightest-grey)}:host(.disabled){--c-color:var(--csc-mid-grey) !important;--c-background-color:var(--csc-light-grey);--c-hover-background:var(--csc-light-grey);pointer-events:none}:host(.disabled.outlined){--c-background-color:transparent;--c-hover-background:transparent;--c-color:var(--csc-mid-grey)}:host(.disabled.grouped){box-shadow:none !important}:host(.disabled.grouped:not(.outlined)){box-shadow:none}:host(.inverted){--c-background-color:#fff;--c-color:var(--csc-primary);--c-hover-background:rgba(255, 255, 255, 0.85);--c-outline-color:#fff}:host(.outlined){--c-background-color:transparent;--c-color:var(--csc-primary);--c-hover-background:var(--csc-primary-text-hover)}:host(.outlined.inverted){--c-color:#fff;--c-hover-background:rgba(255, 255, 255, 0.15)}:host(.outlined.disabled){--c-background-color:transparent;--c-hover-background:transparent}:host(.outlined.grouped){--c-background-color:#fff;--c-hover-background:var(--csc-primary-text-hover)}:host(.text){--c-background-color:transparent;--c-color:var(--csc-primary);--c-hover-background:var(--csc-primary-text-hover)}:host(.text.inverted){--c-color:#fff;--c-hover-background:rgba(255, 255, 255, 0.15)}:host(.text.disabled){--c-background-color:transparent;--c-hover-background:transparent}:host(.text.inverted.disabled){--c-color:rgba(255, 255, 255, 0.56) !important}:host(.c-button--active){--c-color:rgba(255, 255, 255, 1)}:host(:host:hover){--c-tab-button-background:var(--csc-primary-text-hover);background-color:var(--c-hover-background)}:host(:host:focus:not(:host:focus-visible)){outline:none}:host(:host:focus-visible){outline:2px var(--c-outline-color) solid;outline-offset:2px;z-index:1}:host(:host.grouped:focus-visible){outline-offset:4px}::slotted([slot=icon]){font-size:var(--c-button-icon-size)}::slotted(svg){fill:var(--c-color)}a{text-decoration:none}button,a{background-color:transparent;color:currentColor;font-family:var(--csc-font-family);display:flex;border:none;padding:0;position:relative;margin:0;width:100%;cursor:pointer;transition:background-color 0.3s ease-in-out}button:disabled,a:disabled{cursor:default}button.grouped,a.grouped{flex:1;text-align:center}button.grouped:focus,button.grouped:focus-visible,a.grouped:focus,a.grouped:focus-visible{outline-offset:4px;z-index:1}button.fit,a.fit{flex-grow:1 !important;width:100%}button.outlined,a.outlined{border-radius:var(--c-radius);box-shadow:inset 0 0 0 2px var(--c-color)}button.outlined.grouped,a.outlined.grouped{box-shadow:none}button.outlined.grouped::before,button.outlined.grouped::after,a.outlined.grouped::before,a.outlined.grouped::after{background-color:#fff;content:\"\";height:100%;left:0;position:absolute;top:0;transition:background-color 0.3s ease-in-out;width:100%;z-index:-1}button.outlined.grouped:hover,a.outlined.grouped:hover{background-color:var(--c-tab-button-background)}@media (max-width: 767px){.full-width-mobile{max-width:100% !important;width:100% !important;margin:0 !important}.full-width-mobile .c-button-padding{padding:24px 38px}.full-width{flex-grow:1 !important}}.c-button{--c-height:44px;--c-padding:0 16px;--c-font-size:16px;--c-button-icon-size:24px;border-radius:var(--c-radius);position:relative;box-shadow:none;outline:none;backface-visibility:hidden;-webkit-backface-visibility:hidden;-moz-backface-visibility:hidden;transform:translate3d(0, 0, 0);-webkit-transform:translate3d(0, 0, 0);-moz-transform:translate3d(0, 0, 0);transition:background-color 0.3s;color:currentColor;margin:0;text-decoration:none;display:inline-block;text-align:center;font-size:var(--c-font-size);font-weight:700;line-height:18px;user-select:none;min-width:88px;white-space:nowrap}.c-button *{pointer-events:none}.c-button svg{fill:var(--c-color);height:var(--c-button-icon-size);width:var(--c-button-icon-size)}.c-button svg.icon-by-path{margin-right:8px}.c-button svg.button-icon{margin-right:16px;font-size:10px;margin-left:-8px;margin-bottom:-2px}.c-button--small{--c-height:28px;--c-padding:0 12px;--c-font-size:14px;--c-button-icon-size:20px}.c-button--large{--c-height:52px;--c-padding:0 24px;--c-font-size:18px}.c-button--no-radius{--c-radius:0}.c-button--fitted{width:100%}.c-button.grouped{border-radius:0;white-space:nowrap;border:none;box-shadow:none;flex-grow:1}.c-button--description{display:grid;grid-template-columns:1fr;gap:0}.c-button__content{display:flex;gap:8px;height:var(--c-height);align-items:center;justify-content:center;padding:var(--c-padding)}.c-button__description{font-weight:400;font-size:12px;padding:0 12px 12px}.c-button__description--loading{opacity:0.8}.spinner__circle{animation:2s ease-in-out infinite both circle-animation;display:block;fill:transparent;stroke:var(--c-color);stroke-linecap:round;stroke-dasharray:283;stroke-dashoffset:280;stroke-width:10px;transform-origin:50% 50%}.fit{width:100%}.hide-text{color:transparent !important}.hide-text ::slotted([slot=icon]){opacity:0}.hide-text svg{fill:transparent !important}.hide-text .outlined.c-button svg{fill:transparent !important}.spinner_wrapper{width:100%;position:absolute;height:var(--c-height);display:grid;place-content:center}.spinner_wrapper.dense_spinner{padding-top:7px}.spinner_wrapper.dense_spinner .spinner{max-width:24px}.spinner{animation:3s linear infinite svg-animation;max-width:30px;position:relative;height:calc(var(--c-height) - 12px)}@keyframes svg-animation{0%{transform:rotateZ(0deg)}100%{transform:rotateZ(360deg)}}@keyframes circle-animation{0%,25%{stroke-dashoffset:280;transform:rotate(0)}50%,75%{stroke-dashoffset:75;transform:rotate(45deg)}100%{stroke-dashoffset:280;transform:rotate(360deg)}}";

const CButton$1 = proxyCustomElement(class CButton extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.tabChange = createEvent(this, "tabChange", 7);
    this._onClick = (event, center = false) => {
      var _a;
      if (this.disabled) {
        event.preventDefault();
        return;
      }
      createRipple(event, this._container, center);
      this.tabChange.emit((_a = this.value) !== null && _a !== void 0 ? _a : this.hostElement.dataset.index);
      if (this.type === 'submit') {
        this._closestElementComposed('form', this._container).submit();
      }
    };
    this._onKeyDown = (event) => {
      if (['Space', 'Enter'].includes(event.code)) {
        if (!!this.href) {
          window.open(this.href, this.target);
        }
        event.preventDefault();
        this._onClick(event, true);
      }
    };
    this.inverted = false;
    this.outlined = false;
    this.ghost = false;
    this.grouped = false;
    this.text = false;
    this.loading = false;
    this.fit = false;
    this.noRadius = false;
    this.iconEnd = false;
    this.type = 'button';
    this.disabled = false;
    this.icon = undefined;
    this.value = undefined;
    this.hostId = undefined;
    this.size = 'default';
    this.href = undefined;
    this.path = null;
    this.target = '_blank';
  }
  _closestElementComposed(selector, base) {
    function __closestFrom(el) {
      const found = el.closest(selector);
      return found ? found : __closestFrom(el.getRootNode().host);
    }
    return __closestFrom(base);
  }
  componentWillLoad() {
    this._containerhasDescriptionSlot = !!this.hostElement.querySelector('[slot="description"]');
  }
  render() {
    const SPINNER_SMALL = (h("svg", { class: "spinner", viewBox: "0 0 100 100", xmlns: "http://www.w3.org/2000/svg" }, h("circle", { class: "spinner__circle", cx: "50", cy: "50", r: "45" })));
    let selectedIcon = null;
    let svg;
    if (this.icon) {
      const icons = {
        plus: mdiPlus,
        minus: mdiMinus,
        account: mdiAccount,
        edit: mdiPencil,
      };
      selectedIcon = icons[this.icon];
      svg = (h("svg", { class: "button-icon", width: "16", height: "16", viewBox: "0 0 22 22" }, h("path", { d: selectedIcon })));
    }
    const contentClasses = {
      'c-button': true,
      'c-button--description': this._containerhasDescriptionSlot,
      'c-button--fitted': !!this.fit,
      'c-button--large': this.size === 'large',
      'c-button--no-radius': !!this.noRadius,
      'c-button--small': this.size === 'small',
    };
    const innerClasses = {
      'c-button__content': true,
      'hide-text': this.loading,
    };
    const buttonClasses = {
      fit: !!this.fit,
      grouped: this.grouped,
      outlined: this.outlined,
    };
    const hostClasses = {
      'c-button--active': this.grouped && !this.outlined,
      'no-radius': !!this.noRadius,
      disabled: !!this.disabled,
      ghost: !!this.ghost,
      grouped: this.grouped,
      inverted: this.inverted,
      outlined: this.outlined,
      text: !!this.text,
    };
    const descriptionSlotClasses = {
      'c-button__description': this._containerhasDescriptionSlot,
      'c-button__description--loading': this.loading,
    };
    const Tag = !!this.href ? 'a' : 'button';
    const hostAttributes = {
      onKeyDown: this._onKeyDown,
    };
    const attributes = {
      id: this.hostId,
      class: buttonClasses,
      tabindex: this.disabled ? -1 : 0,
      disabled: this.disabled,
      onClick: this._onClick,
    };
    let linkAttributes = {};
    if (!!this.href) {
      linkAttributes = { href: this.href, target: this.target };
    }
    const renderIcon = (h("slot", { name: "icon" }, this.path && (h("svg", { class: "icon-by-path", width: "24", height: "24", viewBox: "0 0 24 24" }, h("path", { d: this.path })))));
    return (h(Host, Object.assign({ class: hostClasses, tabindex: !!this.disabled ? '-1' : '0', role: "button" }, hostAttributes), h(Tag, Object.assign({}, attributes, linkAttributes, { tabindex: "-1" }), h("div", { class: contentClasses, ref: (el) => (this._container = el) }, this.loading && h("div", { class: "spinner_wrapper" }, SPINNER_SMALL), h("div", { class: innerClasses }, !this.iconEnd && renderIcon, svg, h("slot", null), this.iconEnd && renderIcon), this._containerhasDescriptionSlot && (h("div", { class: descriptionSlotClasses }, h("slot", { name: "description" })))))));
  }
  get hostElement() { return this; }
  static get style() { return cButtonCss; }
}, [1, "c-button", {
    "inverted": [4],
    "outlined": [4],
    "ghost": [4],
    "grouped": [4],
    "text": [4],
    "loading": [4],
    "fit": [4],
    "noRadius": [4, "no-radius"],
    "iconEnd": [4, "icon-end"],
    "type": [1],
    "disabled": [516],
    "icon": [1],
    "value": [8],
    "hostId": [1, "id"],
    "size": [1],
    "href": [1],
    "path": [1],
    "target": [1]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["c-button"];
  components.forEach(tagName => { switch (tagName) {
    case "c-button":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, CButton$1);
      }
      break;
  } });
}

const CButton = CButton$1;
const defineCustomElement = defineCustomElement$1;

export { CButton, defineCustomElement };

//# sourceMappingURL=c-button.js.map