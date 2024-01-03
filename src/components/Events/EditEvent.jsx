import { Link, useNavigate } from 'react-router-dom';

import { EventForm } from '@components/Events';
import { Modal } from '@components/UI';

export default function EditEvent() {
  const navigate = useNavigate();

  function handleSubmit(formData) {}

  function handleClose() {
    navigate('../');
  }

  return (
    <Modal onClose={handleClose}>
      <EventForm inputData={null} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    </Modal>
  );
}
