package org.vaadin.artur.hillapush.crud;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, String> {
    
}
