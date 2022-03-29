package org.vaadin.artur.hillapush.puzzle;

import com.fasterxml.jackson.annotation.JsonIgnore;

import dev.hilla.Nonnull;

public class Cursor {

    private float x, y;
    @Nonnull
    private String color;
    @Nonnull
    private String name;
    @Nonnull
    @JsonIgnore
    private String sessionId;

    public float getX() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
}
