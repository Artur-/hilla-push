package org.vaadin.artur.hillapush.chat;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import org.springframework.beans.factory.annotation.Autowired;

import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import reactor.core.publisher.Flux;

@Endpoint
@AnonymousAllowed
public class ChatEndpoint {

    @Autowired
    private ChatService chatService;

    @Nonnull
    public Flux<@Nonnull String> join() {
        return chatService.join();
    }

    public void sendMessage(String message) {
        chatService.send(message);
    }
}
