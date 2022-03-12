import '@vaadin/charts';
import '@vaadin/charts/src/vaadin-chart-series';
import { TemperatureEndpoint } from 'Frontend/generated/endpoints';
import { Options } from 'highcharts';
import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('temperature-view')
export class TemperatureView extends LitElement {
  @state()
  temperatures: Record<string, number[][]> = {};


  async connectedCallback() {
    super.connectedCallback();
    this.classList.add('flex', 'p-m', 'gap-m', 'items-end');

    const sensors = await TemperatureEndpoint.getSensorIds();

    sensors.forEach(sensorId => {
      TemperatureEndpoint.getHistory(sensorId).then(values => {
        this.temperatures[sensorId] = values.map(value => {
          return [value.timestamp, value.value]
        })
        const lastTimestamp = this.temperatures[sensorId][this.temperatures[sensorId].length - 1][0];
        TemperatureEndpoint.subscribeToUpdates(sensorId, lastTimestamp).onData(value => {
          this.temperatures[sensorId] = [...this.temperatures[sensorId], [value.timestamp, value.value]];
          this.temperatures = { ...this.temperatures };
        })
        this.temperatures = { ...this.temperatures };
      });
    });
  }

  render() {
    const opt: Options = { xAxis: { type: "datetime" } };
    return html`
    <vaadin-chart  title="Temperatures" tooltip .additionalOptions=${opt}>
      <vaadin-chart-series title="Kitchen" .values=${this.temperatures["Kitchen"]}></vaadin-chart-series>
      <vaadin-chart-series title="Living room" .values=${this.temperatures["Living Room"]}></vaadin-chart-series>
      <vaadin-chart-series title="Basement" .values=${this.temperatures["Basement"]}></vaadin-chart-series>
    </vaadin-chart>
        `;
  }

}
