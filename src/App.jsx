import { useMemo, useState } from 'react';
import MeetingSetup from './components/MeetingSetup.jsx';
import TaskBoard from './components/TaskBoard.jsx';
import './styles/app.css';

const MAX_TASKS = 10;

const createEmptyMeeting = (name) => ({
  id: crypto.randomUUID(),
  name,
  tasks: [],
});

export default function App() {
  const [meeting, setMeeting] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const selectedTask = useMemo(
    () => meeting?.tasks.find((task) => task.id === selectedTaskId) ?? null,
    [meeting, selectedTaskId],
  );

  const handleMeetingCreate = (name) => {
    setMeeting((previous) => {
      if (previous) {
        return { ...previous, name };
      }
      return createEmptyMeeting(name);
    });
  };

  const handleAddTask = (task) => {
    setMeeting((prev) => {
      if (!prev) {
        return prev;
      }
      if (prev.tasks.length >= MAX_TASKS) {
        return prev;
      }
      const nextTasks = [...prev.tasks, task];
      return { ...prev, tasks: nextTasks };
    });
    setSelectedTaskId(task.id);
  };

  const handleUpdateTask = (taskId, updater) => {
    setMeeting((prev) => {
      if (!prev) return prev;
      const nextTasks = prev.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updater(task) } : task,
      );
      return { ...prev, tasks: nextTasks };
    });
  };

  const handleDeleteTask = (taskId) => {
    setMeeting((prev) => {
      if (!prev) return prev;
      const nextTasks = prev.tasks.filter((task) => task.id !== taskId);
      return { ...prev, tasks: nextTasks };
    });
    setSelectedTaskId((prevId) => (prevId === taskId ? null : prevId));
  };

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>Action Point Tracker</h1>
          <p>Organise meeting tasks and monitor progress with weekly insights.</p>
        </div>
      </header>

      <main className="app__content">
        <MeetingSetup
          meeting={meeting}
          maxTasks={MAX_TASKS}
          onCreateMeeting={handleMeetingCreate}
        />

        {meeting ? (
          <TaskBoard
            meeting={meeting}
            selectedTaskId={selectedTaskId}
            onSelectTask={setSelectedTaskId}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            selectedTask={selectedTask}
          />
        ) : (
          <section className="empty-state">
            <div className="empty-state__card">
              <h2>Start by naming your meeting</h2>
              <p>
                Once the meeting is created, you can add up to ten tasks, define their
                activities, and monitor progress through the tracker.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
