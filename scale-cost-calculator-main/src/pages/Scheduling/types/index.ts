export interface Activity {
  id: string;
  name: string;
  description?: string;
  optimistic: number;
  mostLikely: number;
  pessimistic: number;
  predecessors: string[];
  successors?: string[];
  earlyStart?: number;
  earlyFinish?: number;
  lateStart?: number;
  lateFinish?: number;
  slack?: number;
  isCritical?: boolean;
  startDate: string;  // Changed to string for input compatibility
  endDate: string;    // Changed to string for input compatibility
  progress: number;
  riskLevel: 'low' | 'medium' | 'high';
  duration?: number;  // Calculated duration in days
}

export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies: string[];
  riskLevel: 'low' | 'medium' | 'high';
  styles?: {
    backgroundColor?: string;
    progressColor?: string;
    progressSelectedColor?: string;
  };
}

export interface PERTResult {
  activities: Activity[];
  criticalPath: string[];
  totalDuration: number;
  aonData: any; // Will be used for Activity-on-Node visualization
  aoaData: any; // Will be used for Activity-on-Arrow visualization
}

export interface GanttData {
  tasks: GanttTask[];
  viewMode?: 'day' | 'week' | 'month';
  columnWidth?: number;
}
