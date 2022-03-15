
import "@vaadin/button";
import '@vaadin/grid';
import '@vaadin/text-field';
import { TextField } from '@vaadin/text-field';
import { SessionTrackerEndpoint } from 'Frontend/generated/endpoints';
import SessionInfo from 'Frontend/generated/org/vaadin/artur/hillapush/sessiontracker/ActiveUserTracker/SessionInfo';
import { html, LitElement } from 'lit';
import { columnBodyRenderer } from 'lit-vaadin-helpers';
import { customElement, query, state } from 'lit/decorators.js';

@customElement('sessions-view')
export class SessionsView extends LitElement {
  name = '';
  @state()
  sessions: SessionInfo[] = [];

  @query("#name")
  nameField!: TextField;

  async connectedCallback() {
    super.connectedCallback();
    this.classList.add('flex', 'flex-col', 'p-m', 'gap-m');
    SessionTrackerEndpoint.getActiveSessions().onNext(value => {
      this.sessions = value as any as SessionInfo[];
    });
  }

  render() {
    return html`
    <vaadin-text-field id="name" label="Login by entering your name + enter" @keydown=${this.enterName}></vaadin-text-field>
    <h2>Active sessions</h2>
    <vaadin-grid .items=${this.sessions}>
      <vaadin-grid-column auto-width path="id"></vaadin-grid-column>
      <vaadin-grid-column auto-width path="navigator"></vaadin-grid-column>
      <vaadin-grid-column auto-width path="user"></vaadin-grid-column>
      <vaadin-grid-column auto-width flex-grow=0 ${columnBodyRenderer((item: SessionInfo) => html`<vaadin-button @click=${() => this.endSession(item)}>End session</vaadin-button>`)}> </vaadin-grid-column>
    </vaadin-grid>
      `;
  }

  private endSession(item: SessionInfo) {
    SessionTrackerEndpoint.endSession(item.id);
  }
  enterName(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      const name = this.nameField.value;
      SessionTrackerEndpoint.registerName(name, window.navigator.userAgent);
    }
  }

}
