import { Router } from '@vaadin/router';
import { routes } from './routes';
import { appStore } from './stores/app-store';
import 'github-corner';
import { SessionTrackerEndpoint } from './generated/endpoints';
export const router = new Router(document.querySelector('#outlet'));

router.setRoutes(routes);

window.addEventListener('vaadin-router-location-changed', (e) => {
  appStore.setLocation((e as CustomEvent).detail.location);
  const title = appStore.currentViewTitle;
  if (title) {
    document.title = title + ' | ' + appStore.applicationName;
  } else {
    document.title = appStore.applicationName;
  }
});

document.addEventListener('visibilitychange', () => {
  SessionTrackerEndpoint.setTabActive(document.visibilityState == 'visible');
});
SessionTrackerEndpoint.setTabActive(document.visibilityState == 'visible');
SessionTrackerEndpoint.setBrowser(window.navigator.userAgent);
