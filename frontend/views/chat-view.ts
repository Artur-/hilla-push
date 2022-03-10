
import "@vaadin/text-field";
import '@vaadin/charts';
import { ChatEndpoint } from 'Frontend/generated/endpoints';
import { html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { TextField } from "@vaadin/text-field";

@customElement('chat-view')
export class ChatView extends LitElement {
  @state()
  messages: string[] = [];

  @query("#message")
  message!: TextField;

  async connectedCallback() {
    super.connectedCallback();
    this.style.height = "calc(100% - 32px)";
    this.classList.add('flex', 'flex-col', 'p-m', 'gap-m');
    ChatEndpoint.join().onData(msg => {
      this.messages = [...this.messages, msg];
    });
  }

  render() {
    return html`
    <div style="flex-grow: 1;overflow:auto;">
    ${this.messages.map(message => html`<div>${message}</div>`)}
    </div>
    <vaadin-text-field id="message" @keydown=${this.messageKey}></vaadin-text-field>
    `;
  }

  private messageKey(e: KeyboardEvent) {
    if (e.key == "Enter") {
      ChatEndpoint.sendMessage(this.message.value);
      this.message.clear();
    }
  }

}
