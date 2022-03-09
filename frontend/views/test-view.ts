import { HelloEndpoint } from 'Frontend/generated/endpoints';
import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('test-view')
export class TestView extends LitElement {

  @state()
  number: number | undefined;
  @state()
  number2: number | undefined;

  async connectedCallback() {
    super.connectedCallback();
    this.classList.add('flex', 'p-m', 'gap-m', 'items-end');
    HelloEndpoint.countTo(5, 1000).onData(value => {
      this.number = value;
    });
    HelloEndpoint.countTo(10, 200).onData(value => {
      this.number2 = value;
    });
  }

  render() {
    return html`
    <p>Counting slowly to 5: ${this.number}</p>
    <p>Counting quickly to 10: ${this.number2}</p>
    `;
  }

}
