package org.vaadin.artur.hillapush.temperature;

import java.util.Arrays;
import java.util.List;

import com.google.common.collect.Lists;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Sinks.Many;

@Service
public class TemperatureService {

    TemperatureRepository temperatureRepository;
    private Flux<ValueWithTimestamp> flux;
    private Many<ValueWithTimestamp> sink;

    private long lastHandledTimestamp = 0L;

    public Flux<ValueWithTimestamp> get(String sensorId) {
        return flux.filter(p -> p.getSensorId().equals(sensorId));
    }

    public TemperatureService(TemperatureRepository temperatureRepository) {
        this.temperatureRepository = temperatureRepository;

        sink = Sinks.many().multicast().directBestEffort();
        flux = sink.asFlux();
    }

    public void newValueReceived() {
        temperatureRepository.findAllByTimestampGreaterThan(lastHandledTimestamp)
                .forEach(value -> {
                    lastHandledTimestamp = Math.max(lastHandledTimestamp, value.getTimestamp());
                    sink.emitNext(value, (a, b) -> {
                        getLogger().warn("Failed: " + b);
                        return false;
                    });
                });
    }

    private Logger getLogger() {
        return LoggerFactory.getLogger(getClass());
    }

    public List<String> getSensorIds() {
        return Arrays.asList("Kitchen", "Living Room", "Basement");

    }
}
