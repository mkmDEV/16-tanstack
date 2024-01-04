import {
  Link,
  useNavigate,
  useNavigation,
  useParams,
  useSubmit,
} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { EventForm } from '@components/Events';
import { ErrorBlock, LoadingIndicator, Modal } from '@components/UI';

import { fetchEvent } from '@util/http.js';

export default function EditEvent() {
  const { state } = useNavigation();
  const navigate = useNavigate();
  const submit = useSubmit();
  const { id } = useParams();

  const { data, isError, error } = useQuery({
    queryKey: ['events', id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
    staleTime: 10000,
  });

  const handleSubmit = (formData) => {
    submit(formData, { method: 'PUT' });
  };

  const handleClose = () => navigate('../');

  const Content = () =>
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
        {state === 'submitting' ? (
          <LoadingIndicator />
        ) : (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Update
            </button>
          </>
        )}
      </EventForm>
    ));

  return (
    <Modal onClose={handleClose}>
      <Content />
    </Modal>
  );
}
