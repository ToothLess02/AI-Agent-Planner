import React, { useState, useEffect } from 'react';
import { AgentOrchestrator } from '../core/orchestrator';
import { Goal, Agent, SystemMetrics } from '../types';
import { GoalInput } from './GoalInput';
import { GoalsList } from './GoalsList';
import { AgentsPanel } from './AgentsPanel';
import { MetricsPanel } from './MetricsPanel';
import { ActivityFeed } from './ActivityFeed';

export const Dashboard: React.FC = () => {
  const [orchestrator] = useState(() => AgentOrchestrator.getInstance());
  const [goals, setGoals] = useState<Goal[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Subscribe to orchestrator events
    const unsubscribe = orchestrator.subscribe((event) => {
      setActivities(prev => [event, ...prev.slice(0, 49)]); // Keep last 50 activities
      
      // Refresh data when events occur
      refreshData();
    });

    // Initial data load
    refreshData();

    // Set up periodic refresh
    const interval = setInterval(refreshData, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [orchestrator]);

  const refreshData = () => {
    setGoals(orchestrator.getGoals());
    setAgents(orchestrator.getAgents());
    setMetrics(orchestrator.getSystemMetrics());
  };

  const handleGoalSubmit = async (goalDescription: string) => {
    if (!goalDescription.trim()) return;
    
    setIsLoading(true);
    try {
      await orchestrator.executeGoal(goalDescription);
    } catch (error) {
      console.error('Failed to execute goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Aetherium AI Orchestrator
            </h1>
            <p className="text-blue-200 text-lg">
              Advanced AI Agent Planning & Task Orchestration System
            </p>
          </div>

          {/* Goal Input */}
          <div className="max-w-4xl mx-auto">
            <GoalInput onSubmit={handleGoalSubmit} isLoading={isLoading} />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Goals */}
          <div className="lg:col-span-2 space-y-8">
            <GoalsList goals={goals} />
          </div>

          {/* Right Column - System Info */}
          <div className="space-y-8">
            {metrics && <MetricsPanel metrics={metrics} />}
            <AgentsPanel agents={agents} />
            <ActivityFeed activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
};