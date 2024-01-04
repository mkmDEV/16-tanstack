import { createBrowserRouter, Navigate } from 'react-router-dom';

import { EditEvent, EventDetails, Events, NewEvent } from '@components/Events';

import editEvent from '@loaders/editEvent.loader.js';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/events" />,
  },
  {
    path: '/events',
    element: <Events />,

    children: [
      {
        path: '/events/new',
        element: <NewEvent />,
      },
    ],
  },
  {
    path: '/events/:id',
    element: <EventDetails />,
    children: [
      {
        path: '/events/:id/edit',
        element: <EditEvent />,
        loader: editEvent.loader,
        action: editEvent.action,
      },
    ],
  },
]);
