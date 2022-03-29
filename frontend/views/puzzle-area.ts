import { PuzzleEndpoint } from 'Frontend/generated/endpoints';
import DropInfo from 'Frontend/generated/org/vaadin/artur/hillapush/puzzle/DropInfo';
import Edge from 'Frontend/generated/org/vaadin/artur/hillapush/puzzle/Edge';
import Piece from 'Frontend/generated/org/vaadin/artur/hillapush/puzzle/Piece';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './puzzle-piece';
import { PuzzlePiece } from './puzzle-piece';
import { Layout } from './view';

const images: string[] = [
  'https://images.unsplash.com/photo-1605851868183-7a4de52117fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
  'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
  'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
  'https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
  'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
];

@customElement('puzzle-area')
export class PuzzleArea extends Layout {
  @state()
  private pieces: Piece[] = [];
  private size!: number;
  private N!: number;
  private pieceImageSize!: number;
  private piecePadding!: number;
  private pieceInnerSize!: number;
  private pieceOuterSize!: number;
  private image!: string;
  dragPuzzlePiece?: PuzzlePiece;
  dragPiece?: Piece;
  dragImage?: Element;
  dragOffsetX?: number;
  dragOffsetY?: number;

  static get styles() {
    return css`
    :host {
        display: inline-block;
        width: 100%;
        height: 100%;
    }
    puzzle-piece {
        width: 50px;
    }
    .success {
      position: absolute;
      left: 150px;
      z-index: 1000;
      font-size: 200px;
      top: 60px;
    }
    ]`;
  }

  async connectedCallback() {
    super.connectedCallback();
    const info = await PuzzleEndpoint.getInfo();
    this.N = info.N;
    this.size = info.size;
    this.pieceImageSize = this.N * 50;
    this.pieceInnerSize = this.size / this.N;
    this.pieceOuterSize = (this.pieceInnerSize * 18.75) / 11.72;
    this.piecePadding = (this.pieceOuterSize - this.pieceInnerSize) / 2;

    PuzzleEndpoint.join().onNext((pieces) => {
      if (this.pieces.length === 0 || pieces[0].id !== this.pieces[0].id) {
        this.image = images[Math.floor(Math.random() * images.length)];
      }
      this.pieces = pieces;
    });
  }

  render() {
    const success =
      this.pieces.length != 0 && this.pieces.map((piece) => piece.correctlyPlaced).reduce((prev, curr) => prev && curr);

    return html`
      <div style="width:100%; height: 100%;" @dragover=${this.dragOver} @drop=${this.drop}>
        <div
          style="border: 1px solid black;  position: relative;width: ${this.size}px; height: ${this.size}px;
        --piece-inner-size: calc(100%/${this.N});
        --piece-size: calc(var(--piece-inner-size) * 18.75/11.72);
        --piece-padding: calc((var(--piece-size) - var(--piece-inner-size))/2);
        --piece-neg-padding: calc(0px - var(--piece-padding))
        "
        >
          <div style=${success ? '' : 'display:none'} class="success">👍</div>
          ${this.pieces.map((piece) => {
            const zIndex = piece.correctlyPlaced ? 0 : piece.zIndex;
            return html` <puzzle-piece
              style="position: absolute;top: ${piece.top - this.piecePadding}px; left: ${piece.left -
              this.piecePadding}px; width: var(--piece-size);height:var(--piece-size); z-index: ${zIndex}"
              draggable="${!piece.correctlyPlaced}"
              @dragstart=${(e: DragEvent) => this.dragStart(e, piece)}
              @dragend=${this.dragEnd}
              .pieceId=${piece.id}
              .left="${piece.leftEdge}"
              .top="${piece.topEdge}"
              .right="${piece.rightEdge}"
              .bottom="${piece.bottomEdge}"
              .x="${piece.imageX}"
              .y="${piece.imageY}"
              .correctlyPlaced=${piece.correctlyPlaced}
              .image=${this.image}
              .pieceImageSize=${this.pieceImageSize}
            ></puzzle-piece>`;
          })}
        </div>
      </div>
    `;
  }

  private dragEnd(e: DragEvent) {
    this.dragPuzzlePiece!.style.display = '';
    this.dragPuzzlePiece = undefined;
    this.dragPiece = undefined;
    if (this.dragImage) {
      this.dragImage.remove();
      this.dragImage = undefined;
    }
  }
  private dragOver(e: DragEvent) {
    e.preventDefault();
  }
  private getDropInfo(e: DragEvent): DropInfo {
    const dropElement = e.target as HTMLElement;
    let x = e.offsetX - this.dragOffsetX!;
    let y = e.offsetY - this.dragOffsetY!;
    if (dropElement.tagName === 'PUZZLE-PIECE') {
      x += dropElement.offsetLeft;
      y += dropElement.offsetTop;
    }
    x += this.piecePadding;
    y += this.piecePadding;

    const gridX = Math.round((x + this.piecePadding) / this.pieceInnerSize);
    const gridY = Math.round((y + this.piecePadding) / this.pieceInnerSize);

    // const dropX =
    x = x > -this.piecePadding ? x : -this.piecePadding;
    y = y > -this.piecePadding ? y : -this.piecePadding;
    return { x, y, gridX, gridY };
  }
  private drop(e: DragEvent) {
    const dropInfo = this.getDropInfo(e);

    this.dragPiece!.left = dropInfo.x;
    this.dragPiece!.top = dropInfo.y;
    console.log(dropInfo);
    PuzzleEndpoint.dropPieceAt(this.dragPiece!.id, dropInfo);
    this.requestUpdate('pieces');
  }

  private dragStart(e: DragEvent, piece: Piece) {
    const puzzlePieze: PuzzlePiece = e.target! as any;
    let dragImage: Element = puzzlePieze.renderRoot!.querySelector('svg')!;

    dragImage = dragImage.cloneNode(true) as Element;
    const dragStyles = (dragImage as any).style;
    dragStyles.width = this.pieceOuterSize + 'px';
    dragStyles.position = 'absolute';
    dragStyles.top = '-1000px';

    document.body.append(dragImage);

    e.dataTransfer!.setDragImage(dragImage, e.offsetX, e.offsetY);
    e.dataTransfer!.effectAllowed = 'move';

    requestAnimationFrame(() => (puzzlePieze.style.display = 'none'));

    this.dragPuzzlePiece = puzzlePieze;
    this.dragPiece = piece;
    this.dragImage = dragImage;
    this.dragOffsetX = e.offsetX;
    this.dragOffsetY = e.offsetY;
  }

  protected swap(e: Event) {
    const button = e.target as any;
    const left = button.previousElementSibling;
    const right = button.nextElementSibling;
    left.right = left.right === Edge.EDGE1 ? Edge.EDGE2 : Edge.EDGE1;
    right.left = left.right;
  }
}
