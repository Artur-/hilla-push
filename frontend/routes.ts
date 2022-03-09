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
