import React from 'react';
import { SystemMetrics } from '../types';
import { 
  BarChart3, 
  Target, 
  CheckCircle, 
  XCircle, 
  Activity,
  Clock,
  TrendingUp
} from 'lucide-react';
import { formatNumber, formatDuration } from '../utils/helpers';

interface MetricsPanelProps {
  metrics: SystemMetrics;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics }) => {
  const successRate = metrics.totalTasks > 0 
    ? Math.round((metrics.completedTasks / metrics.totalTasks) * 100) 
    : 0;

  const metricsData = [
    {
      icon: Target,
      label: 'Total Goals',
      value: formatNumber(metrics.totalGoals),
      color: 'text-blue-400'
    },
    {
      icon: BarChart3,
      label: 'Total Tasks',
      value: formatNumber(metrics.totalTasks),
      color: 'text-purple-400'
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: formatNumber(metrics.completedTasks),
      color: 'text-emerald-400'
    },
    {
      icon: XCircle,
      label: 'Failed',
      value: formatNumber(metrics.failedTasks),
      color: 'text-red-400'
    },
    {
      icon: Activity,
      label: 'Active Agents',
      value: formatNumber(metrics.activeAgents),
      color: 'text-amber-400'
    },
    {
      icon: Clock,
      label: 'Avg. Execution',
      value: formatDuration(metrics.averageExecutionTime),
      color: 'text-cyan-400'
    }
  ];

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={20} className="text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">System Metrics</h3>
      </div>

      {/* Success Rate */}
      <div className="mb-6 p-4 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 rounded-xl border border-emerald-500/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/80">Success Rate</span>
          <span className="text-lg font-bold text-emerald-400">{successRate}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${successRate}%` }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {metricsData.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div 
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className={metric.color} />
                <span className="text-xs text-white/60 font-medium">{metric.label}</span>
              </div>
              <div className={`text-xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* System Uptime */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">System Uptime</span>
          <span className="text-white/80 font-medium">
            {formatDuration(metrics.systemUptime)}
          </span>
        </div>
      </div>
    </div>
  );
};