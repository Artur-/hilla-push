package org.vaadin.artur.hillapush.temperature;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import org.springframework.beans.factory.annotation.Autowired;

import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import reactor.core.publisher.ConnectableFlux;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Sinks.Many;

@Endpoint
@AnonymousAllowed
public class TemperatureEndpoint {
    Random r = new Random();

    private final TemperatureRepository temperatureRepository;
    private final TemperatureService temperatureService;

    public TemperatureEndpoint(TemperatureService temperatureService, TemperatureRepository temperatureRepository) {
        this.temperatureService = temperatureService;
        this.temperatureRepository = temperatureRepository;
    }

    @Nonnull
    public List<@Nonnull String> getSensorIds() {
        return temperatureService.getSensorIds();
    }
    /** Get history data for the last hour. */
    @Nonnull
    public List<@Nonnull ValueWithTimestamp> getHistory(String sensorId) {
        return temperatureRepository
                .findAllBySensorIdAndTimestampGreaterThan(sensorId, Instant.now().minus(1, ChronoUnit.HOURS).toEpochMilli());
    }

    @Nonnull
    public Flux<@Nonnull ValueWithTimestamp> subscribeToUpdates(String sensorId, long afterTimestamp) {
        return temperatureService.get(sensorId).filter(value -> value.getTimestamp() > afterTimestamp);
    }

}
