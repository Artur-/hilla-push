import '@vaadin/button';
import '@vaadin/grid';
import '@vaadin/text-field';
import { SessionTrackerEndpoint } from 'Frontend/generated/endpoints';
import SessionInfo from 'Frontend/generated/org/vaadin/artur/hillapush/sessiontracker/ActiveUserTracker/SessionInfo';
import { sessionsStore } from 'Frontend/stores/sessions-store';
import { html, LitElement } from 'lit';
import { columnBodyRenderer } from 'lit-vaadin-helpers';
import { customElement } from 'lit/decorators.js';
import './fake-login';
import { View } from './view';

@customElement('sessions-view')
export class SessionsView extends View {
  async connectedCallback() {
    super.connectedCallback();
    this.classList.add('flex', 'flex-col', 'p-m', 'gap-m');
  }

  render() {
    return html`
      <fake-login></fake-login>
      <h2>Active sessions</h2>
      <vaadin-grid .items=${sessionsStore.sessions}>
        <vaadin-grid-column auto-width path="id"></vaadin-grid-column>
        <vaadin-grid-column auto-width path="navigator"></vaadin-grid-column>
        <vaadin-grid-column auto-width path="user"></vaadin-grid-column>
        <vaadin-grid-column
          auto-width
          flex-grow="0"
          ${columnBodyRenderer(
            (item: SessionInfo) =>
              html`<vaadin-button @click=${() => this.endSession(item)}>End session</vaadin-button>`
          )}
        >
        </vaadin-grid-column>
      </vaadin-grid>
    `;
  }

  private endSession(item: SessionInfo) {
    SessionTrackerEndpoint.endSession(item.id);
  }
}
