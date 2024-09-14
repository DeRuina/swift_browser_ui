'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-682790de.js');

const cSwitchCss = "/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%;}body{margin:0}main{display:block}h1{font-size:2em;margin:0.67em 0}hr{box-sizing:content-box;height:0;overflow:visible;}pre{font-family:monospace, monospace;font-size:1em;}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted;}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace, monospace;font-size:1em;}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-0.25em}sup{top:-0.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0;}button,input{overflow:visible}button,select{text-transform:none}button,[type=\"button\"],[type=\"reset\"],[type=\"submit\"]{-webkit-appearance:button}button::-moz-focus-inner,[type=\"button\"]::-moz-focus-inner,[type=\"reset\"]::-moz-focus-inner,[type=\"submit\"]::-moz-focus-inner{border-style:none;padding:0}button:-moz-focusring,[type=\"button\"]:-moz-focusring,[type=\"reset\"]:-moz-focusring,[type=\"submit\"]:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:0.35em 0.75em 0.625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal;}progress{vertical-align:baseline}textarea{overflow:auto}[type=\"checkbox\"],[type=\"radio\"]{box-sizing:border-box;padding:0;}[type=\"number\"]::-webkit-inner-spin-button,[type=\"number\"]::-webkit-outer-spin-button{height:auto}[type=\"search\"]{-webkit-appearance:textfield;outline-offset:-2px;}[type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit;}details{display:block}summary{display:list-item}template{display:none}[hidden]{display:none}:host{--csc-border-radius:4px;--csc-dark-grey:rgb(89, 89, 89);--csc-error:#e71d32;--csc-font-family:'museo-sans', sans-serif;--csc-light-grey:rgb(223, 225, 227);--csc-light-grey-blue:rgb(204, 244, 240);--csc-lightest-grey:rgba(223, 225, 227, 0.5);--csc-link:#025B97;--csc-mid-grey:rgb(128, 128, 128);--csc-primary:#002f5f;--csc-primary-ghost:rgba(0, 103, 120, 0.15);--csc-primary-ghost-hover:rgba(0, 103, 120, 0.25);--csc-primary-hover:rgb(80, 151, 141);--csc-primary-text-hover:rgba(0, 103, 120, 0.15);--csc-success:#51a808;--csc-warning:#ff5800}html{box-sizing:border-box}*,*:before,*:after{box-sizing:inherit}.md-ripple{display:block;position:absolute;pointer-events:none;border-radius:50%;transform:scale(0);background:currentColor;opacity:0.3}.md-ripple.animate{animation:mdRipple 0.7s backwards linear}:host{font-family:var(--csc-font-family)}@keyframes mdRipple{100%{opacity:0;transform:scale(2.5)}}::-ms-reveal{display:none}:host{display:inline-block}.c-switch{--border-color:var(--csc-dark-grey);--thumb-color:var(--csc-dark-grey);--thumb-margin:5px;--slider-color:transparent;--switch-pointer:pointer;--switch-height:22px;--switch-width:44px;--thumb-size:calc(var(--switch-height) - 2 * var(--thumb-margin));--thumb-active-position:calc(\n    var(--switch-width) - var(--thumb-size) - 2 * var(--thumb-margin)\n  );display:inline-grid;height:var(--switch-height);position:relative;grid-template-columns:1fr;gap:12px;align-items:center}.c-switch--disabled{--switch-pointer:default;--thumb-color:var(--csc-mid-grey);--slider-color:var(--csc-light-grey);--border-color:transparent;--csc-error:var(--csc-mid-grey);color:var(--csc-mid-grey)}.c-switch--label{grid-template-columns:var(--switch-width) auto}.c-switch__label span.required{color:var(--csc-error)}.c-switch__input{height:var(--switch-height);position:relative;width:var(--switch-width);align-self:start}.c-switch__slider{background-color:var(--slider-color);border-radius:var(--switch-height);box-shadow:inset 0 0 0 2px var(--border-color);bottom:0;cursor:var(--switch-pointer);left:0;position:absolute;right:0;top:0;transform-origin:50% 50%;transition:0.4s}.c-switch__slider::before{background-color:var(--thumb-color);border-radius:50%;bottom:var(--thumb-margin);content:\"\";height:var(--thumb-size);left:var(--thumb-margin);position:absolute;transition:0.4s;width:var(--thumb-size)}.c-switch input{height:0;opacity:0;width:0}.c-switch input:checked+.c-switch__slider{--thumb-color:#fff;--slider-color:var(--csc-primary);--border-color:var(--csc-primary)}.c-switch input:checked+.c-switch__slider::before{transform:translateX(var(--thumb-active-position))}.c-switch input:focus+.c-switch__slider{outline:none}.c-switch input:focus-visible+.c-switch__slider{outline:2px var(--csc-primary) solid;outline-offset:2px}";

const CSwitch = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.changeValue = index.createEvent(this, "changeValue", 3);
    this._valueChangedHandler = (event) => {
      const value = event.currentTarget.checked;
      this.value = value;
      this.changeValue.emit(value);
    };
    this.hostDisabled = false;
    this.hostId = undefined;
    this.required = false;
    this.value = false;
    this.hasLabel = false;
  }
  componentDidLoad() {
    const slotted = this.host.childNodes;
    this.hasLabel = slotted && slotted.length > 0;
  }
  render() {
    const classes = {
      'c-switch': true,
      'c-switch--disabled': !!this.hostDisabled,
      'c-switch--label': this.hasLabel,
    };
    return (index.h("label", { class: classes, htmlFor: this.hostId }, index.h("div", { class: "c-switch__input" }, index.h("input", { id: this.hostId, "aria-checked": this.value, type: "checkbox", role: "switch", disabled: this.hostDisabled, checked: this.value, onInput: this._valueChangedHandler }), index.h("span", { class: "c-switch__slider" })), this.hasLabel ? (index.h("div", { class: "c-switch__label" }, index.h("slot", null), this.required && index.h("span", { class: "required" }, "\u00A0*"))) : null));
  }
  get host() { return index.getElement(this); }
};
CSwitch.style = cSwitchCss;

exports.c_switch = CSwitch;

//# sourceMappingURL=c-switch.cjs.entry.js.map