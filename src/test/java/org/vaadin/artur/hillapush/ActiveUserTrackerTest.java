package org.vaadin.artur.hillapush;

import java.time.Duration;

import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.vaadin.artur.hillapush.sessiontracker.ActiveUserTracker;

@SpringBootTest
public class ActiveUserTrackerTest {

    @Autowired
    ActiveUserTracker t;

    @Test
    public void initialStateReported() {
        Assert.assertNotNull(t.getActiveUsers().blockFirst(Duration.ofSeconds(1)));
    }
}
