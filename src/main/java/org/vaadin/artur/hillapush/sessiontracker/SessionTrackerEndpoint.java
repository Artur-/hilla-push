package org.vaadin.artur.hillapush.sessiontracker;

import java.util.Collection;

import javax.servlet.http.HttpSession;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import org.springframework.beans.factory.annotation.Autowired;
import org.vaadin.artur.hillapush.sessiontracker.ActiveUserTracker.SessionInfo;

import dev.hilla.Endpoint;
import reactor.core.publisher.Flux;

@Endpoint
@AnonymousAllowed
public class SessionTrackerEndpoint {

    @Autowired
    private ActiveUserTracker activeUserTracker;

    @Autowired
    private HttpSession session;

    public String registerName(String name, String navigator) {
        DebugLogger.info("registerName " + name + " for " + session.getId());
        activeUserTracker.setInfo(session, name, navigator);
        return "";
    }

    public Flux<Collection<SessionInfo>> getActiveSessions() {
        Flux<Collection<SessionInfo>> endpointReturn = activeUserTracker.getActiveUsers()
                .map(event -> event.getUsers().values());
        return endpointReturn;
    }
    public void endSession(String sessionId) {
        activeUserTracker.getSession(sessionId).invalidate();
    }
}
