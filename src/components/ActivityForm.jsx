import { useState } from 'react';

const defaultForm = {
  title: '',
  notes: '',
};

export default function ActivityForm({ onSubmit, disabled, helper }) {
  const [formState, setFormState] = useState(defaultForm);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = formState.title.trim();
    if (!trimmed) {
      setError('Activity name is required');
      return;
    }
    onSubmit({
      id: crypto.randomUUID(),
      title: trimmed,
      notes: formState.notes.trim(),
      completion: 0,
      status: 'ongoing',
    });
    setFormState(defaultForm);
    setError('');
  };

  return (
    <form className="activity-form" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field__label">New activity</span>
        <input
          className={`field__input ${error ? 'field__input--error' : ''}`}
          placeholder="e.g. Draft presentation"
          value={formState.title}
          onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
          maxLength={80}
          disabled={disabled}
        />
        {error ? <span className="field__error">{error}</span> : null}
      </label>

      <label className="field">
        <span className="field__label">Notes</span>
        <textarea
          className="field__input"
          placeholder="Add optional details"
          value={formState.notes}
          onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
          rows={2}
          maxLength={160}
          disabled={disabled}
        />
      </label>

      <div className="activity-form__actions">
        <button className="button button--secondary" type="submit" disabled={disabled}>
          Add activity
        </button>
        {helper ? <span className="helper">{helper}</span> : null}
      </div>
    </form>
  );
}
