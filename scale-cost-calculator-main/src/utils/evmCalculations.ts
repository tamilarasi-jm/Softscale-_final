export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDecimal = (value: number, places: number = 3): string => {
  return value.toFixed(places);
};

export const getPerformanceColor = (value: number, type: 'index' | 'variance'): string => {
  if (type === 'index') {
    if (value >= 1.0) return 'text-green-600 dark:text-green-400';
    if (value >= 0.9) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  } else {
    if (value >= 0) return 'text-green-600 dark:text-green-400';
    if (value >= -50000) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  }
};

export const getPerformanceBgColor = (value: number, type: 'index' | 'variance'): string => {
  if (type === 'index') {
    if (value >= 1.0) return 'from-green-500/20 to-green-600/20';
    if (value >= 0.9) return 'from-yellow-500/20 to-yellow-600/20';
    return 'from-red-500/20 to-red-600/20';
  } else {
    if (value >= 0) return 'from-green-500/20 to-green-600/20';
    if (value >= -50000) return 'from-yellow-500/20 to-yellow-600/20';
    return 'from-red-500/20 to-red-600/20';
  }
};

export const getPerformanceStatus = (value: number, type: 'index'): string => {
  if (value >= 1.0) return 'On Track';
  if (value >= 0.9) return 'Warning';
  return 'At Risk';
};

export const getHealthScore = (cpi: number, spi: number): number => {
  const cpiScore = Math.min(cpi * 50, 50);
  const spiScore = Math.min(spi * 50, 50);
  return Math.round(cpiScore + spiScore);
};

export const getTrendIcon = (value: number, type: 'index'): 'up' | 'down' => {
  return value >= 1.0 ? 'up' : 'down';
};
