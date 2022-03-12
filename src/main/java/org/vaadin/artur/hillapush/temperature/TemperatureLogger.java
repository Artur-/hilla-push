package org.vaadin.artur.hillapush.temperature;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;

import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class TemperatureLogger {

    private final TemperatureRepository temperatureRepository;
    private final TemperatureService temperatureService;
    private final Random random;

    public TemperatureLogger(TemperatureService temperatureService, TemperatureRepository temperatureRepository) {
        this.temperatureRepository = temperatureRepository;
        this.temperatureService = temperatureService;
        this.random = new Random(1);
    }

    @Scheduled(fixedRate = 5000)
    public void recordTemperature() {
        temperatureService.getSensorIds().forEach(sensorId -> readSensor(sensorId));

        temperatureService.newValueReceived();
    }

    private void readSensor(String sensorId) {
        List<ValueWithTimestamp> lastList = temperatureRepository.findAllBySensorIdOrderByTimestamp(sensorId,
                PageRequest.of(0, 1));
        ValueWithTimestamp last;
        if (lastList.isEmpty()) {
            last = new ValueWithTimestamp();
            last.setTimestamp(Instant.now().minus(5, ChronoUnit.SECONDS).toEpochMilli());
            last.setValue(20.0 + random.nextInt(5) - 2.5);
        } else {
            last = lastList.get(0);
        }
        ValueWithTimestamp value = new ValueWithTimestamp();
        value.setTimestamp(Instant.now().toEpochMilli());
        value.setValue(Math.round(10 * (last.getValue() + (random.nextGaussian()) * 0.5)) / 10.0);
        value.setSensorId(sensorId);
        temperatureRepository.save(value);

    }

}
