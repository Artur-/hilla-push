import { SessionTrackerEndpoint } from './generated/endpoints';
import { v4 as uuidv4 } from 'uuid';

document.addEventListener('visibilitychange', () => {
  SessionTrackerEndpoint.setTabActive(document.visibilityState == 'visible');
});
SessionTrackerEndpoint.setTabActive(document.visibilityState == 'visible');
SessionTrackerEndpoint.setBrowser(window.navigator.userAgent);

export const getUserId = () => {
  let userId = localStorage.getItem('user-id');
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('user-id', userId);
  }
  return userId;
};
