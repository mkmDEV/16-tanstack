import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchEvents } from '@util/http.js';

import { ErrorBlock, LoadingIndicator } from '@components/UI';
import { EventItem } from '@components/Events';

export default function FindEventSection() {
  const searchElement = useRef();
  const [searchTerm, setSearchTerm] = useState();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['events', { searchTerm }],
    queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }),
    enabled: !!searchTerm,
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  };

  const Content = () =>
    (isLoading && <LoadingIndicator />) ||
    (isError && (
      <ErrorBlock
        title={'An error occurred'}
        message={error.info?.message || 'Failed to fetch events.'}
      />
    )) ||
    (data && (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>{<EventItem event={event} />}</li>
        ))}
      </ul>
    )) || <p>Please enter a search term and to find events.</p>;

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      <Content />
    </section>
  );
}
