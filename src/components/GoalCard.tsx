import React, { useState } from 'react';
import { Goal } from '../types';
import { TasksList } from './TasksList';
import { 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Calendar,
  Target
} from 'lucide-react';
import { getStatusBadgeColor, formatDate, calculateProgress } from '../utils/helpers';

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const progress = calculateProgress(goal.tasks);
  const completedTasks = goal.tasks.filter(t => t.status === 'completed').length;
  const failedTasks = goal.tasks.filter(t => t.status === 'failed').length;

  const getStatusIcon = () => {
    switch (goal.status) {
      case 'completed':
        return <CheckCircle size={20} className="text-emerald-400" />;
      case 'failed':
        return <XCircle size={20} className="text-red-400" />;
      case 'executing':
        return <Loader2 size={20} className="text-blue-400 animate-spin" />;
      case 'planning':
        return <Clock size={20} className="text-amber-400" />;
      default:
        return <Target size={20} className="text-gray-400" />;
    }
  };

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-xl overflow-hidden">
      {/* Header */}
      <div 
        className="p-6 cursor-pointer hover:bg-white/5 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              {getStatusIcon()}
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(goal.status)}`}>
                {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
              </span>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Calendar size={14} />
                {formatDate(goal.createdAt)}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {goal.description}
            </h3>

            {/* Progress Bar */}
            {goal.tasks.length > 0 && (
              <div className="mb-3">
                <div className="flex justify-between text-sm text-white/60 mb-2">
                  <span>Progress</span>
                  <span>{completedTasks}/{goal.tasks.length} tasks completed</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Task Summary */}
            {goal.tasks.length > 0 && (
              <div className="flex items-center gap-4 text-sm">
                <span className="text-emerald-400">
                  ✓ {completedTasks} completed
                </span>
                {failedTasks > 0 && (
                  <span className="text-red-400">
                    ✗ {failedTasks} failed
                  </span>
                )}
                <span className="text-blue-400">
                  ⚡ {goal.tasks.filter(t => t.status === 'executing').length} running
                </span>
                <span className="text-amber-400">
                  ⏳ {goal.tasks.filter(t => t.status === 'pending').length} pending
                </span>
              </div>
            )}
          </div>

          <button className="ml-4 p-1 hover:bg-white/10 rounded-lg transition-colors duration-200">
            {isExpanded ? (
              <ChevronDown size={20} className="text-white/60" />
            ) : (
              <ChevronRight size={20} className="text-white/60" />
            )}
          </button>
        </div>
      </div>

      {/* Tasks List */}
      {isExpanded && goal.tasks.length > 0 && (
        <div className="border-t border-white/10">
          <TasksList tasks={goal.tasks} />
        </div>
      )}

      {/* Results */}
      {goal.status === 'completed' && goal.results && Object.keys(goal.results).length > 0 && isExpanded && (
        <div className="border-t border-white/10 p-6 bg-white/5">
          <h4 className="text-sm font-semibold text-white mb-3">Results</h4>
          <div className="space-y-2">
            {Object.entries(goal.results).map(([taskId, result], index) => (
              <div key={taskId} className="bg-white/10 rounded-lg p-3">
                <div className="text-xs text-white/60 mb-1">Task {index + 1} Result:</div>
                <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono overflow-x-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};