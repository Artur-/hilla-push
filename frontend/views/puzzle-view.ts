import { CursorTracker } from 'Frontend/generated/endpoints';
import Cursor from 'Frontend/generated/org/vaadin/artur/hillapush/puzzle/Cursor';
import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './puzzle-area';
import './puzzle-piece';
import { Layout, View } from './view';
import './cursor-indicator';

@customElement('puzzle-view')
export class PuzzleView extends Layout {
  sendTimer: any;
  cursorX: number = -1;
  cursorY: number = -1;
  @state()
  cursors: Cursor[] = [];

  static get styles() {
    return css`
      :host {
        display: block;
        position: relative;
        height: 100%;
      }
    `;
  }
  connectedCallback(): void {
    super.connectedCallback();

    CursorTracker.subscribe().onNext((cursors) => {
      this.cursors = cursors;
    });
  }
  render() {
    return html`
      ${this.cursors.map(
        (cursor) => html`<cursor-indicator .x=${cursor.x} .y=${cursor.y} .color=${cursor.color} .name=${cursor.name}></cursor-indicator>`
      )}
      <puzzle-area
        @dragover=${this.trackCursor}
        @mousemove=${this.trackCursor}
        style="width: 100%; height: 100%"
      ></puzzle-area>
    `;
  }
  private trackCursor(e: MouseEvent) {
    this.cursorX = e.offsetX;
    this.cursorY = e.offsetY;
    this.scheduleSend();
  }
  scheduleSend() {
    if (this.sendTimer) {
      return;
    }
    this.sendTimer = setTimeout(() => {
      CursorTracker.trackCursor(this.cursorX, this.cursorY);
      this.sendTimer = undefined;
    }, 100);
  }
}
