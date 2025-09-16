import React, { useState } from 'react';
import { Send, Loader2, Lightbulb } from 'lucide-react';

interface GoalInputProps {
  onSubmit: (goal: string) => void;
  isLoading: boolean;
}

export const GoalInput: React.FC<GoalInputProps> = ({ onSubmit, isLoading }) => {
  const [goal, setGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal.trim() && !isLoading) {
      onSubmit(goal.trim());
      setGoal('');
    }
  };

  const exampleGoals = [
    "Analyze the commit frequency of the 'facebook/react' repository for the last 7 days and check the current price of BTC-USD",
    "Get the recent activity and statistics for 'microsoft/typescript' repo and fetch ETH-USD price history",
    "Process the GitHub data for 'vercel/next.js' and analyze market data for top 3 cryptocurrencies"
  ];

  const insertExample = (example: string) => {
    setGoal(example);
  };

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-6 shadow-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-white mb-2">
            Describe your goal for the AI agents
          </label>
          <div className="relative">
            <textarea
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Analyze the GitHub repo 'owner/repository' and get the current BTC price..."
              className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-200"
              rows={3}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!goal.trim() || isLoading}
              className="absolute bottom-3 right-3 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Example Goals */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <Lightbulb size={16} />
            <span>Try these examples:</span>
          </div>
          <div className="grid gap-2">
            {exampleGoals.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => insertExample(example)}
                className="text-left text-sm text-white/70 hover:text-white bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200"
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};