import { Component, h, Prop, Host } from '@stencil/core';
/**
 * @parent c-card
 * @slot - Card actions
 */
@Component({
  tag: 'c-card-actions',
  styleUrl: 'c-card-actions.scss',
  shadow: true,
})
export class CCardActions {
  /**
   * Align the actions
   */
  @Prop() align: 'start' | 'center' | 'end' = 'center';

  /**
   * Justify the actions
   */
  @Prop() justify:
    | 'start'
    | 'center'
    | 'end'
    | 'space-between'
    | 'stretch'
    | 'space-around' = 'start';

  render() {
    const classes = {
      'c-card-actions': true,
      [`c-card-actions--align-${this.align}`]: true,
      [`c-card-actions--justify-${this.justify}`]: true,
    };

    return (
      <Host>
        <div class={classes}>
          <slot></slot>
        </div>
      </Host>
    );
  }
}
