package org.vaadin.artur.hillapush.puzzle;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.function.Consumer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import reactor.core.publisher.ConnectableFlux;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Sinks.EmitResult;
import reactor.core.publisher.Sinks.Many;

@Service
public class PuzzleService {

    private ConnectableFlux<List<Piece>> flux;
    private Many<List<Piece>> sink;
    private Random random = new Random();
    private int nextId = 1;
    private List<Piece> activePuzzle;
    private int N = 4;
    private int size = 500;

    public PuzzleService() {
        sink = Sinks.many().multicast().directBestEffort();
        flux = sink.asFlux().replay();
        flux.connect();
        newPuzzle();
        fireEvent();
    }

    private void newPuzzle() {
        long seed = System.currentTimeMillis();

        activePuzzle = new ArrayList<>();
        for (int x = 0; x < N; x++) {
            for (int y = 0; y < N; y++) {
                float top, left;
                if (random.nextBoolean()) {
                    // Below
                    top = random.nextFloat(size, size + 100);
                    left = random.nextFloat(0, size);
                } else {
                    // Right
                    left = random.nextFloat(size, size + 100);
                    top = random.nextFloat(0, size);
                }
                Piece p = new Piece();
                p.setId(nextId++);
                p.setTop(top);
                p.setLeft(left);
                p.setX(x); // FIXME insecure
                p.setY(y); // FIXME insecure
                p.setImageX(x); // FIXME insecure
                p.setImageY(y); // FIXME insecure

                p.setLeftEdge(leftEdge(x, y, N, seed));
                p.setRightEdge(leftEdge(x + 1, y, N, seed));
                p.setTopEdge(topEdge(x, y, N, seed));
                p.setBottomEdge(topEdge(x, y + 1, N, seed));
                p.setCorrectlyPlaced(false);
                p.setzIndex(1);
                activePuzzle.add(p);
            }
        }

    }

    private boolean randomBoolean(int i, long seed) {
        return new Random(i + seed).nextBoolean();
    }

    private Edge leftEdge(int x, int y, int n, long puzzleSeed) {
        if (x == 0 || x == n) {
            return Edge.STRAIGHT;
        }

        return randomBoolean(y * n + x, puzzleSeed * 100) ? Edge.EDGE1 : Edge.EDGE2;
    }

    private Edge topEdge(int x, int y, int n, long puzzleSeed) {
        if (y == 0 || y == n) {
            return Edge.STRAIGHT;
        }

        return randomBoolean(y * n + x, puzzleSeed * 10000) ? Edge.EDGE1 : Edge.EDGE2;
    }

    public Flux<List<Piece>> join() {
        return flux;
    }

    private Logger getLogger() {
        return LoggerFactory.getLogger(getClass());
    }

    public int getN() {
        return N;
    }

    public int getSize() {
        return size;
    }

    private void fireEvent() {
        sink.emitNext(activePuzzle, (a, b) -> {
            getLogger().warn("Failed: " + b);
            if (b == EmitResult.FAIL_ZERO_SUBSCRIBER) {
                return true;
            }
            return false;
        });

    }

    private synchronized void modify(Consumer<List<Piece>> modifier) {
        modifier.accept(this.activePuzzle);
        fireEvent();
    }

    public void startDrag(int id) {
        modify(pieces -> {
            Optional<Piece> maybePiece = pieces.stream().filter(p -> p.id == id).findFirst();
            if (!maybePiece.isPresent()) {
                getLogger().warn("Tried to move non-existing piece with id " + id);
                return;
            }
            Piece piece = maybePiece.get();
            piece.setDragging(true);
        });
    }

    public void dropPieceAt(int id, DropInfo dropInfo) {
        modify(pieces -> {
            Optional<Piece> maybePiece = pieces.stream().filter(p -> p.id == id).findFirst();
            if (!maybePiece.isPresent()) {
                getLogger().warn("Tried to move non-existing piece with id " + id);
                return;
            }
            Piece piece = maybePiece.get();
            piece.setDragging(false);
            if (isCorrectPlace(piece, dropInfo.getGridX(), dropInfo.getGridY())) {
                piece.setLeft(slotCoordinate(dropInfo.getGridX()));
                piece.setTop(slotCoordinate(dropInfo.getGridY()));
                piece.setCorrectlyPlaced(true);
            } else {
                piece.setLeft(dropInfo.getX());
                piece.setTop(dropInfo.getY());
                piece.setzIndex(1 + Collections.max(pieces, Comparator.comparing(p -> p.getzIndex())).getzIndex());
            }
            if (_isCompleted(pieces)) {
                new Thread(() -> {
                    try {
                        Thread.sleep(3000);
                    } catch (InterruptedException e) {
                    }
                    newPuzzle(); // FIXME locking
                    fireEvent();
                }).start();
            }
        });
        // this.lockIfInPlace(this.dragPiece!);
        // this.dragPiece!.zIndex =
        // 1 +
        // this.pieces
        // .filter((piece) => piece !== this.dragPiece)
        // .map((piece) => piece.zIndex)
        // .reduce((prev, current) => Math.max(prev, current));
        // if (this.pieces.map((piece) => piece.locked).reduce((prev, curr) => prev &&
        // curr)) {
        // // All done
        // this.success = true;
        // }

    }

    private boolean _isCompleted(List<Piece> pieces) {
        return pieces.stream().allMatch(piece -> piece.isCorrectlyPlaced());
    }

    private float slotCoordinate(int slotIndex) {
        return size / N * slotIndex;
    }

    private boolean isCorrectPlace(Piece piece, int gridX, int gridY) {
        return piece.getX() == gridX && piece.getY() == gridY;
    }


}
