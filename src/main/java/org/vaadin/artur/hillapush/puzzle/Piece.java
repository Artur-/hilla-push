package org.vaadin.artur.hillapush.puzzle;

import dev.hilla.Nonnull;

public class Piece {
    int id;
    private float top;
    private float left;
    private int x;
    private int y;
    @Nonnull
    private Edge leftEdge;
    @Nonnull
    private Edge rightEdge;
    @Nonnull
    private Edge topEdge;
    @Nonnull
    private Edge bottomEdge;

    private int imageX;
    private int imageY;
    private boolean correctlyPlaced, dragging;
    private int zIndex;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public float getTop() {
        return top;
    }

    public void setTop(float top) {
        this.top = top;
    }

    public float getLeft() {
        return left;
    }

    public void setLeft(float left) {
        this.left = left;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public Edge getLeftEdge() {
        return leftEdge;
    }

    public void setLeftEdge(Edge leftEdge) {
        this.leftEdge = leftEdge;
    }

    public Edge getRightEdge() {
        return rightEdge;
    }

    public void setRightEdge(Edge rightEdge) {
        this.rightEdge = rightEdge;
    }

    public Edge getTopEdge() {
        return topEdge;
    }

    public void setTopEdge(Edge topEdge) {
        this.topEdge = topEdge;
    }

    public Edge getBottomEdge() {
        return bottomEdge;
    }

    public void setBottomEdge(Edge bottomEdge) {
        this.bottomEdge = bottomEdge;
    }

    public int getImageX() {
        return imageX;
    }

    public void setImageX(int imageX) {
        this.imageX = imageX;
    }

    public int getImageY() {
        return imageY;
    }

    public void setImageY(int imageY) {
        this.imageY = imageY;
    }

    public void setCorrectlyPlaced(boolean correctlyPlaced) {
        this.correctlyPlaced = correctlyPlaced;
    }

    public boolean isCorrectlyPlaced() {
        return correctlyPlaced;
    }

    public void setDragging(boolean dragging) {
        this.dragging = dragging;
    }

    public boolean isDragging() {
        return dragging;
    }

    public int getzIndex() {
        return zIndex;
    }

    public void setzIndex(int zIndex) {
        this.zIndex = zIndex;
    }

}
