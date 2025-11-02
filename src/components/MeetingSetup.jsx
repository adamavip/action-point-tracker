import { useState } from 'react';

export default function MeetingSetup({ meeting, maxTasks, onCreateMeeting }) {
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreateMeeting(trimmed);
    setName('');
  };

  return (
    <section className="panel">
      <div className="panel__header">
        <div>
          <h2>Meeting details</h2>
          <p>Give your meeting a name to start building the agenda.</p>
        </div>
      </div>

      <form className="panel__form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field__label">Meeting name</span>
          <input
            className="field__input"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Quarterly planning workshop"
            maxLength={80}
          />
        </label>
        <button className="button button--primary" type="submit">
          {meeting ? 'Rename meeting' : 'Create meeting'}
        </button>
      </form>

      {meeting ? (
        <dl className="panel__summary">
          <div>
            <dt>Current meeting</dt>
            <dd>{meeting.name}</dd>
          </div>
          <div>
            <dt>Tasks created</dt>
            <dd>
              {meeting.tasks.length} / {maxTasks}
            </dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
