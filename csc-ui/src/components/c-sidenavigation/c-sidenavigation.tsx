import { mdiArrowRight } from '@mdi/js';
import { Component, Host, h, Prop, Listen, Element } from '@stencil/core';
/**
 * @group Navigation
 */
@Component({
  tag: 'c-sidenavigation',
  styleUrl: 'c-sidenavigation.scss',
  shadow: true,
})
export class CSidenavigation {
  /**
   * Mobile version
   */
  @Prop() mobile: boolean;

  /**
   * Mobile version menu visibility
   */
  @Prop({ mutable: true }) menuVisible: boolean = false; // eslint-disable-line

  @Element() host: HTMLCSidenavigationElement;

  @Listen('itemChange')
  handleChange(event: Event) {
    const slotted = this.host.querySelectorAll('c-sidenavigationitem');
    const target = event.target as HTMLCSidenavigationitemElement;
    const { active } = target;

    slotted.forEach((item) => {
      if (item.querySelector('[slot="subnavitem"]')) {
        item.active = false;
      }
    });

    if (target.querySelector('[slot="subnavitem"]')) {
      target.active = !active;
    } else {
      target.active = true;
    }
  }

  componentDidLoad() {
    const el = document.querySelector('body');

    ['click', 'keyup'].forEach((eventType) => {
      el.addEventListener(eventType, (e: MouseEvent | KeyboardEvent) => {
        if ((e.target as HTMLElement).matches('c-navigationbutton')) {
          if (eventType === 'click') {
            this.menuVisible = !this.menuVisible;
          } else if (e instanceof KeyboardEvent && e.key === 'Enter') {
            this.menuVisible = !this.menuVisible;
          }
        }
      });
    });
  }

  private _closeMenu() {
    this.menuVisible = false;
  }

  render() {
    const classes = {
      'c-sidenavigation': true,
      'hide-menu': !this.menuVisible,
      mobile: !!this.mobile,
      desktop: !this.mobile,
    };

    const containerClasses = {
      'c-sidenavigation__content': true,
      'c-sidenavigation__content--hidden': !this.menuVisible,
      'c-sidenavigation__content--mobile': !!this.mobile,
      'c-sidenavigation__content--desktop': !this.mobile,
    };

    return (
      <Host class={{ desktop: !this.mobile }}>
        <div class={containerClasses}>
          {this.mobile && (
            <div class="c-sidenavigation__burger">
              <c-icon-button inverted text onClick={() => this._closeMenu()}>
                <span class="visuallyhidden">Close sidemenu</span>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d={mdiArrowRight} />
                </svg>
              </c-icon-button>
            </div>
          )}

          <nav class={classes} role="menubar">
            <slot></slot>
            <div class="vertical-spacer"></div>
            <slot name="bottom"></slot>
          </nav>
        </div>

        {this.menuVisible && this.mobile && (
          <div
            class="c-overlay c-fadeIn"
            onClick={() => this._closeMenu()}
          ></div>
        )}
      </Host>
    );
  }
}
