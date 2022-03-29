package org.vaadin.artur.hillapush.crud;

import java.time.LocalDateTime;
import java.util.List;

import com.vaadin.exampledata.DataType;
import com.vaadin.exampledata.ExampleDataGenerator;
import com.vaadin.flow.spring.annotation.SpringComponent;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

@SpringComponent
public class DataGenerator {

    @Bean
    public CommandLineRunner loadData(PersonRepository personRepository) {

        return args -> {
            Logger logger = LoggerFactory.getLogger(getClass());
            if (personRepository.count() != 0L) {
                logger.info("Using existing database");
                return;
            }
            int seed = 123;

            logger.info("Generating demo data");
            logger.info("... generating 80 Person entities...");
            ExampleDataGenerator<Person> contactGenerator = new ExampleDataGenerator<>(Person.class,
                    LocalDateTime.now());
            contactGenerator.setData(Person::setName, DataType.FULL_NAME);
            contactGenerator.setData(Person::setOccupation, DataType.OCCUPATION);
            contactGenerator.setData(Person::setBirthDate, DataType.DATE_OF_BIRTH);

            List<Person> persons = contactGenerator.create(80, seed);

            personRepository.saveAll(persons);

            logger.info("Generated demo data");
        };
    }

}
