package org.vaadin.artur.hillapush.chat;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoField;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Service;

import reactor.core.publisher.ConnectableFlux;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Sinks.Many;

@Service
public class ChatService {

    private static final int MESSAGE_HISTORY_ON_JOIN = 20;

    private Flux<String> chat;
    private Many<String> chatSink;

    public Flux<String> join() {
        return chat;
    }

    @PostConstruct
    private void init() {
        chatSink = Sinks.many().multicast().directBestEffort();
        ConnectableFlux<String> flux = chatSink.asFlux().replay(MESSAGE_HISTORY_ON_JOIN);
        flux.connect();
        this.chat = flux;
        chatSink.emitNext("Hello", (a, b) -> false);
    }

    public void send(String message) {
        String timestamp = LocalTime.now().with(ChronoField.MILLI_OF_SECOND, 0).format(DateTimeFormatter.ISO_TIME);
        chatSink.emitNext(timestamp + ": " + message, (a, b) -> false);
    }

}
