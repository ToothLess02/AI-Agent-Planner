// Utility functions for the AI Agent system
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
  return `${Math.round(ms / 3600000)}h`;
}

export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`;
  return `${(num / 1000000000).toFixed(1)}B`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'text-emerald-600';
    case 'executing': case 'busy': return 'text-blue-600';
    case 'planning': return 'text-amber-600';
    case 'failed': return 'text-red-600';
    case 'pending': case 'idle': return 'text-gray-500';
    default: return 'text-gray-400';
  }
}

export function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'executing': case 'busy': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'planning': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'failed': return 'bg-red-100 text-red-800 border-red-200';
    case 'pending': case 'idle': return 'bg-gray-100 text-gray-600 border-gray-200';
    default: return 'bg-gray-50 text-gray-500 border-gray-200';
  }
}

export function calculateProgress(tasks: any[]): number {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(task => task.status === 'completed' || task.status === 'failed').length;
  return Math.round((completed / tasks.length) * 100);
}

export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  }) as T;
}

export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as unknown as T;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '');
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, '')
  };
}

export function extractCryptoSymbol(text: string): string | null {
  const cryptoRegex = /\b(BTC|ETH|ADA|DOT|LINK|UNI|AAVE|COMP|XRP|LTC|BCH|EOS|TRX|XLM|DOGE)-?(USD)?\b/gi;
  const match = text.match(cryptoRegex);
  if (!match) return null;
  
  const symbol = match[0].toUpperCase();
  return symbol.includes('-USD') ? symbol : `${symbol.replace('-', '')}-USD`;
}