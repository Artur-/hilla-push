import { HelloEndpoint } from 'Frontend/generated/endpoints';
import { html, LitElement, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('test-view')
export class TestView extends LitElement {

  @state()
  countDone = false;
  @state()
  count2Done = false;
  @state()
  count3Done = false;
  @state()
  count3Error = false;
  @state()
  number: number = 0;
  @state()
  number2: number = 0;
  @state()
  number3: number = 0;

  async connectedCallback() {
    super.connectedCallback();
    this.classList.add('flex', 'flex-col', 'p-m');
    HelloEndpoint.countTo(5, 1000).onNext(value => {
      this.number = value;
    }).onComplete(() => {
      this.countDone = true;
    });
    HelloEndpoint.countTo(10, 200).onNext(value => {
      this.number2 = value;
    }).onComplete(() => {
      this.count2Done = true;
    });
    HelloEndpoint.countToAndFail(10, 200).onNext(value => {
      this.number3 = value;
    }).onComplete(() => {
      this.count3Done = true;
    }).onError(() => {
      this.count3Error = true;
    });
  }

  render() {
    return html`
    <p>Count slowly to 5: ${this.number}${this.countDone ? html` (done)` : nothing}</p>
    <p>Count quickly to 10: ${this.number2}${this.count2Done ? html` (done)` : nothing}</p>
    <p>Count quickly to 10 but fail: ${this.number3}${this.count3Done ? html` (done)` : nothing}${this.count3Error ? html` (failed)` : nothing}</p>
    `;
  }

}
