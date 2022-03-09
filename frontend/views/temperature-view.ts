import '@vaadin/charts';
import { HelloEndpoint } from 'Frontend/generated/endpoints';
import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('temperature-view')
export class TemperatureView extends LitElement {
  @state()
  series1: number[] = [];

  async connectedCallback() {
    super.connectedCallback();
    this.classList.add('flex', 'p-m', 'gap-m', 'items-end');
    HelloEndpoint.random(10, 15).onData(value => {
      this.series1 = [...this.series1, value];
    });
  }

  render() {
    return html`
    <vaadin-chart type="spline" title="Numbers from the server" tooltip>
      <vaadin-chart-series name="Random numbers between 0 and 15" .values=${this.series1}></vaadin-chart-series>
    </vaadin-chart>
    `;
  }

}
