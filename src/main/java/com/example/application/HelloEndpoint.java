package com.example.application;

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
    public String hello(String name) {
        return "Hello " + name;
    }

    @Nonnull
    public Flux<@Nonnull Integer> countTo(int number, int delay) {
        return Flux.range(1, number).delayElements(Duration.ofMillis(delay));
    }

    @Nonnull
    public Flux<@Nonnull Integer> random(int number, int maxValue) {
        return Flux.create(emitter -> {
            for (int i = 0; i < number; i++) {
                emitter.next(r.nextInt(maxValue));
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                }
            }
        });
    }
}
