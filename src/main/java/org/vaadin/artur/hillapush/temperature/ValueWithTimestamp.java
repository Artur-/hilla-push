package org.vaadin.artur.hillapush.temperature;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;

import dev.hilla.Nonnull;

@Entity
public class ValueWithTimestamp {

    @Id
    @GeneratedValue
    private int id;

    @Nonnull
    @JsonIgnore
    private String sensorId;
    private long timestamp;
    private double value;

    public int getId() {
        return id;
    }

    public String getSensorId() {
        return sensorId;
    }

    public void setSensorId(String sensorId) {
        this.sensorId = sensorId;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

}
