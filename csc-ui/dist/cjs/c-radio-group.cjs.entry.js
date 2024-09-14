'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-682790de.js');
const mdi = require('./mdi-20f0b5c9.js');
const utils = require('./utils-344749c3.js');

const cRadioGroupCss = "/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%;}body{margin:0}main{display:block}h1{font-size:2em;margin:0.67em 0}hr{box-sizing:content-box;height:0;overflow:visible;}pre{font-family:monospace, monospace;font-size:1em;}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted;}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace, monospace;font-size:1em;}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-0.25em}sup{top:-0.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0;}button,input{overflow:visible}button,select{text-transform:none}button,[type=\"button\"],[type=\"reset\"],[type=\"submit\"]{-webkit-appearance:button}button::-moz-focus-inner,[type=\"button\"]::-moz-focus-inner,[type=\"reset\"]::-moz-focus-inner,[type=\"submit\"]::-moz-focus-inner{border-style:none;padding:0}button:-moz-focusring,[type=\"button\"]:-moz-focusring,[type=\"reset\"]:-moz-focusring,[type=\"submit\"]:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:0.35em 0.75em 0.625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal;}progress{vertical-align:baseline}textarea{overflow:auto}[type=\"checkbox\"],[type=\"radio\"]{box-sizing:border-box;padding:0;}[type=\"number\"]::-webkit-inner-spin-button,[type=\"number\"]::-webkit-outer-spin-button{height:auto}[type=\"search\"]{-webkit-appearance:textfield;outline-offset:-2px;}[type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit;}details{display:block}summary{display:list-item}template{display:none}[hidden]{display:none}:host{--csc-border-radius:4px;--csc-dark-grey:rgb(89, 89, 89);--csc-error:#e71d32;--csc-font-family:'museo-sans', sans-serif;--csc-light-grey:rgb(223, 225, 227);--csc-light-grey-blue:rgb(204, 244, 240);--csc-lightest-grey:rgba(223, 225, 227, 0.5);--csc-link:#025B97;--csc-mid-grey:rgb(128, 128, 128);--csc-primary:#002f5f;--csc-primary-ghost:rgba(0, 103, 120, 0.15);--csc-primary-ghost-hover:rgba(0, 103, 120, 0.25);--csc-primary-hover:rgb(80, 151, 141);--csc-primary-text-hover:rgba(0, 103, 120, 0.15);--csc-success:#51a808;--csc-warning:#ff5800}html{box-sizing:border-box}*,*:before,*:after{box-sizing:inherit}.md-ripple{display:block;position:absolute;pointer-events:none;border-radius:50%;transform:scale(0);background:currentColor;opacity:0.3}.md-ripple.animate{animation:mdRipple 0.7s backwards linear}:host{font-family:var(--csc-font-family)}@keyframes mdRipple{100%{opacity:0;transform:scale(2.5)}}::-ms-reveal{display:none}:host{display:flex;flex-direction:column;gap:4px}.c-radio-group{--c-radio-flex-direction:column;--c-radio-item-gap:2px;display:flex;flex-direction:column;gap:4px;width:fit-content}.c-radio-group__items{display:flex;flex-direction:var(--c-radio-flex-direction);flex-wrap:wrap;gap:var(--c-radio-item-gap)}.c-radio-group__label span.required{color:var(--csc-error)}.c-radio-group--disabled{--c-radio-color:var(--csc-mid-grey);--csc-error:var(--csc-mid-grey);color:var(--c-radio-color);cursor:default;opacity:0.75}.c-radio-group--error{--c-radio-color:var(--csc-error);color:var(--csc-error)}.c-radio-group--inline{--c-radio-flex-direction:row;--c-radio-item-gap:12px}.c-radio{--c-radio-color:var(--csc-primary);align-items:flex-start;display:flex;position:relative;cursor:pointer;font-size:16px;user-select:none;gap:4px;line-height:1.2}.c-radio input{position:absolute;opacity:0;cursor:pointer;height:0;width:0}.c-radio input:checked~.ripple .selection::after{display:block;transform:scale(1)}.c-radio .ripple{position:relative;height:42px;width:42px;min-width:42px;border-radius:50%;overflow:hidden;transition:translateZ(0);color:var(--csc-primary)}.c-radio .selection{position:absolute;top:11px;left:11px;height:20px;width:20px;background-color:transparent;box-shadow:inset 0 0 0 2px var(--c-radio-color);border-radius:50%;transition:box-shadow 0.15s ease-in-out}.c-radio .selection::after{content:\"\";position:absolute;transform:scale(0);transition:transform 0.15s ease-in-out;top:5px;left:5px;width:10px;height:10px;border-radius:50%;background:var(--c-radio-color)}.c-radio__details{line-height:1;padding:0 12px}.c-radio__details.active .c-radio__message{opacity:1;transform:translateY(0px)}.c-radio__message{font-size:12px;opacity:0;transform:translateY(-4px);transition:all 0.2s cubic-bezier(0.25, 0.8, 0.5, 1)}.c-radio__message--hint{color:var(--csc-mid-grey)}.c-radio__message--error{color:var(--csc-error) !important}.c-radio__message span{align-items:flex-start;display:flex;gap:4px;height:16px}.c-radio__message span.error{color:var(--csc-error)}.c-radio__message span.hint{color:var(--csc-mid-grey)}.c-radio__message svg{fill:currentColor;min-height:16px;min-width:16px;position:relative;top:-2px}.c-radio__label{padding-top:12px}.c-radio--disabled{--c-radio-color:var(--csc-mid-grey);color:var(--c-radio-color);cursor:default;opacity:0.75}.c-radio--error{--c-radio-color:var(--csc-error);color:var(--csc-error)}.c-radio--error span,.c-radio--error svg{fill:var(--csc-error);color:var(--csc-error)}.c-radio input:focus{outline:none}.c-radio input:focus+.ripple{outline:2px var(--c-radio-color) solid}@supports selector(:focus-visible){.c-radio input:focus+.ripple{outline:none}}.c-radio input:focus-visible+.ripple{outline:2px var(--c-radio-color) solid}.c-radio:not(.c-radio--disabled) .ripple:hover{background-color:var(--csc-primary-text-hover)}";

const CRadioGroup = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.changeValue = index.createEvent(this, "changeValue", 3);
    this._containers = [];
    this._getRadioButton = (item, index$1) => {
      var _a, _b;
      const itemId = item.value.toString().replace(/[^a-zA-Z0-9-_]/g, '');
      const isChecked = this.returnValue
        ? ((_b = (_a = this.items) === null || _a === void 0 ? void 0 : _a.find((i) => i.value === item.value)) === null || _b === void 0 ? void 0 : _b.value) === this.value
        : this.value === item;
      const classes = {
        'c-radio': true,
        'c-radio--disabled': this.disabled,
        'c-radio--error': this.messageOptions.type === 'error',
      };
      return (index.h("label", { class: classes, id: itemId, onKeyDown: (event) => this._handleKeyDown(event, item, index$1) }, index.h("input", { type: "radio", "aria-checked": (this.value === item).toString(), "aria-disabled": this.disabled.toString(), "aria-labelledby": itemId, disabled: this.disabled, checked: isChecked, name: CRadioGroup._uniqueId.toString(), onChange: (event) => this._select(event, item, index$1) }), index.h("span", { class: "ripple", ref: (el) => (this._containers[index$1] = el) }, index.h("span", { class: "selection" })), index.h("div", { class: "c-radio__label" }, item.label)));
    };
    this._validationIcon = (index.h("svg", { height: "16px", width: "16px", viewBox: "0 0 24 24" }, index.h("path", { d: mdi.mdiCloseCircle })));
    this.value = undefined;
    this.hideDetails = false;
    this.hint = '';
    this.inline = false;
    this.label = undefined;
    this.color = '';
    this.items = [];
    this.disabled = false;
    this.returnValue = undefined;
    this.required = false;
    this.valid = true;
    this.validation = 'Required field';
    this.messageOptions = {
      show: true,
      type: 'hint',
      content: '',
    };
  }
  onValidationMessageChange(message) {
    this.onValidChange(message.length === 0);
  }
  onValidChange(valid) {
    this._handleValidation(valid || this.valid);
  }
  componentDidLoad() {
    this._handleValidation(this.valid, 0);
  }
  _handleKeyDown(event, item, index) {
    if (['Space', 'Enter'].includes(event.code)) {
      event.preventDefault();
      this._select(event, item, index);
    }
  }
  _handleValidation(valid, timeout = 200) {
    this.messageOptions = Object.assign(Object.assign({}, this.messageOptions), { show: false });
    setTimeout(() => {
      this.messageOptions = Object.assign(Object.assign({}, this.messageOptions), { type: valid ? 'hint' : 'error', show: true, content: valid ? (index.h("span", null, this.hint)) : (index.h("span", null, this._validationIcon, " ", this.validation)) });
    }, timeout);
  }
  _select(event, item, index) {
    if (this.disabled)
      return;
    utils.createRipple(event, this._containers[index], true);
    this.value = this.returnValue ? item === null || item === void 0 ? void 0 : item.value : item;
    this.changeValue.emit(this.value);
  }
  _renderMessages() {
    if (this.hideDetails)
      return;
    const classes = {
      'c-radio__details': true,
      active: this.messageOptions.show,
    };
    const messageClasses = {
      'c-radio__message': true,
      [`c-radio__message--${this.messageOptions.type}`]: true,
    };
    return (index.h("div", { class: classes }, index.h("div", { class: messageClasses }, this.messageOptions.content)));
  }
  componentWillLoad() {
    CRadioGroup._uniqueId += 1;
  }
  render() {
    const slotHasContent = !!this.el.childNodes.length;
    const wrapperClasses = {
      'c-radio-group': true,
      'c-radio-group--disabled': this.disabled,
      'c-radio-group--inline': this.inline,
      'c-radio-group--error': this.messageOptions.type === 'error',
    };
    return (index.h("div", { class: wrapperClasses, role: "radiogroup", "aria-labelledby": "c-radio-group__label" }, (!!this.label || slotHasContent) && (index.h("label", { class: "c-radio-group__label" }, !!this.label ? this.label : index.h("slot", null), this.required && index.h("span", { class: "required" }, "\u00A0*"))), index.h("div", { class: "c-radio-group__items" }, this.items.map((item, index) => this._getRadioButton(item, index))), this._renderMessages()));
  }
  get el() { return index.getElement(this); }
  static get watchers() { return {
    "validation": ["onValidationMessageChange"],
    "valid": ["onValidChange"]
  }; }
};
CRadioGroup._uniqueId = 0;
CRadioGroup.style = cRadioGroupCss;

exports.c_radio_group = CRadioGroup;

//# sourceMappingURL=c-radio-group.cjs.entry.js.map