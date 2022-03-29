package org.vaadin.artur.hillapush.sessiontracker;

import java.util.Collection;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpSession;

import com.fasterxml.jackson.annotation.JsonIgnore;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import dev.hilla.Nonnull;
import reactor.core.publisher.ConnectableFlux;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Sinks.EmitResult;
import reactor.core.publisher.Sinks.Many;

@Service
public class ActiveUserTracker {

    public static class SessionInfo {
        @Nonnull
        private String id, user, navigator;

        private HttpSession session;
        private boolean tabActive = true;

        public SessionInfo(HttpSession session) {
            this.session = session;
            this.id = session.getId();
            this.user = "Anonymous";
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getUser() {
            return user;
        }

        public void setUser(String user) {
            this.user = user;
        }

        public String getNavigator() {
            return navigator;
        }

        public void setNavigator(String navigator) {
            this.navigator = navigator;
        }

        public boolean isTabActive() {
            return tabActive;
        }

        public void setTabActive(boolean tabActive) {
            this.tabActive = tabActive;
        }

        @JsonIgnore
        public HttpSession getSession() {
            return session;
        }

    }

    private ConcurrentHashMap<String, SessionInfo> activeUsers = new ConcurrentHashMap<>();

    private Many<ActiveUserEvent> source;

    private Flux<ActiveUserEvent> activeUsersFlux;

    public static class ActiveUserEvent {

        private ConcurrentHashMap<String, SessionInfo> users;

        public ActiveUserEvent(ConcurrentHashMap<String, SessionInfo> users) {
            this.users = users;
        }

        public ConcurrentHashMap<String, SessionInfo> getUsers() {
            return users;
        }

    }

    @PostConstruct
    private void init() {
        source = Sinks.many().multicast().directBestEffort();
        ConnectableFlux<ActiveUserEvent> flux = source.asFlux().replay(1);
        flux.connect();
        this.activeUsersFlux = flux;

        fireEvent();
    }

    void fireEvent() {
        source.emitNext(new ActiveUserEvent(activeUsers), (signalType, emitResult) -> {
            if (emitResult == EmitResult.FAIL_NON_SERIALIZED) {
                return true;
            }
            getLogger().error("Emit failure: " + emitResult);
            return false;
        });
    }

    public void register(HttpSession session) {
        String sessionId = session.getId();
        getLogger().info("New session: " + sessionId);
        activeUsers.put(sessionId, new SessionInfo(session));
        fireEvent();
    }

    private Logger getLogger() {
        return LoggerFactory.getLogger(getClass());
    }

    public void unregister(String sessionId) {
        activeUsers.remove(sessionId);
        fireEvent();
    }

    public Collection<SessionInfo> getAll() {
        return activeUsers.values();
    }

    public Flux<ActiveUserEvent> getActiveUsers() {
        return activeUsersFlux;
    }

    public HttpSession getSession(String sessionId) {
        return activeUsers.get(sessionId).getSession();
    }

    public void setTabActive(HttpSession session, boolean tabActive) {
        getLogger().info("Session: " + session.getId() + " active: " + tabActive);
        SessionInfo sessionInfo = activeUsers.computeIfAbsent(session.getId(), sid -> new SessionInfo(session));
        sessionInfo.setTabActive(tabActive);
        fireEvent();
    }

    public void setName(HttpSession session, String name) {
        getLogger().info("Session: " + session.getId() + " is used by " + name);
        SessionInfo sessionInfo = activeUsers.computeIfAbsent(session.getId(), sid -> new SessionInfo(session));
        sessionInfo.setUser(name);
        fireEvent();
    }

    public String getName(String sessionId) {
        SessionInfo info =  activeUsers.get(sessionId);
        if (info != null) {
            return info.getUser();
        }
        return "???";
    }


    public void setBrowser(HttpSession session, String browser) {
        SessionInfo sessionInfo = activeUsers.computeIfAbsent(session.getId(), sid -> new SessionInfo(session));
        sessionInfo.setNavigator(browser);
        fireEvent();
    }


}
