import React from 'react';
import { Goal } from '../types';
import { GoalCard } from './GoalCard';

interface GoalsListProps {
  goals: Goal[];
}

export const GoalsList: React.FC<GoalsListProps> = ({ goals }) => {
  if (goals.length === 0) {
    return (
      <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-8 text-center">
        <div className="text-white/60 mb-4">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No goals yet</h3>
          <p className="text-sm">Create your first goal to see AI agents in action!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Active Goals</h2>
      <div className="space-y-4">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
};