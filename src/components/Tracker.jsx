import { addWeeks, differenceInCalendarWeeks, format, isValid, min as minDate } from 'date-fns';

const deriveTaskStatus = (activities) => {
  if (!activities.length) return 'No activities yet';
  if (activities.every((activity) => activity.status === 'completed')) return 'Completed';
  if (activities.some((activity) => activity.status === 'terminated')) return 'Terminated';
  return 'On-going';
};

const getCompletion = (activities) => {
  if (!activities.length) return 0;
  const total = activities.reduce((sum, activity) => sum + activity.completion, 0);
  return Math.round(total / activities.length);
};

const getWeekSchedule = (startDateValue, endDateValue) => {
  if (!startDateValue || !endDateValue) return [];
  const startDate = new Date(startDateValue);
  const endDate = new Date(endDateValue);
  if (!isValid(startDate) || !isValid(endDate) || startDate > endDate) return [];

  const diff = differenceInCalendarWeeks(endDate, startDate);
  const totalWeeks = Math.max(1, diff + 1);

  return Array.from({ length: totalWeeks }, (_, index) => {
    const weekStart = addWeeks(startDate, index);
    const weekEnd = minDate([endDate, addWeeks(weekStart, 1)]);
    return {
      id: index + 1,
      label: `Week ${index + 1}`,
      range: `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`,
    };
  });
};

const statusColor = {
  Completed: 'success',
  'No activities yet': 'muted',
  'On-going': 'info',
  Terminated: 'danger',
};

const formatDisplayDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (!isValid(date)) return '—';
  return format(date, 'MMM d, yyyy');
};

export default function Tracker({ task, meetingTasks }) {
  const activities = task.activities ?? [];
  const weeks = getWeekSchedule(task.startDate, task.endDate);
  const completion = getCompletion(activities);
  const status = deriveTaskStatus(activities);

  const dependentTask = task.dependentTaskId
    ? meetingTasks.find((item) => item.id === task.dependentTaskId)?.title ?? '—'
    : 'None';

  return (
    <section className="tracker">
      <header className="tracker__header">
        <div>
          <h2>{task.title}</h2>
          <p>
            Owned by <strong>{task.personAssigned || 'Unassigned'}</strong>
          </p>
        </div>
        <div className={`status status--${statusColor[status]}`} aria-live="polite">
          {status}
        </div>
      </header>

      <div className="tracker__summary">
        <div>
          <span className="tracker__summary-label">Completion</span>
          <div className="progress">
            <div className="progress__bar" style={{ width: `${completion}%` }} />
          </div>
          <span className="tracker__summary-value">{completion}%</span>
        </div>
        <div>
          <span className="tracker__summary-label">Timeline</span>
          <span className="tracker__summary-value">
            {task.startDate && task.endDate
              ? `${formatDisplayDate(task.startDate)} → ${formatDisplayDate(task.endDate)}`
              : '—'}
          </span>
        </div>
        <div>
          <span className="tracker__summary-label">Dependency</span>
          <span className="tracker__summary-value">{dependentTask}</span>
        </div>
      </div>

      <section className="tracker__timeline" aria-label="Task timeline">
        {weeks.length ? (
          weeks.map((week) => (
            <div key={week.id} className="timeline-week">
              <span className="timeline-week__label">{week.label}</span>
              <span className="timeline-week__range">{week.range}</span>
            </div>
          ))
        ) : (
          <p className="helper">Add valid start and end dates to view the week-by-week tracker.</p>
        )}
      </section>

      <section className="tracker__activities" aria-label="Activity status">
        <h3>Activity progress</h3>
        {activities.length ? (
          <table>
            <thead>
              <tr>
                <th scope="col">Activity</th>
                <th scope="col">Completion</th>
                <th scope="col">Status</th>
                <th scope="col">Notes</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.title}</td>
                  <td>{activity.completion}%</td>
                  <td>{statusLabels[activity.status] ?? activity.status}</td>
                  <td>{activity.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="helper">Add activities from the task card to track their progress here.</p>
        )}
      </section>
    </section>
  );
}

const statusLabels = {
  ongoing: 'On-going',
  completed: 'Completed',
  terminated: 'Terminated',
};
