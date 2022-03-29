import { css, html, LitElement, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('cursor-indicator')
export class CursorIndicator extends LitElement {
  @property({ type: Number })
  public x: number = -1;
  @property({ type: Number })
  public y: number = -1;
  @property({ type: String })
  public color: string = 'black';
  @property({ type: String })
  public name: string = '';

  static get styles() {
    return css`
    `;
  }
  render() {
    return svg`<svg style="pointer-events: none; fill: ${this.color}; position: absolute; left: ${this.x}px; top: ${this.y}px; height: 40px;z-index: 1000" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="8 8 200 28">
 <rect x="12.5" y="13.6" transform="matrix(0.9221 -0.3871 0.3871 0.9221 -5.7605 6.5909)" width="2" height="8"/>
 <polygon points="9.2,7.3 9.2,18.5 12.2,15.6 12.6,15.5 17.4,15.5 "/>
 <text x="20" y="20" style="font-size: 15px">${this.name}</text>
 </svg>
 `;
  }
}
