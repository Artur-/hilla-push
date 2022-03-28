import '@vaadin/button';
import '@vaadin/grid';
import {
  Grid,
  GridActiveItemChangedEvent,
  GridDataProviderCallback,
  GridDataProviderParams,
  GridSelectedItemsChangedEvent,
} from '@vaadin/grid';
import { Notification } from '@vaadin/notification';
import '@vaadin/text-field';
import Sort from 'Frontend/generated/dev/hilla/mappedtypes/Sort';
import { CrudEndpoint } from 'Frontend/generated/endpoints';
import Direction from 'Frontend/generated/org/springframework/data/domain/Sort/Direction';
import Person from 'Frontend/generated/org/vaadin/artur/hillapush/crud/Person';
import { html, LitElement } from 'lit';
import { customElement, query } from 'lit/decorators.js';

let lastActiveItem: any | null = null;
const makeGridSingleSelect = (event: GridActiveItemChangedEvent<Person>) => {
  const item: Person = event.detail.value;
  if (item === lastActiveItem) {
    return;
  }
  lastActiveItem = item;
  const grid: Grid = event.target as Grid;
  if (item) {
    if (grid.selectedItems.length === 1 && grid.selectedItems[0] === item) {
      return;
    }
    grid.selectedItems = [item];
  } else {
    if (grid.selectedItems.length === 0) {
      return;
    }
    grid.selectedItems = [];
  }
};

@customElement('crud-view')
export class CrudView extends LitElement {
  private async getGridData(
    params: GridDataProviderParams<Person>,
    callback: GridDataProviderCallback<Person | undefined>
  ) {
    const sort: Sort = {
      orders: params.sortOrders.map((order) => ({
        property: order.path,
        direction: order.direction == 'asc' ? Direction.ASC : Direction.DESC,
        ignoreCase: false,
      })),
    };
    const data = await CrudEndpoint.list({ pageNumber: params.page, pageSize: params.pageSize, sort });
    const hasMore = data.length == params.pageSize;
    callback(data, params.page * params.pageSize + data.length + (hasMore ? 1 : 0));
  }

  render() {
    return html`
      <vaadin-grid
        .dataProvider=${this.getGridData}
        @active-item-changed=${makeGridSingleSelect}
        @selected-items-changed=${this.itemSelected}
      >
        <vaadin-grid-column auto-width path="name"></vaadin-grid-column>
        <vaadin-grid-column auto-width path="occupation"></vaadin-grid-column>
        <vaadin-grid-column auto-width path="birthDate"></vaadin-grid-column>
      </vaadin-grid>
    `;
  }
  private itemSelected(event: GridSelectedItemsChangedEvent<Person>) {
    const item = event.detail.value;
    console.log('Selected item changed', item);

    Notification.show('Selected:' + event.detail.value.map((p) => p.name).join(','));
  }
}
