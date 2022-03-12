package org.vaadin.artur.hillapush.temperature;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import dev.hilla.Nonnull;

public interface TemperatureRepository extends JpaRepository<ValueWithTimestamp, String> {

    @Nonnull
    List<@Nonnull ValueWithTimestamp> findAllBySensorIdAndTimestampGreaterThan(String sensorId, long timestamp);

    @Nonnull
    List<@Nonnull ValueWithTimestamp> findAllByTimestampGreaterThan(long timestamp);

    // @Query("SELECT ValueWithTimestamp from ValueWithTimestamp order ")
    List<ValueWithTimestamp> findAllBySensorIdOrderByTimestamp(String sensorId, Pageable pageable);
}
