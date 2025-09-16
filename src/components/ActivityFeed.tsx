import React from 'react';
import { 
  Activity, 
  Target, 
  CheckCircle, 
  XCircle, 
  Play,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { formatDate } from '../utils/helpers';

interface ActivityFeedProps {
  activities: any[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'goal-created':
        return <Target size={16} className="text-blue-400" />;
      case 'goal-completed':
        return <CheckCircle size={16} className="text-emerald-400" />;
      case 'goal-failed':
        return <XCircle size={16} className="text-red-400" />;
      case 'task-started':
        return <Play size={16} className="text-amber-400" />;
      case 'task-completed':
        return <CheckCircle size={16} className="text-emerald-400" />;
      case 'task-failed':
        return <AlertTriangle size={16} className="text-red-400" />;
      default:
        return <Activity size={16} className="text-gray-400" />;
    }
  };

  const getActivityMessage = (activity: any) => {
    switch (activity.type) {
      case 'goal-created':
        return `New goal created: "${activity.goal.description.substring(0, 50)}..."`;
      case 'goal-completed':
        return `Goal completed successfully`;
      case 'goal-failed':
        return `Goal failed to complete`;
      case 'goal-planned':
        return `Goal planned with ${activity.goal.tasks.length} tasks`;
      case 'task-started':
        return `Task started: ${activity.task.function} by ${activity.agent.name}`;
      case 'task-completed':
        return `Task completed: ${activity.task.function}`;
      case 'task-failed':
        return `Task failed: ${activity.task.function}`;
      default:
        return 'System activity';
    }
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    
    const now = Date.now();
    const time = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
    const diff = now - time;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity size={20} className="text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Activity Feed</h3>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-white/60">
          <Clock size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activities.slice(0, 20).map((activity, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80 font-medium">
                  {getActivityMessage(activity)}
                </p>
                <p className="text-xs text-white/50 mt-1">
                  {getTimeAgo(activity.timestamp || Date.now())}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};