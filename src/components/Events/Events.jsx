import { Link, Outlet } from 'react-router-dom';

import Header from '@components/Header.jsx';
import {
  EventsIntroSection,
  FindEventSection,
  NewEventsSection,
} from '@components/Events';

export default function Events() {
  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events/new" className="button">
          New Event
        </Link>
      </Header>
      <main>
        <EventsIntroSection />
        <NewEventsSection />
        <FindEventSection />
      </main>
    </>
  );
}
