import{r as t,c as i,h as e,H as s,g as n}from"./p-16698491.js";import{l as o}from"./p-dad6370b.js";const r={triggerEvents:"click",exclude:""};function a(t,i,e,s=r){const n=u(s);h(s).forEach((s=>{window.addEventListener(s,(s=>{l(s,t,i,e,n)}),false)}))}function l(t,i,e,s,n){const o=t.target;if(!e.contains(o)&&!c(o,n)){s.call(i)}}function h(t){if(t.triggerEvents){return t.triggerEvents.split(",").map((t=>t.trim()))}return["click"]}function u(t){if(t.exclude){try{return Array.from(document.querySelectorAll(t.exclude))}catch(i){console.warn(`@ClickOutside: Exclude: '${t.exclude}' will not be evaluated. Check your exclude selector syntax.`,i)}}return}function c(t,i){if(t&&i){for(let e of i){if(e.contains(t)){return true}}}return false}const d='/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%;}body{margin:0}main{display:block}h1{font-size:2em;margin:0.67em 0}hr{box-sizing:content-box;height:0;overflow:visible;}pre{font-family:monospace, monospace;font-size:1em;}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;text-decoration:underline dotted;}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace, monospace;font-size:1em;}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-0.25em}sup{top:-0.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0;}button,input{overflow:visible}button,select{text-transform:none}button,[type="button"],[type="reset"],[type="submit"]{-webkit-appearance:button}button::-moz-focus-inner,[type="button"]::-moz-focus-inner,[type="reset"]::-moz-focus-inner,[type="submit"]::-moz-focus-inner{border-style:none;padding:0}button:-moz-focusring,[type="button"]:-moz-focusring,[type="reset"]:-moz-focusring,[type="submit"]:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:0.35em 0.75em 0.625em}legend{box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal;}progress{vertical-align:baseline}textarea{overflow:auto}[type="checkbox"],[type="radio"]{box-sizing:border-box;padding:0;}[type="number"]::-webkit-inner-spin-button,[type="number"]::-webkit-outer-spin-button{height:auto}[type="search"]{-webkit-appearance:textfield;outline-offset:-2px;}[type="search"]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit;}details{display:block}summary{display:list-item}template{display:none}[hidden]{display:none}:host{--csc-border-radius:4px;--csc-dark-grey:rgb(89, 89, 89);--csc-error:#e71d32;--csc-font-family:\'museo-sans\', sans-serif;--csc-light-grey:rgb(223, 225, 227);--csc-light-grey-blue:rgb(204, 244, 240);--csc-lightest-grey:rgba(223, 225, 227, 0.5);--csc-link:#025B97;--csc-mid-grey:rgb(128, 128, 128);--csc-primary:#002f5f;--csc-primary-ghost:rgba(0, 103, 120, 0.15);--csc-primary-ghost-hover:rgba(0, 103, 120, 0.25);--csc-primary-hover:rgb(80, 151, 141);--csc-primary-text-hover:rgba(0, 103, 120, 0.15);--csc-success:#51a808;--csc-warning:#ff5800}html{box-sizing:border-box}*,*:before,*:after{box-sizing:inherit}.md-ripple{display:block;position:absolute;pointer-events:none;border-radius:50%;transform:scale(0);background:currentColor;opacity:0.3}.md-ripple.animate{animation:mdRipple 0.7s backwards linear}:host{font-family:var(--csc-font-family)}@keyframes mdRipple{100%{opacity:0;transform:scale(2.5)}}::-ms-reveal{display:none}:host{display:block;cursor:text}.c-input-menu__chevron{fill:currentColor;height:22px;width:22px;min-width:22px;transform:rotate(0deg);transition:transform 0.3s ease-in-out}.c-input-menu__chevron--active{transform:rotate(180deg)}.c-input-menu__input{width:100%;display:flex;justify-items:stretch}.c-input-menu__selection{display:none;pointer-events:none}.c-input-menu__selection--show{align-items:center;display:flex;width:100%}.c-input-menu__item-wrapper{position:absolute;width:100%;top:44px;z-index:10;margin-left:calc(var(--c-label-position) * -1)}.c-input-menu__item-wrapper--shadow{top:47px}.c-input-menu__items{position:absolute;background-color:#ffffff;min-width:calc(100% + 24px);box-shadow:0 8px 16px 0 rgba(0, 0, 0, 0.2);z-index:10;user-select:none;border-radius:4px;margin:0 -12px;overflow-y:scroll;list-style:none;padding:0}.c-input-menu__items--hidden{display:none}.c-input-menu__items li{cursor:pointer;display:flex;min-height:48px;padding:0 12px;transition:background-color 0.3s;font-size:14px;align-items:center;justify-content:flex-start;color:rgba(0, 0, 0, 0.87)}.c-input-menu__items li.disabled{background-color:rgba(0, 0, 0, 0.05);filter:grayscale(1) opacity(0.75);cursor:default}.c-input-menu__items li.disabled:hover{background-color:rgba(0, 0, 0, 0.05)}.c-input-menu__items li.dense{padding:10px 14px}.c-input-menu__items li:hover{background-color:var(--csc-primary-text-hover)}.c-input-menu__items li[aria-selected=true]{background-color:var(--csc-primary-text-hover)}.c-input-menu__items li.none{color:rgba(0, 0, 0, 0.5)}.c-input-menu__items--empty li{color:rgba(0, 0, 0, 0.54);cursor:default;gap:8px;pointer-events:none}.c-input-menu__items--empty li svg{fill:currentColor;height:18px;width:18px}input{max-height:32px;padding:8px 0 8px;background-color:transparent;border:none;color:rgba(0, 0, 0, 0.87);flex:1 1 auto;font-family:"museo-sans", sans-serif;font-size:16px;line-height:20px;max-width:100%;min-width:0;width:100%;pointer-events:none}input:focus,input:active{outline:none}input::-ms-reveal{display:none}svg{fill:currentColor;height:22px;width:22px}.c-input--disabled{color:var(--csc-mid-grey)}.c-input:focus-within{color:var(--csc-primary)}.c-input--error{color:var(--csc-error)}.c-input--error:focus-within{color:var(--csc-error)}.visuallyhidden{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;white-space:nowrap;width:1px}';const p=class{constructor(s){t(this,s);this.changeValue=i(this,"changeValue",3);this._itemRefs=[];this._cOptionElements=new Map;this._outerWrapperClasses=["outer-wrapper"];this._validationClasses=["validation-message"];this._debounce=null;this._observer=new IntersectionObserver(((t,i)=>{t.forEach((t=>{if(!t.isIntersecting){t.target.scrollIntoView({block:"nearest",inline:"nearest"});i.unobserve(t.target)}else{i.unobserve(t.target)}}))}),{threshold:1});this._lastKeyPressTime=null;this._searchString="";this._blurred=false;this._optionItems=[];this._getListItem=(t,i)=>{var s;const n=((s=this._items[this.currentIndex])===null||s===void 0?void 0:s.value)===t.value;const o={none:t.value===null,disabled:!!t.disabled};let r="none";if(typeof(t===null||t===void 0?void 0:t.value)==="string"){r=t.value.replace(/[^a-zA-Z0-9-_]/g,"")}r=`item_${this._id}--${r}`;const a={role:"option","aria-posinset":(i+1).toString(),"aria-setsize":this._items.length.toString()};if(n){a["aria-selected"]="true"}return e("li",Object.assign({},a,{id:r,ref:i=>this._itemRefs.push({value:t.value,ref:i}),class:o,"data-value":t.name,onClick:i=>this._select(i,t)}),this.hasOptionItems?e("slot",{name:`option-${i}`}):t.name)};this._handleSlotChange=()=>{this._getOptionItems()};this.autofocus=false;this.disabled=false;this.hideDetails=false;this.hint="";this.hostId=undefined;this.label=undefined;this.shadow=false;this.name=undefined;this.required=false;this.returnValue=undefined;this.valid=true;this.validate=false;this.validateOnBlur=false;this.validation="Required field";this.itemsPerPage=6;this.placeholder="";this.value=null;this.items=[];this.optionAsSelection=undefined;this.menuVisible=false;this.currentIndex=null;this.activeListItemId=null;this.statusText="";this.hasOptionItems=false;this.previousValue={value:"",name:""}}validateChange(t){if(t){this._runValidate()}}onCurrentIndexChange(t){var i,e,s;this.activeListItemId=(s=(e=(i=this._itemRefs[t])===null||i===void 0?void 0:i.ref)===null||e===void 0?void 0:e.id)!==null&&s!==void 0?s:null;this._scrollToElement();this._updateStatusText()}get _firstSelectableIndex(){return this._items.findIndex((t=>!t.disabled))}get _lastSelectableIndex(){return[...this._items].reverse().findIndex((t=>!t.disabled))}get _items(){return this.hasOptionItems?this._optionItems:this.items}_setValue(t){return this.returnValue?t===null||t===void 0?void 0:t.value:{name:t===null||t===void 0?void 0:t.name,value:t===null||t===void 0?void 0:t.value}}_valueChangedHandler(t){if(this.hasOptionItems&&this.optionAsSelection){const i=this._cOptionElements.get(t.value.toString());if(!i)return;const e=i.cloneNode(true);this._selectionElement.classList.add("c-input-menu__selection--show");this._selectionElement.replaceChildren(e)}function i(i){return i.value===(t===null||t===void 0?void 0:t.value)}this.currentIndex=this._items.findIndex(i);const e=this._setValue(t);if(this.previousValue.value===(t===null||t===void 0?void 0:t.value))return;this.previousValue=t;this.changeValue.emit(e)}_getLabel(){var t,i,e,s;if(!this.value)return"";if(this.returnValue&&["number","string","boolean"].includes(typeof this.value)){return(i=(t=this._items)===null||t===void 0?void 0:t.find((t=>t.value===this.value)))===null||i===void 0?void 0:i.name}return(s=(e=this._items)===null||e===void 0?void 0:e.find((t=>t.value===this.value.value)))===null||s===void 0?void 0:s.name}_scrollToElement(){var t;if(this._items.length>this.itemsPerPage){const i=(t=this._itemRefs.find((t=>t.value===this._items[this.currentIndex].value)))===null||t===void 0?void 0:t.ref;if(!!i){this._observer.observe(i)}}}handleKeyDown(t){if(this.disabled)return;const i=/^[0-9a-zA-Z]+$/;if(t.key.match(i)&&t.key.length===1){if(Date.now()-this._lastKeyPressTime>3e3||this._searchString.length>2){this._searchString=t.key}else{this._searchString=`${this._searchString}${t.key}`}this._lastKeyPressTime=Date.now();const e=this._items.find((t=>t.name.toLowerCase().startsWith(this._searchString)));function s(t){return t===e}if(e){if(this.menuVisible){this.currentIndex=this._items.findIndex(s);this._scrollToElement()}else{this.value=e;this._valueChangedHandler(e)}}}if(t.key==="Home"&&this.menuVisible){t.preventDefault();this.currentIndex=this._firstSelectableIndex}if(t.key==="End"&&this.menuVisible){t.preventDefault();this.currentIndex=this._lastSelectableIndex}if(t.key==="Tab"){this.menuVisible=false}if(t.key==="ArrowDown"){t.preventDefault();this.menuVisible=true;if(this.currentIndex===null){this.currentIndex=0}else if(this.currentIndex+1<this._items.length){this.currentIndex+=1}}if(t.key==="ArrowUp"){t.preventDefault();this.menuVisible=true;if(this.currentIndex>0){this.currentIndex-=1}else if(this.currentIndex===null){this.currentIndex=this._items.length-1}}if(t.key===" "){t.preventDefault();if(!this.menuVisible){this.menuVisible=true}}if(t.key==="Escape"){if(this.menuVisible){this.menuVisible=false;this._inputElement.focus()}}if(t.key==="Enter"){this.menuVisible=!this.menuVisible;if(this.currentIndex!==null){this._selectItem()}if(!this.menuVisible){this._inputElement.focus()}}}componentWillLoad(){var t,i;p._uniqueId+=1;this._id=(i=(t=this.hostId)===null||t===void 0?void 0:t.replace(/[^a-zA-Z0-9-_]/g,""))!==null&&i!==void 0?i:p._uniqueId.toString();this._inputId="input_"+(this.hostId||this.label||this.placeholder).replace(/[^a-zA-Z0-9-_]/g,"")}componentDidLoad(){this._getOptionItems();if((this.value||typeof this.value==="boolean")&&!this.currentIndex&&this.currentIndex!==0){this.currentIndex=this._items.findIndex((t=>t.value===this.value))}}disconnectedCallback(){this._observer.disconnect()}_selectItem(){const t=this._items[this.currentIndex];this.value=t;this._valueChangedHandler(t);this._scrollToElement()}_showMenu(){if(this.disabled)return;this._inputElement.focus();setTimeout((()=>{this.menuVisible=true}),0)}_hideMenu(){this.menuVisible=false;this._blurred=true}_select(t,i){if(!!i.disabled)return;t.preventDefault();t.stopPropagation();this.value=this._setValue(i);this._valueChangedHandler(i);this.menuVisible=false}_getOptionItems(){requestAnimationFrame((()=>{this._cOptionElements=new Map;let t=null;this._optionItems=(this.host?Array.from(this.host.querySelectorAll("c-option")):[]).map(((i,e)=>{const s={value:i.value,name:i.name||i.innerText,disabled:!!i.disabled};if(i.selected){t=s}i.slot=`option-${e}`;this._cOptionElements.set(i.value.toString(),i);return s}));this.hasOptionItems=!!this._optionItems.length;if(t){this._valueChangedHandler(t)}}))}_runValidate(){if(this.required&&!this.value&&(this._blurred||!this.validateOnBlur)){this._outerWrapperClasses.push("required");this._validationClasses.push("show")}else{this._outerWrapperClasses=this._outerWrapperClasses.filter((t=>t!=="required"));this._validationClasses=this._validationClasses.filter((t=>t!=="show"))}}_renderChevron(){const t={"c-input-menu__chevron":true,"c-input-menu__chevron--active":this.menuVisible};return e("svg",{class:t,viewBox:"0 0 24 24"},e("path",{d:o}))}_renderInputElement(){var t,i;return e("div",{class:"c-input-menu__input",onClick:()=>this._showMenu()},e("input",{"aria-controls":"results_"+this._id,"aria-readonly":"true","aria-haspopup":"listbox",id:this._inputId,ref:t=>this._inputElement=t,autocomplete:"off",class:"c-input__input",type:"text",value:(t=this._getLabel())!==null&&t!==void 0?t:null,name:(i=this.name)!==null&&i!==void 0?i:null,readonly:"true"}),e("div",{ref:t=>this._selectionElement=t,class:"c-input-menu__selection"}))}_renderMenu(t){return e("div",{class:{"c-input-menu__item-wrapper":true,"c-input-menu__item-wrapper--shadow":this.shadow}},e("ul",{id:"results_"+this._id,"aria-activedescendant":this.activeListItemId,"aria-expanded":this.menuVisible.toString(),style:t,title:this.label||this.placeholder,class:this.menuVisible?"c-input-menu__items":"c-input-menu__items c-input-menu__items--hidden",role:"listbox"},this._items.map(((t,i)=>this._getListItem(t,i)))))}_updateStatusText(){if(this._debounce!==null){clearTimeout(this._debounce);this._debounce=null}this._debounce=window.setTimeout((()=>{const t=this.host.shadowRoot.querySelector('li[aria-selected="true"]');const i=!!this._items.length?", to navigate use up and down arrows":"";const e=t.classList.contains("disabled");const s=e?"Disabled option - ":"";const n=!!t?`${s}${t.dataset.value} -  ${t.ariaPosInSet} of ${t.ariaSetSize} is highlighted`:null;this.statusText=`${n||i}`;this._debounce=null}),1400)}render(){let t={};if(this.itemsPerPage&&this.itemsPerPage>0&&this._items.length>this.itemsPerPage){t={"max-height":48*this.itemsPerPage+"px","overflow-y":"scroll"}}return e(s,{ref:t=>a(this,t,(()=>this._hideMenu()))},e("div",{id:"announce-"+this._id,class:"visuallyhidden","aria-live":"polite","aria-atomic":"true"},this.statusText),e("c-input",{autofocus:this.autofocus,disabled:this.disabled,"hide-details":this.hideDetails,hint:this.hint,id:this.hostId,"input-id":this._inputId,label:this.label,name:this.name,placeholder:this.placeholder,required:this.required,shadow:this.shadow,valid:this.valid,validate:this.validate,"validate-on-blur":this.validateOnBlur,validation:this.validation,value:this.value,variant:"select"},e("slot",{name:"pre",slot:"pre"}),e("div",{class:"c-input__content"},this._renderInputElement(),this._renderMenu(t),this._renderChevron(),e("slot",{onSlotchange:this._handleSlotChange})),e("slot",{name:"post",slot:"post"})))}get host(){return n(this)}static get watchers(){return{validate:["validateChange"],currentIndex:["onCurrentIndexChange"]}}};p._uniqueId=0;p.style=d;export{p as c_select};
//# sourceMappingURL=p-755cfa4e.entry.js.map