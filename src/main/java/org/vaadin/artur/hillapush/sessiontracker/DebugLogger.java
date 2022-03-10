package org.vaadin.artur.hillapush.sessiontracker;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DebugLogger {

    public static void info(String msg) {
        getLogger().info(msg);
    }

    private static Logger getLogger() {
        return LoggerFactory.getLogger(DebugLogger.class);
    }

}
