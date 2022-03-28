import { SessionTrackerEndpoint } from 'Frontend/generated/endpoints';
import SessionInfo from 'Frontend/generated/org/vaadin/artur/hillapush/sessiontracker/ActiveUserTracker/SessionInfo';
import { makeAutoObservable } from 'mobx';

export class SessionsStore {
  sessions: SessionInfo[] = [];

  constructor() {
    makeAutoObservable(this);
    SessionTrackerEndpoint.getActiveSessions().onNext((sessions) => {
      this.sessions = sessions;
    });
  }
}

export const sessionsStore = new SessionsStore();
