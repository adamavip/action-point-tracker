import { useMemo } from 'react';
import ActivityForm from './ActivityForm.jsx';
import ActivityItem from './ActivityItem.jsx';
import { priorityLabels } from '../utils/taskFactory.js';

const MAX_ACTIVITIES = 10;

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date);
};

const calculateCompletion = (activities) => {
  if (!activities.length) return 0;
  const total = activities.reduce((sum, activity) => sum + activity.completion, 0);
  return Math.round(total / activities.length);
};

export default function TaskCard({
  task,
  isSelected,
  onSelect,
  onUpdateTask,
  onDeleteTask,
  meetingTasks,
}) {
  const activities = task.activities ?? [];

  const dependentTaskName = useMemo(() => {
    if (!task.dependentTaskId) return 'None';
    return meetingTasks.find((item) => item.id === task.dependentTaskId)?.title ?? 'None';
  }, [meetingTasks, task.dependentTaskId]);

  const completion = useMemo(() => calculateCompletion(activities), [activities]);

  const canAddActivity = activities.length < MAX_ACTIVITIES;

  const handleAddActivity = (activity) => {
    if (!canAddActivity) return;
    onUpdateTask(task.id, (current) => ({ activities: [...(current.activities ?? []), activity] }));
  };

  const handleUpdateActivity = (activityId, changes) => {
    onUpdateTask(task.id, (current) => ({
      activities: (current.activities ?? []).map((activity) =>
        activity.id === activityId ? { ...activity, ...changes } : activity,
      ),
    }));
  };

  const handleRemoveActivity = (activityId) => {
    onUpdateTask(task.id, (current) => ({
      activities: (current.activities ?? []).filter((activity) => activity.id !== activityId),
    }));
  };

  return (
    <article
      className={`task-card ${isSelected ? 'task-card--active' : ''}`}
      onClick={() => onSelect(task.id)}
      role="button"
      tabIndex={0}
    >
      <header className="task-card__header">
        <div>
          <h3>{task.title}</h3>
          <p className="task-card__meta">
            Assigned to <strong>{task.personAssigned || 'Unassigned'}</strong>
          </p>
        </div>
        <span className={`badge badge--${task.priority}`}>{priorityLabels[task.priority]}</span>
      </header>

      <dl className="task-card__grid">
        <div>
          <dt>Start</dt>
          <dd>{formatDate(task.startDate)}</dd>
        </div>
        <div>
          <dt>End</dt>
          <dd>{formatDate(task.endDate)}</dd>
        </div>
        <div>
          <dt>Dependency</dt>
          <dd>{dependentTaskName}</dd>
        </div>
        <div>
          <dt>Completion</dt>
          <dd>{completion}%</dd>
        </div>
      </dl>

      {task.notes ? <p className="task-card__notes">{task.notes}</p> : null}

      <section
        className="task-card__activities"
        onClick={(event) => event.stopPropagation()}
        role="presentation"
      >
        <div className="task-card__activities-header">
          <h4>Activities</h4>
          <span className="chip">{activities.length} / 10</span>
        </div>

        {activities.length ? (
          <ul className="activity-list">
            {activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                onUpdate={(changes) => handleUpdateActivity(activity.id, changes)}
                onRemove={() => handleRemoveActivity(activity.id)}
              />
            ))}
          </ul>
        ) : (
          <p className="helper">No activities yet</p>
        )}

        <ActivityForm
          onSubmit={handleAddActivity}
          disabled={!canAddActivity}
          helper={!canAddActivity ? 'Maximum of ten activities reached' : undefined}
        />
      </section>

      <footer className="task-card__footer" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="button button--ghost"
          onClick={(event) => {
            event.stopPropagation();
            onDeleteTask(task.id);
          }}
        >
          Remove task
        </button>
      </footer>
    </article>
  );
}
