import { modelenceQuery, useMutation } from '@modelence/react-query';

function EcoForm() {
  const [mutate] = useMutation(modelenceQuery('habit.create'));
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    mutate({
      lightsHours: Number(form.lights.value),
      recycled: form.recycled.checked,
      date: new Date(),
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>Light Hours: <input type="range" name="lights" min="0" max="10" /></label>
      <label><input type="checkbox" name="recycled" /> Recycled?</label>
      <button type="submit">Save</button>
    </form>
  );
}

export default EcoForm;