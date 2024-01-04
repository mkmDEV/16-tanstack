import { useState } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import Header from '@components/Header.jsx';
import { ErrorBlock, LoadingIndicator, Modal } from '@components/UI';

import { deleteEvent, fetchEvent, queryClient } from '@util/http.js';

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: event,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['events', id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });

  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none',
      });
      navigate('/events');
    },
  });

  const handleStartDelete = () => {
    setIsDeleting(true);
  };

  const handleStopDelete = () => {
    setIsDeleting(false);
  };

  const handleDelete = () => {
    mutate({ id });
  };

  let content;

  if (isPending) {
    content = (
      <div id="event-details-content" className={'center'}>
        <p>Fetching event data...</p>
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    content = (
      <div id="event-details-content" className={'center'}>
        <ErrorBlock
          title={'Failed to load event'}
          message={error.info?.message || 'Try again later.'}
        />
      </div>
    );
  }

  if (event) {
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    content = (
      <>
        <header>
          <h1>{event.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${event.image}`} alt={event.title} />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{event.location}</p>
              <time dateTime={`${event.date}T${event.time}`}>
                {formattedDate} @ {event.time}
              </time>
            </div>
            <p id="event-details-description">{event.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isDeleting && (
        <Modal onClose={handleStopDelete}>
          <h2>Are you sure?</h2>
          <p>Do you really want to delete this event?</p>
          <div className="form-actions">
            {isPendingDeletion && <p>Deleting, please wait....</p>}
            {!isPendingDeletion && (
              <>
                <button onClick={handleStopDelete} className={'button-text'}>
                  Cancel
                </button>
                <button onClick={handleDelete} className={'button'}>
                  Delete
                </button>
              </>
            )}
            {isErrorDeleting && (
              <ErrorBlock
                title={'Failed to delete event.'}
                message={deleteError.info?.message || 'Try again later.'}
              />
            )}
          </div>
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
    </>
  );
}
