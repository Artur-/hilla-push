import '@vaadin/avatar-group';
import '@vaadin/grid';
import '@vaadin/text-field';
import 'a-avataaar';
import { sessionsStore } from 'Frontend/stores/sessions-store';
import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { Layout } from './view';
import './fake-login';

@customElement('online-indicator-view')
export class OnlineIndicatorView extends Layout {
  static get styles() {
    return css`
      .inactive {
        opacity: 0.3;
      }
    `;
  }
  async connectedCallback() {
    super.connectedCallback();
    this.classList.add('flex', 'flex-col', 'p-m', 'gap-m');
  }

  render() {
    return html`
      <fake-login></fake-login>

      <div style="display: flex; flex-direction: row">
        ${sessionsStore.sessions.map(
          (session) => html`
            <div style="padding-right: 1em; display: flex; flex-direction: column">
              <a-avataaar class=${classMap({ inactive: !session.tabActive })} .identifier=${session.user}></a-avataaar>
              ${session.user}
            </div>
          `
        )}
      </div>
    `;
  }
}
