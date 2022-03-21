import { Route } from '@vaadin/router';
import './views/main-layout'

export type ViewRoute = Route & {
    title?: string;
    icon?: string;
    children?: ViewRoute[];
};

export const views: ViewRoute[] = [
    {
        path: '',
        component: 'sessions-view',
        icon: 'la la-server',
        title: 'Sessions',
        action: async (_context, _command) => {
            await import('./views/sessions-view');
            return;
        },
    },
    {
        path: 'temperature',
        component: 'temperature-view',
        icon: 'la la-thermometer-half',
        title: 'Temperature',
        action: async (_context, _command) => {
            await import('./views/temperature-view');
            return;
        },
    },
    {
        path: 'chat',
        component: 'chat-view',
        icon: 'la la-comments',
        title: 'Chat',
        action: async (_context, _command) => {
            await import('./views/chat-view');
            return;
        },
    },
    {
        path: 'online-indicator',
        component: 'online-indicator-view',
        icon: 'la la-user-circle',
        title: 'Online indicator',
        action: async (_context, _command) => {
            await import('./views/online-indicator-view');
        }
    },
    {
        path: 'crud',
        component: 'crud-view',
        icon: 'la la-comments',
        title: 'Data table',
        action: async (_context, _command) => {
            await import('./views/crud-view');
            return;
        },
    },
    {
        path: 'test',
        component: 'test-view',
        icon: 'la la-flask',
        title: 'Test',
        action: async (_context, _command) => {
            await import('./views/test-view');
            return;
        },
    },
];
export const routes: ViewRoute[] = [
    {
        path: '',
        component: 'main-layout',
        children: [...views],
    },
];
