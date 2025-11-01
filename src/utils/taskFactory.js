const defaultTask = {
  title: '',
  personAssigned: '',
  dependentTaskId: '',
  startDate: '',
  endDate: '',
  priority: 'medium',
  notes: '',
};

export const createTask = () => ({ ...defaultTask });

export const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};
