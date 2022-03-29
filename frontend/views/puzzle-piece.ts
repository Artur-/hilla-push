import Edge from 'Frontend/generated/org/vaadin/artur/hillapush/puzzle/Edge';
import { reverseX, reverseY, rotate } from 'Frontend/svg';
import { css, LitElement, PropertyValueMap, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const edge1 =
  'c 0,0 1.02423,-.1374 2.19835,-.41219 4.08444,-.96178 8.95578,-1.74869 13.37747,-2.17337 2.34824,-.22483 2.96028,-.12491 3.63477,.58706 .92431,.97427 .98676,1.64876 .34974,3.83462 -.63702,2.21085 -.88683,4.17187 -.69948,5.37098 .56208,3.67224 4.03448,6.03297 7.61929,5.1961 2.22333,-.52461 4.10942,-2.43568 4.63402,-4.6715 .32476,-1.39895 -.02498,-4.08444 -.88683,-6.88234 -.31227,-.99925 -.23732,-1.62378 .2623,-2.41069 .34974,-.56208 .9368,-.96178 1.64877,-1.13665 .33724,-.07494 3.1976,.16238 5.78316,.49963 3.26005,.41219 7.58181,1.1991 10.55458,1.92356 c 1.377,0.2498 1.377,0.2498 1.377,0.2498';
const horizontalPaths: { [key in Edge]: string } = {
  [Edge.STRAIGHT]: 'l 50,0',
  [Edge.EDGE1]: edge1,
  [Edge.EDGE2]: reverseY(edge1),
};

@customElement('puzzle-piece')
export class PuzzlePiece extends LitElement {
  @property({ type: String })
  right = Edge.EDGE1;
  @property({ type: String })
  top = Edge.EDGE1;
  @property({ type: String })
  bottom = Edge.EDGE1;
  @property({ type: String })
  left = Edge.EDGE1;
  @property({ type: Number })
  x = 0;
  @property({ type: Number })
  y = 0;
  @property({ type: Number })
  pieceImageSize = 0;
  @property({ type: String })
  image = '';
  @property({ type: Number })
  pieceId = -1;
  @property({ type: Boolean })
  correctlyPlaced = false;

  static get styles() {
    return css`
      :host {
        display: inline-flex;
        width: 100px;
        height: 100px;
      }
    `;
  }
  render() {
    return svg`<svg style="width: 100%;fill:none;stroke:#000000;stroke-width:0.5px;" viewbox="-15 -15 80 80">
        <defs>
          <path id="path${this.pieceId}" d="M 0 0 ${horizontalPaths[this.top]} ${rotate(horizontalPaths[this.right])} 
          ${reverseX(horizontalPaths[this.bottom])} ${reverseY(rotate(horizontalPaths[this.left]))}
      "></path>
        <clipPath id="piece${this.pieceId}">
          <use href="#path${this.pieceId}">
  </clipPath></defs>      
        <image clip-path="url(#piece${this.pieceId})" x="-${this.x * 50}" y="-${this.y * 50}" width="${
      this.pieceImageSize
    }" height="${this.pieceImageSize}" href="${this.image}">
          </image>
          <use stroke=${this.correctlyPlaced ? 'green' : 'black'} href="#path${this.pieceId}"></use>
    </svg>
        `;
  }
  protected updated(_changedProperties: Map<PropertyKey, unknown>): void {
    if (
      isSafari() &&
      _changedProperties.has('correctlyPlaced') &&
      _changedProperties.get('correctlyPlaced') === false
    ) {
      this.style.display = 'none';
      requestAnimationFrame(() => (this.style.display = ''));
    }
  }
}
function isSafari() {
  return navigator.userAgent.includes(" Safari/");
}
