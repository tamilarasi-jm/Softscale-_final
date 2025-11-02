export interface Tool {
  id: string;
  name: string;
  category: string;
  monthlyPriceUSD: number;
  hasFreePlan: boolean;
  icon?: string;
}

export interface ProjectPhase {
  id: string;
  name: string;
  duration: number; // in days
  dependencies: string[];
  color?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  phases: ProjectPhase[];
  estimatedDuration: number; // in weeks
}

export interface ProjectEstimate {
  selectedTools: Tool[];
  baseCost: number;
  overhead: number;
  totalMonthlyCost: number;
  projectDuration: number; // in weeks
  totalProjectCost: number;
  phases: ProjectPhase[];
}

export const TOOL_CATEGORIES = {
  DESIGN: '🎨 Design',
  NO_CODE: '🧩 No-code/Low-code',
  BACKEND: '🛠 Backend/Hosting',
  DEV_TOOLS: '⚙️ Dev Tools',
  PM: '📋 Project Management'
} as const;
