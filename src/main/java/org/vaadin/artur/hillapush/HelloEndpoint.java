package org.vaadin.artur.hillapush;

import java.time.Duration;
import java.util.Random;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import reactor.core.publisher.Flux;

@Endpoint
@AnonymousAllowed
public class HelloEndpoint {
    Random r = new Random();

    @Nonnull
    public Flux<@Nonnull Integer> countTo(int number, int delay) {
        return Flux.range(1, number).delayElements(Duration.ofMillis(delay));
    }

    @Nonnull
    public Flux<@Nonnull Integer> countToAndFail(int number, int delay) {
        return Flux.range(1, number).delayElements(Duration.ofMillis(delay)).map(nr -> {
            if (nr > 5) {
                throw new RuntimeException("Counting failed");
            }
            return nr;
        });
    }

    @Nonnull
    public Flux<@Nonnull Integer> random(int number, int maxValue) {
        return Flux.range(1, number).delayElements(Duration.ofMillis(500)).map(nr -> r.nextInt(maxValue));
    }

}
