import '@vaadin/button';
import '@vaadin/notification';
import { Notification } from '@vaadin/notification';
import '@vaadin/text-field';
import { HelloEndpoint } from 'Frontend/generated/endpoints';
import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@vaadin/vaadin-charts'
import 'github-corner'

@customElement('main-view')
export class MainView extends LitElement {
  name = '';
  @state()
  number: number = 0;
  @state()
  number2: number = 0;
  @state()
  series1: number[] = [];

  async connectedCallback() {
    super.connectedCallback();
    this.classList.add('flex', 'p-m', 'gap-m', 'items-end');
    HelloEndpoint.countTo(5, 500).onData(value => {
      this.number = value;
    });
    HelloEndpoint.countTo(10, 200).onData(value => {
      this.number2 = value;
    });
    HelloEndpoint.random(10, 15).onData(value => {
      this.series1 = [...this.series1, value];
    });

  }

  render() {
    return html`
    <github-corner>
  <a href="https://github.com/Artur-/hilla-push">GitHub</a>
</github-corner>

    <p>Counting slowly to 5: ${this.number}</p>
    <p>Counting quickly to 10: ${this.number2}</p>
    <vaadin-chart type="spline" title="Numbers from the server" tooltip>
      <vaadin-chart-series name="Random numbers between 0 and 15" .values=${this.series1}></vaadin-chart-series>
    </vaadin-chart>
    <vaadin-chart type="area">
      <vaadin-chart-series>
        </vaadin-chart-series>
        </vaadin-chart>
      <vaadin-text-field label="Your name" @value-changed=${this.nameChanged}></vaadin-text-field>
      <vaadin-button @click=${this.sayHello}>Say hello</vaadin-button>
    `;
  }

  nameChanged(e: CustomEvent) {
    this.name = e.detail.value;
  }

  async sayHello() {
    Notification.show(await HelloEndpoint.hello(this.name));
  }
}
