import{r as t,c as e,h as o,g as i}from"./p-16698491.js";const s='/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%;}body{margin:0}main{display:block}h1{font-size:2em;margin:0.67em 0}hr{box-sizing:content-box;height:0;overflow:visible;}pre{font-family:monospace, monospace;font-size:1em;}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted;}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace, monospace;font-size:1em;}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-0.25em}sup{top:-0.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0;}button,input{overflow:visible}button,select{text-transform:none}button,[type="button"],[type="reset"],[type="submit"]{-webkit-appearance:button}button::-moz-focus-inner,[type="button"]::-moz-focus-inner,[type="reset"]::-moz-focus-inner,[type="submit"]::-moz-focus-inner{border-style:none;padding:0}button:-moz-focusring,[type="button"]:-moz-focusring,[type="reset"]:-moz-focusring,[type="submit"]:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:0.35em 0.75em 0.625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal;}progress{vertical-align:baseline}textarea{overflow:auto}[type="checkbox"],[type="radio"]{box-sizing:border-box;padding:0;}[type="number"]::-webkit-inner-spin-button,[type="number"]::-webkit-outer-spin-button{height:auto}[type="search"]{-webkit-appearance:textfield;outline-offset:-2px;}[type="search"]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit;}details{display:block}summary{display:list-item}template{display:none}[hidden]{display:none}:host{--csc-border-radius:4px;--csc-dark-grey:rgb(89, 89, 89);--csc-error:#e71d32;--csc-font-family:\'museo-sans\', sans-serif;--csc-light-grey:rgb(223, 225, 227);--csc-light-grey-blue:rgb(204, 244, 240);--csc-lightest-grey:rgba(223, 225, 227, 0.5);--csc-link:#025B97;--csc-mid-grey:rgb(128, 128, 128);--csc-primary:#002f5f;--csc-primary-ghost:rgba(0, 103, 120, 0.15);--csc-primary-ghost-hover:rgba(0, 103, 120, 0.25);--csc-primary-hover:rgb(80, 151, 141);--csc-primary-text-hover:rgba(0, 103, 120, 0.15);--csc-success:#51a808;--csc-warning:#ff5800}html{box-sizing:border-box}*,*:before,*:after{box-sizing:inherit}.md-ripple{display:block;position:absolute;pointer-events:none;border-radius:50%;transform:scale(0);background:currentColor;opacity:0.3}.md-ripple.animate{animation:mdRipple 0.7s backwards linear}:host{font-family:var(--csc-font-family)}@keyframes mdRipple{100%{opacity:0;transform:scale(2.5)}}::-ms-reveal{display:none}.c-tab-buttons{--c-switch-border-color:var(--csc-primary);display:flex;flex-wrap:wrap;box-shadow:0 0 0 2px var(--c-switch-border-color);margin:2px;border-radius:var(--csc-border-radius);background-color:var(--csc-primary);gap:2px}.c-tab-buttons ::slotted(*){flex-grow:1}.c-tab-buttons--disabled{--c-switch-border-color:var(--csc-light-grey);pointer-events:none;background-color:var(--csc-light-grey)}::slotted(c-button:first-child){--c-radius:4px 0 0 4px}::slotted(c-button:last-child){--c-radius:0 4px 4px 0}';const r=class{constructor(o){t(this,o);this.changeValue=e(this,"changeValue",3);this.value=0;this.mandatory=false;this.size="default";this.hostDisabled=false}onValueChange(t){var e,o;this.el.childNodes.forEach((t=>{t.outlined=true}));if(t!==null){const e=this.buttons.find((e=>e.value===t))||this.buttons[t];if(e)e.outlined=false}this.changeValue.emit((o=(e=this.buttons[t])===null||e===void 0?void 0:e.value)!==null&&o!==void 0?o:t)}onTabChange(t){const e=this.value!==null&&(this._isIndexBased?+t.detail===+this.value:t.detail===this.value);if(this.mandatory&&e){return}const o=this._isIndexBased?null:"";const i=this._isIndexBased?+t.detail:t.detail;this.value=e?o:i}get buttons(){return Array.from(this.el.childNodes).filter((t=>t.tagName==="C-BUTTON"))}componentDidLoad(){this._isIndexBased=this.buttons.every((t=>typeof t.value==="undefined"));this.buttons.forEach(((t,e)=>{t.setAttribute("data-index",String(e));t.grouped=true;t.disabled=this.hostDisabled;t.size=this.size;const o=this.value!==null&&(this._isIndexBased?e===+this.value:t.value===this.value);t.outlined=!o;const i=t.shadowRoot.querySelector(".c-button");i.classList.add("grouped")}))}render(){const t={"c-tab-buttons":true,"c-tab-buttons--disabled":this.hostDisabled};return o("div",{class:t},o("slot",null))}get el(){return i(this)}static get watchers(){return{value:["onValueChange"]}}};r.style=s;export{r as c_tab_buttons};
//# sourceMappingURL=p-5c446b12.entry.js.map