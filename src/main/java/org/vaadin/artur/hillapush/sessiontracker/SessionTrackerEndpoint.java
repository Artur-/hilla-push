package org.vaadin.artur.hillapush.sessiontracker;

import java.util.Collection;
import java.util.List;

import javax.servlet.http.HttpSession;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import org.springframework.beans.factory.annotation.Autowired;
import org.vaadin.artur.hillapush.sessiontracker.ActiveUserTracker.SessionInfo;

import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import reactor.core.publisher.Flux;

@Endpoint
@AnonymousAllowed
public class SessionTrackerEndpoint {

    @Autowired
    private ActiveUserTracker activeUserTracker;

    @Autowired
    private HttpSession session;

    public String registerName(String name, String navigator) {
        activeUserTracker.setInfo(session.getId(), name, navigator);
        return "";
    }

    @Nonnull
    public Flux<Collection<SessionInfo>> getActiveSessions() {
        Flux<Collection<SessionInfo>> endpointReturn = activeUserTracker.getActiveUsers()
                .map(event -> event.getUsers().values());
        return endpointReturn;
    }
}
