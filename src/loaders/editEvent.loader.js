import { redirect } from 'react-router-dom';
import { fetchEvent, queryClient, updateEvent } from '@util/http';

const action = async ({ request, params }) => {
  const formData = await request.formData();
  const { id } = params;
  const updatedEventData = Object.fromEntries(formData);

  await updateEvent({ id, event: updatedEventData });
  await queryClient.invalidateQueries(['events']);

  return redirect('../');
};
const loader = ({ params }) => {
  const { id } = params;
  return queryClient.fetchQuery({
    queryKey: ['events', id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });
};

const editEvent = {
  action,
  loader,
};
export default editEvent;
