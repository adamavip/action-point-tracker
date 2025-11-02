const statusLabels = {
  ongoing: 'On-going',
  completed: 'Completed',
  terminated: 'Terminated',
};

export default function ActivityItem({ activity, onUpdate, onRemove }) {
  return (
    <li className="activity-item">
      <div className="activity-item__header">
        <div>
          <h5>{activity.title}</h5>
          {activity.notes ? <p className="activity-item__notes">{activity.notes}</p> : null}
        </div>
        <button type="button" className="button button--icon" onClick={onRemove}>
          <span aria-hidden="true">×</span>
          <span className="sr-only">Remove activity</span>
        </button>
      </div>

      <div className="activity-item__controls">
        <label className="field">
          <span className="field__label">Completion</span>
          <input
            className="field__input"
            type="range"
            min="0"
            max="100"
            step="5"
            value={activity.completion}
            onChange={(event) => onUpdate({ completion: Number(event.target.value) })}
          />
          <span className="field__value">{activity.completion}%</span>
        </label>

        <label className="field">
          <span className="field__label">Status</span>
          <select
            className="field__input"
            value={activity.status}
            onChange={(event) => onUpdate({ status: event.target.value })}
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </li>
  );
}
