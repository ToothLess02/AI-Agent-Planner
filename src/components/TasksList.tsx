import React from 'react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';

interface TasksListProps {
  tasks: Task[];
}

export const TasksList: React.FC<TasksListProps> = ({ tasks }) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by status priority: executing -> pending -> completed -> failed
    const statusOrder = { executing: 0, pending: 1, completed: 2, failed: 3 };
    const aOrder = statusOrder[a.status] ?? 4;
    const bOrder = statusOrder[b.status] ?? 4;
    
    if (aOrder !== bOrder) return aOrder - bOrder;
    
    // Then sort by creation time
    return a.createdAt.getTime() - b.createdAt.getTime();
  });

  return (
    <div className="p-6 space-y-3">
      <h4 className="text-sm font-semibold text-white/80 mb-3">Tasks ({tasks.length})</h4>
      <div className="space-y-2">
        {sortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};