import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import './puzzle-piece';
import './puzzle-area';
import { View } from './view';

@customElement('puzzle-view')
export class PuzzleView extends View {
  render() {
    return html` <puzzle-area style="width: 100%; height: 100%"></puzzle-area> `;
  }
}
