package org.vaadin.artur.hillapush.sessiontracker;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.support.WebApplicationContextUtils;

@WebListener
public class SessionListener implements HttpSessionListener, ServletContextListener {

    @Autowired
    private ActiveUserTracker tracker;

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        tracker.register(se.getSession().getId());
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        tracker.unregister(se.getSession().getId());
    }

    public void contextInitialized(ServletContextEvent sce) {
        WebApplicationContextUtils
            .getRequiredWebApplicationContext(sce.getServletContext())
            .getAutowireCapableBeanFactory()
            .autowireBean(this);
    }


}