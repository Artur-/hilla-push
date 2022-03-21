package org.vaadin.artur.hillapush.crud;

import com.vaadin.flow.server.auth.AnonymousAllowed;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import dev.hilla.Endpoint;
import dev.hilla.Nonnull;

@Endpoint
@AnonymousAllowed
public class CrudEndpoint {

    private final PersonRepository crudRepository;

    public CrudEndpoint(PersonRepository crudRepository) {
        this.crudRepository = crudRepository;
    }

    @Nonnull
    public Page<@Nonnull Person> list(Pageable pageable) {
        return crudRepository.findAll(pageable);
    }
}
