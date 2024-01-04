import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { EventForm } from '@components/Events';
import { ErrorBlock, LoadingIndicator, Modal } from '@components/UI';

import { fetchEvent, queryClient, updateEvent } from '@util/http.js';

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['events', id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      const newEvent = data.event;

      await queryClient.cancelQueries({ queryKey: ['events', id] });
      const prevEvent = queryClient.getQueryData(['events', id]);

      queryClient.setQueryData(['events', id], newEvent);

      return { prevEvent };
    },
    onError: (error, data, context) => {
      queryClient.setQueryData(['events', id], context.prevEvent);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries(['events', id]);
    },
  });

  const handleSubmit = (formData) => {
    mutate({ id, event: formData });
    navigate('../');
  };

  const handleClose = () => navigate('../');

  const Content = () =>
    (isPending && (
      <div className={'center'}>
        <LoadingIndicator />
      </div>
    )) ||
    (isError && (
      <>
        <ErrorBlock
          title={'Failed to load event.'}
          message={error.info?.message || 'Please try again later.'}
        />
        <div className="form-actions">
          <Link className={'button'} to={'../'}>
            OK
          </Link>
        </div>
      </>
    )) ||
    (data && (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    ));

  return (
    <Modal onClose={handleClose}>
      <Content />
    </Modal>
  );
}
