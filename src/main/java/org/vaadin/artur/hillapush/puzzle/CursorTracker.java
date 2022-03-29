package org.vaadin.artur.hillapush.puzzle;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpSession;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.vaadin.artur.hillapush.sessiontracker.ActiveUserTracker;

import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Sinks.EmitResult;
import reactor.core.publisher.Sinks.Many;

@AnonymousAllowed
@Endpoint
public class CursorTracker {

    private final HttpSession httpSession;
    private final ActiveUserTracker activeUserTracker;

    private Map<String, Cursor> cursors = new ConcurrentHashMap<>();
    private Flux<List<Cursor>> flux;
    private Many<List<Cursor>> sink;

    private static final String[] colors = new String[] { "red", "green", "blue", "brown", "magenta" };

    @Autowired
    public CursorTracker(HttpSession httpSession, ActiveUserTracker activeUserTracker) {
        this.httpSession = httpSession;
        this.activeUserTracker = activeUserTracker;

        sink = Sinks.many().multicast().directBestEffort();
        flux = sink.asFlux();
    }

    @Nonnull
    public Flux<@Nonnull List<@Nonnull Cursor>> subscribe() {
        return flux;
    }

    public void trackCursor(int x, int y) {
        String sessionId = httpSession.getId();
        Cursor cursor = cursors.computeIfAbsent(sessionId, sid -> {
            Cursor c = new Cursor();
            c.setColor(colors[sessionId.charAt(0) % colors.length]);
            return c;
        });
        cursor.setName(activeUserTracker.getName(sessionId));
        cursor.setX(x);
        cursor.setY(y);

        fireEvent();
    }

    private void fireEvent() {
        List<Cursor> value = new ArrayList<>(cursors.values());
        sink.emitNext(value, (a, b) -> {
            if (b == EmitResult.FAIL_ZERO_SUBSCRIBER) {
                return true;
            }
            getLogger().warn("Failed: " + b);
            return false;
        });

    }

    private Logger getLogger() {
        return LoggerFactory.getLogger(getClass());
    }
}
