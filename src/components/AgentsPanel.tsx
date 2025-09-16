import React from 'react';
import { Agent } from '../types';
import { Bot, Activity, CheckCircle, Clock } from 'lucide-react';
import { formatDate, getStatusColor } from '../utils/helpers';

interface AgentsPanelProps {
  agents: Agent[];
}

export const AgentsPanel: React.FC<AgentsPanelProps> = ({ agents }) => {
  const activeAgents = agents.filter(agent => agent.status === 'busy').length;
  const idleAgents = agents.filter(agent => agent.status === 'idle').length;

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bot size={20} className="text-blue-400" />
        <h3 className="text-lg font-semibold text-white">AI Agents</h3>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{activeAgents}</div>
          <div className="text-xs text-white/60">Active</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-gray-400">{idleAgents}</div>
          <div className="text-xs text-white/60">Idle</div>
        </div>
      </div>

      {/* Agents List */}
      <div className="space-y-3">
        {agents.map((agent) => (
          <div 
            key={agent.id} 
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${agent.status === 'busy' ? 'bg-green-400' : 'bg-gray-400'} animate-pulse`} />
                <h4 className="font-medium text-white text-sm">{agent.name}</h4>
              </div>
              <span className={`text-xs font-medium ${getStatusColor(agent.status)}`}>
                {agent.status}
              </span>
            </div>

            <div className="space-y-2 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <CheckCircle size={12} />
                <span>{agent.tasksCompleted} tasks completed</span>
              </div>
              
              {agent.currentTask && (
                <div className="flex items-center gap-2">
                  <Activity size={12} />
                  <span className="truncate">Working on task</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Clock size={12} />
                <span>Last active: {formatDate(agent.lastActivity)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};