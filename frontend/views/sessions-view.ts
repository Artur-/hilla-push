import '@vaadin/grid';
import '@vaadin/text-field';
import { TextField } from '@vaadin/text-field';
import { SessionTrackerEndpoint } from 'Frontend/generated/endpoints';
import SessionInfo from 'Frontend/generated/org/vaadin/artur/hillapush/sessiontracker/ActiveUserTracker/SessionInfo';
import { html, LitElement } from 'lit';
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
    this.classList.add('flex','flex-col', 'p-m', 'gap-m');
    SessionTrackerEndpoint.getActiveSessions().onData(value => {
      this.sessions = value as any as SessionInfo[];
    });
  }

  render() {
    return html`
    <vaadin-text-field id="name" label="Login by entering your name + enter" @keydown=${this.enterName}></vaadin-text-field>
    <h2>Active sessions</h2>
    <vaadin-grid .items=${this.sessions}>
      <vaadin-grid-column path="id"></vaadin-grid-column>
      <vaadin-grid-column path="owner"></vaadin-grid-column>
    </vaadin-grid>
    `;
  }

  enterName(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      const name = this.nameField.value;
      SessionTrackerEndpoint.registerName(name,window.navigator.userAgent);
    }
  }

}
