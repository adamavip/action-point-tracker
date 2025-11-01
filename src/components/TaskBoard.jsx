import { useMemo, useState } from 'react';
import TaskCard from './TaskCard.jsx';
import Tracker from './Tracker.jsx';
import { createTask } from '../utils/taskFactory.js';

export default function TaskBoard({
  meeting,
  selectedTaskId,
  onSelectTask,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  selectedTask,
}) {
  const [formState, setFormState] = useState(createTask());
  const [formErrors, setFormErrors] = useState({});

  const dependentTaskOptions = useMemo(
    () => meeting.tasks.map((task) => ({ id: task.id, title: task.title })),
    [meeting.tasks],
  );

  const canAddTask = meeting.tasks.length < 10;

  const validateTask = (task) => {
    const errors = {};
    if (!task.title.trim()) errors.title = 'Required';
    if (!task.personAssigned.trim()) errors.personAssigned = 'Required';
    if (!task.startDate) errors.startDate = 'Required';
    if (!task.endDate) errors.endDate = 'Required';
    if (task.startDate && task.endDate && task.startDate > task.endDate) {
      errors.endDate = 'End date must be after start date';
    }
    return errors;
  };

  const handleTaskSubmit = (event) => {
    event.preventDefault();
    const errors = validateTask(formState);
    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }
    onAddTask({ ...formState, id: crypto.randomUUID(), activities: [] });
    setFormState(createTask());
    setFormErrors({});
  };

  return (
    <section className="task-board">
      <div className="task-board__left">
        <div className="panel">
          <div className="panel__header">
            <div>
              <h2>Tasks</h2>
              <p>Add up to ten tasks for this meeting.</p>
            </div>
            <span className="chip">{meeting.tasks.length} / 10</span>
          </div>

          <form className="task-form" onSubmit={handleTaskSubmit}>
            <div className="task-form__row">
              <label className="field">
                <span className="field__label">Task title</span>
                <input
                  className={`field__input ${formErrors.title ? 'field__input--error' : ''}`}
                  value={formState.title}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, title: event.target.value }))
                  }
                  maxLength={80}
                  placeholder="e.g. Finalise agenda"
                />
                {formErrors.title ? <span className="field__error">{formErrors.title}</span> : null}
              </label>

              <label className="field">
                <span className="field__label">Assigned to</span>
                <input
                  className={`field__input ${
                    formErrors.personAssigned ? 'field__input--error' : ''
                  }`}
                  value={formState.personAssigned}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, personAssigned: event.target.value }))
                  }
                  maxLength={60}
                  placeholder="Name"
                />
                {formErrors.personAssigned ? (
                  <span className="field__error">{formErrors.personAssigned}</span>
                ) : null}
              </label>
            </div>

            <div className="task-form__row">
              <label className="field">
                <span className="field__label">Dependent task</span>
                <select
                  className="field__input"
                  value={formState.dependentTaskId}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, dependentTaskId: event.target.value }))
                  }
                >
                  <option value="">None</option>
                  {dependentTaskOptions.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span className="field__label">Priority</span>
                <select
                  className="field__input"
                  value={formState.priority}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, priority: event.target.value }))
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </label>
            </div>

            <div className="task-form__row">
              <label className="field">
                <span className="field__label">Start date</span>
                <input
                  className={`field__input ${formErrors.startDate ? 'field__input--error' : ''}`}
                  type="date"
                  value={formState.startDate}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, startDate: event.target.value }))
                  }
                />
                {formErrors.startDate ? (
                  <span className="field__error">{formErrors.startDate}</span>
                ) : null}
              </label>

              <label className="field">
                <span className="field__label">End date</span>
                <input
                  className={`field__input ${formErrors.endDate ? 'field__input--error' : ''}`}
                  type="date"
                  value={formState.endDate}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, endDate: event.target.value }))
                  }
                />
                {formErrors.endDate ? (
                  <span className="field__error">{formErrors.endDate}</span>
                ) : null}
              </label>
            </div>

            <label className="field">
              <span className="field__label">Notes</span>
              <textarea
                className="field__input"
                value={formState.notes}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, notes: event.target.value }))
                }
                maxLength={280}
                rows={3}
                placeholder="Add helpful context"
              />
            </label>

            <div className="task-form__actions">
              <button className="button button--primary" type="submit" disabled={!canAddTask}>
                Add task
              </button>
              {!canAddTask ? <span className="helper">Maximum of ten tasks reached</span> : null}
            </div>
          </form>
        </div>

        <div className="task-list">
          {meeting.tasks.length ? (
            meeting.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isSelected={task.id === selectedTaskId}
                onSelect={onSelectTask}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                meetingTasks={meeting.tasks}
              />
            ))
          ) : (
            <div className="empty-state empty-state--compact">
              <div className="empty-state__card">
                <h3>No tasks yet</h3>
                <p>Use the form above to add your first task.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="task-board__right">
        {selectedTask ? (
          <Tracker task={selectedTask} meetingTasks={meeting.tasks} />
        ) : (
          <div className="empty-state empty-state--compact">
            <div className="empty-state__card">
              <h3>Select a task to open its tracker</h3>
              <p>The tracker visualises weekly milestones and completion.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
