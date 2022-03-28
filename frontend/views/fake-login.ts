import '@vaadin/text-field';
import { TextField } from '@vaadin/text-field';
import { SessionTrackerEndpoint } from 'Frontend/generated/endpoints';
import { html, LitElement } from 'lit';
import { customElement, query } from 'lit/decorators.js';

@customElement('fake-login')
export class FakeLogin extends LitElement {
  @query('#name')
  nameField!: TextField;

  render() {
    return html` <vaadin-text-field
      style="width: 20em"
      id="name"
      label="Login by entering your name + enter"
      @keydown=${this.enterName}
    ></vaadin-text-field>`;
  }

  enterName(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      const name = this.nameField.value;
      SessionTrackerEndpoint.setName(name);
    }
  }
}
