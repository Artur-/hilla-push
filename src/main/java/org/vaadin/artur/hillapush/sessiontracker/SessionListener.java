package org.vaadin.artur.hillapush.sessiontracker;

import java.io.Serializable;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSessionActivationListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.web.context.support.WebApplicationContextUtils;

@WebListener
public class SessionListener implements HttpSessionListener, ServletContextListener {

    public static class Probe implements HttpSessionActivationListener, Serializable {

        @Override
        public void sessionWillPassivate(HttpSessionEvent event) {
            DebugLogger.info("sessionWillPassivate for " + event.getSession().getId());
        }

        @Override
        public void sessionDidActivate(HttpSessionEvent event) {
            DebugLogger.info("sessionDidActivate for " + event.getSession().getId());
            ActiveUserTracker tracker = findTracker(event.getSession().getServletContext());
            tracker.register(event.getSession());
        }

    }

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        DebugLogger.info("sessionCreated: " + se.getSession().getId());
        findTracker(se).register(se.getSession());
        se.getSession().setAttribute(getClass().getName(), new Probe());
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        DebugLogger.info("sessionDestroyed: " + se.getSession().getId());
        findTracker(se).unregister(se.getSession().getId());
    }

    public void contextInitialized(ServletContextEvent sce) {
        getBeanFactory(sce.getServletContext())
                .autowireBean(this);
    }

    private static AutowireCapableBeanFactory getBeanFactory(ServletContext servletContext) {
        return WebApplicationContextUtils
                .getRequiredWebApplicationContext(servletContext)
                .getAutowireCapableBeanFactory();
    }

    private static ActiveUserTracker findTracker(HttpSessionEvent se) {
        return findTracker(se.getSession().getServletContext());
    }

    private static ActiveUserTracker findTracker(ServletContext servletContext) {
        return (ActiveUserTracker) getBeanFactory(servletContext).getBean("activeUserTracker");
    }

}