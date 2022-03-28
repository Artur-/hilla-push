import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import seedrandom from 'seedrandom';
import './puzzle-piece';
import { Edge, PuzzlePiece } from './puzzle-piece';
import { Layout } from './view';

interface Piece {
  id: number;
  top: number;
  left: number;
  x: number;
  y: number;
  leftEdge: Edge;
  rightEdge: Edge;
  topEdge: Edge;
  bottomEdge: Edge;
  imageX: number;
  imageY: number;
  locked: boolean;
  zIndex: number;
}

const randomBoolean1 = (i: number): boolean => {
  return seedrandom('boolean1-' + i)() > 0.5;
};
const randomBoolean2 = (i: number): boolean => {
  return seedrandom('boolean2-' + i)() > 0.5;
};
const leftEdge = (x: number, y: number, N: number): Edge => {
  if (x === 0 || x === N) {
    return Edge.STRAIGHT;
  }

  return randomBoolean1(y * N + x) ? Edge.EDGE1 : Edge.EDGE2;
};

const topEdge = (x: number, y: number, N: number): Edge => {
  if (y === 0 || y === N) {
    return Edge.STRAIGHT;
  }
  return randomBoolean2(y * N + x) ? Edge.EDGE1 : Edge.EDGE2;
};

const random = (min: number, range: number): number => {
  return min + Math.random() * range;
};
@customElement('puzzle-area')
export class PuzzleArea extends Layout {
  private pieces: Piece[] = [];
  private N = 4;
  private size = 500;
  private imageWidth = 1000;
  private pieceImageSize = this.N * 50;
  private piecePadding: number;
  private pieceInnerSize: number;
  private pieceOuterSize: number;
  private image: string =
    'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80';
  dragPuzzlePiece?: PuzzlePiece;
  dragPiece?: Piece;
  dragImage?: Element;
  dragOffsetX?: number;
  dragOffsetY?: number;
  private success = false;

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
  constructor() {
    super();
    let id = 0;
    const img = '';

    this.pieceInnerSize = this.size / this.N;
    this.pieceOuterSize = (this.pieceInnerSize * 18.75) / 11.72;
    this.piecePadding = (this.pieceOuterSize - this.pieceInnerSize) / 2;

    for (let x = 0; x < this.N; x++) {
      for (let y = 0; y < this.N; y++) {
        let top, left;
        if (Math.random() > 0.5) {
          // Below
          top = random(this.size, this.pieceInnerSize * 2);
          left = random(0, this.size);
        } else {
          // Right
          top = random(0, this.size);
          left = random(this.size, this.pieceInnerSize * 2);
        }

        this.pieces.push({
          id: id++,
          top,
          left,
          x: x,
          y: y,
          imageX: x,
          imageY: y,
          leftEdge: leftEdge(x, y, this.N),
          rightEdge: leftEdge(x + 1, y, this.N),
          topEdge: topEdge(x, y, this.N),
          bottomEdge: topEdge(x, y + 1, this.N),
          locked: false, //randomBoolean1(x),
          zIndex: 1,
        });
      }
    }
  }

  render() {
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
          <div style=${this.success ? '' : 'display:none'} class="success">👍</div>
          ${this.pieces.map((piece) => {
            const zIndex = piece.locked ? 0 : piece.zIndex;
            return html` <puzzle-piece
              style="position: absolute;top: ${piece.top}px; left: ${piece.left}px; width: var(--piece-size);height:var(--piece-size); z-index: ${zIndex}"
              draggable="${!piece.locked}"
              @dragstart=${(e: DragEvent) => this.dragStart(e, piece)}
              @dragend=${this.dragEnd}
              .pieceId=${piece.id}
              .left="${piece.leftEdge}"
              .top="${piece.topEdge}"
              .right="${piece.rightEdge}"
              .bottom="${piece.bottomEdge}"
              .x="${piece.imageX}"
              .y="${piece.imageY}"
              .locked=${piece.locked}
              .image=${this.image}
              .imageSize=${this.imageWidth}
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
  private drop(e: DragEvent) {
    const dropElement = e.target as HTMLElement;
    let x = e.offsetX - this.dragOffsetX!;
    let y = e.offsetY - this.dragOffsetY!;
    if (dropElement.tagName === 'PUZZLE-PIECE') {
      x += dropElement.offsetLeft;
      y += dropElement.offsetTop;
    }
    this.dragPiece!.left = x > -this.piecePadding ? x : -this.piecePadding;
    this.dragPiece!.top = y > -this.piecePadding ? y : -this.piecePadding;

    this.lockIfInPlace(this.dragPiece!);
    this.dragPiece!.zIndex =
      1 +
      this.pieces
        .filter((piece) => piece !== this.dragPiece)
        .map((piece) => piece.zIndex)
        .reduce((prev, current) => Math.max(prev, current));

    if (this.pieces.map((piece) => piece.locked).reduce((prev, curr) => prev && curr)) {
      // All done
      this.success = true;
    }
    this.requestUpdate('pieces');
  }

  private lockIfInPlace(piece: Piece) {
    const correctX = -this.piecePadding + this.pieceInnerSize * piece.x;
    const correctY = -this.piecePadding + this.pieceInnerSize * piece.y;

    if (Math.abs(piece.left - correctX) < 10 && Math.abs(piece.top - correctY) < 10) {
      piece.locked = true;
      piece.left = correctX;
      piece.top = correctY;
      piece.zIndex = 0;
    }
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
