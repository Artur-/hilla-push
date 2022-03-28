import '@vaadin/text-field';
import '@vaadin/charts';
import { ChatEndpoint } from 'Frontend/generated/endpoints';
import { html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { TextField } from '@vaadin/text-field';
import { Subscription } from 'Frontend/generated/connect-client.default';

@customElement('chat-view')
export class ChatView extends LitElement {
  @state()
  messages: string[] = [];

  @query('#message')
  message!: TextField;
  chatConnection: Subscription<string> | undefined;

  async connectedCallback() {
    super.connectedCallback();
    this.style.height = 'calc(100% - 32px)';
    this.classList.add('flex', 'flex-col', 'p-m', 'gap-m');
    this.chatConnection = ChatEndpoint.join().onNext((msg) => {
      this.messages = [...this.messages, msg];
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.chatConnection) {
      this.chatConnection.cancel();
      this.chatConnection = undefined;
    }
  }

  render() {
    return html`
      <div style="flex-grow: 1;overflow:auto;">${this.messages.map((message) => html`<div>${message}</div>`)}</div>
      <vaadin-text-field id="message" autocomplete="off" @keydown=${this.messageKey}></vaadin-text-field>
    `;
  }

  private messageKey(e: KeyboardEvent) {
    if (e.key == 'Enter') {
      if (this.message.value.trim().length > 0) {
        ChatEndpoint.sendMessage(this.message.value);
      }
      this.message.clear();
    }
  }
}
