import React, { useState } from 'react';
import { Task } from '../types';
import { CheckCircle, XCircle, Loader2, Clock, Play, ChevronDown, ChevronRight, Timer, PenTool as Tool } from 'lucide-react';
import { getStatusBadgeColor, formatDuration, formatDate } from '../utils/helpers';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle size={16} className="text-emerald-400" />;
      case 'failed':
        return <XCircle size={16} className="text-red-400" />;
      case 'executing':
        return <Loader2 size={16} className="text-blue-400 animate-spin" />;
      case 'pending':
        return <Clock size={16} className="text-amber-400" />;
      default:
        return <Play size={16} className="text-gray-400" />;
    }
  };

  const getToolIcon = () => {
    switch (task.tool) {
      case 'github_tools':
        return '🐙';
      case 'trading_tools':
        return '📈';
      case 'data_tools':
        return '📊';
      case 'api_tools':
        return '🔌';
      default:
        return '🛠️';
    }
  };

  return (
    <div className="bg-white/10 border border-white/10 rounded-xl overflow-hidden hover:bg-white/15 transition-all duration-200">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {getStatusIcon()}
            <span className="text-lg">{getToolIcon()}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(task.status)}`}>
                  {task.status}
                </span>
                <span className="text-xs text-white/60">
                  {task.tool.replace('_tools', '').toUpperCase()}
                </span>
              </div>
              <div className="text-sm text-white font-medium truncate">
                {task.function}
              </div>
              {task.executionTime && (
                <div className="flex items-center gap-1 text-xs text-white/60 mt-1">
                  <Timer size={12} />
                  {formatDuration(task.executionTime)}
                </div>
              )}
            </div>
          </div>
          
          <button className="p-1 hover:bg-white/10 rounded transition-colors duration-200">
            {showDetails ? (
              <ChevronDown size={16} className="text-white/60" />
            ) : (
              <ChevronRight size={16} className="text-white/60" />
            )}
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="px-4 pb-4 border-t border-white/10 bg-white/5">
          <div className="pt-3 space-y-3">
            {/* Parameters */}
            {task.params && Object.keys(task.params).length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-white/80 mb-2 flex items-center gap-1">
                  <Tool size={12} />
                  Parameters
                </h5>
                <div className="bg-black/20 rounded-lg p-3">
                  <pre className="text-xs text-white/70 overflow-x-auto">
                    {JSON.stringify(task.params, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-white/60">Created:</span>
                <br />
                <span className="text-white/80">{formatDate(task.createdAt)}</span>
              </div>
              {task.startedAt && (
                <div>
                  <span className="text-white/60">Started:</span>
                  <br />
                  <span className="text-white/80">{formatDate(task.startedAt)}</span>
                </div>
              )}
              {task.completedAt && (
                <div>
                  <span className="text-white/60">Completed:</span>
                  <br />
                  <span className="text-white/80">{formatDate(task.completedAt)}</span>
                </div>
              )}
            </div>

            {/* Result or Error */}
            {task.result && (
              <div>
                <h5 className="text-xs font-medium text-emerald-400 mb-2">Result</h5>
                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <pre className="text-xs text-emerald-100 whitespace-pre-wrap">
                    {typeof task.result === 'string' 
                      ? task.result 
                      : JSON.stringify(task.result, null, 2)
                    }
                  </pre>
                </div>
              </div>
            )}

            {task.error && (
              <div>
                <h5 className="text-xs font-medium text-red-400 mb-2">Error</h5>
                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                  <pre className="text-xs text-red-100 whitespace-pre-wrap">
                    {task.error}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};