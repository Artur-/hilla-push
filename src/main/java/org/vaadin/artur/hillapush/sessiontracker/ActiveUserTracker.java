package org.vaadin.artur.hillapush.sessiontracker;

import java.util.Collection;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import reactor.core.publisher.ConnectableFlux;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Sinks.Many;

@Service
public class ActiveUserTracker {
    // public record SessionInfo(String id, String owner) {
    // }

    public static class SessionInfo {
        private String id, owner, navigator;

        public SessionInfo(String id, String owner) {
            this.id = id;
            this.owner = owner;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getOwner() {
            return owner;
        }

        public void setOwner(String owner) {
            this.owner = owner;
        }

        public String getNavigator() {
            return navigator;
        }

        public void setNavigator(String navigator) {
            this.navigator = navigator;
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
            getLogger().error("Emit failure: " + emitResult);
            return false;
        });
    }

    public void register(String sessionId) {
        getLogger().info("New session: " + sessionId);
        activeUsers.put(sessionId, new SessionInfo(sessionId, "Anonymous"));
        fireEvent();
    }

    private Logger getLogger() {
        return LoggerFactory.getLogger(getClass());
    }

    public void setInfo(String sessionId, String name, String navigator) {
        getLogger().info("Session: " + sessionId + " is used by " + name);
        activeUsers.get(sessionId).setOwner(name);
        activeUsers.get(sessionId).setNavigator(navigator);
        fireEvent();
    }

    public void unregister(String sessionId) {
        activeUsers.remove(sessionId);
    }

    public Collection<SessionInfo> getAll() {
        return activeUsers.values();
    }

    public Flux<ActiveUserEvent> getActiveUsers() {
        return activeUsersFlux;
    }

}
