package org.vaadin.artur.hillapush.puzzle;

import java.util.List;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import org.springframework.beans.factory.annotation.Autowired;

import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import reactor.core.publisher.Flux;

@Endpoint
@AnonymousAllowed
public class PuzzleEndpoint {

    private final PuzzleService puzzleService;

    @Autowired
    public PuzzleEndpoint(PuzzleService puzzleService) {
        this.puzzleService = puzzleService;
    }

    @Nonnull
    public Flux<@Nonnull List<@Nonnull Piece>> join() {
        return puzzleService.join();
    }

    @Nonnull
    public SizeInfo getInfo() {
        SizeInfo info = new SizeInfo();
        info.setN(puzzleService.getN());
        info.setSize(puzzleService.getSize());
        return info;
    }

    public void dropPieceAt(int id, DropInfo dropInfo) {
        puzzleService.dropPieceAt(id, dropInfo);

    }
}
