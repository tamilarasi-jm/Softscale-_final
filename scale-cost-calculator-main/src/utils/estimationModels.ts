interface EstimationParams {
  projectSize: number; // KLOC
  teamSize: number;
  timeline: number; // months
  complexity: 'low' | 'medium' | 'high';
}

interface EstimationResult {
  cost: number;
  effort: number; // Person-months
  duration: number; // months
  risk: 'low' | 'medium' | 'high';
}

const COST_PER_PM = 8000; // Cost per person-month in USD

// COCOMO II Model
export const calculateCOCOMO = (params: EstimationParams): EstimationResult => {
  const { projectSize, complexity } = params;
  
  // Complexity factors
  const complexityFactors = {
    low: 1.0,
    medium: 1.12,
    high: 1.24
  };
  
  const factor = complexityFactors[complexity];
  
  // COCOMO II Basic formula: Effort = a * (KLOC)^b
  const a = 2.94;
  const b = 1.09;
  
  const effortPM = a * Math.pow(projectSize, b) * factor;
  const duration = 3.67 * Math.pow(effortPM, 0.28);
  const cost = effortPM * COST_PER_PM;
  
  // Risk assessment based on project size and complexity
  let risk: 'low' | 'medium' | 'high' = 'low';
  if (projectSize > 50 || complexity === 'high') risk = 'high';
  else if (projectSize > 30 || complexity === 'medium') risk = 'medium';
  
  return {
    cost: Math.round(cost),
    effort: effortPM,
    duration,
    risk
  };
};

// SLIM Model (Software Lifecycle Management)
export const calculateSLIM = (params: EstimationParams): EstimationResult => {
  const { projectSize, teamSize, complexity } = params;
  
  // Productivity factor based on team size and complexity
  const productivityFactors = {
    low: 2000,
    medium: 1500,
    high: 1000
  };
  
  const productivity = productivityFactors[complexity];
  const effortPM = (projectSize * 1000) / productivity;
  
  // SLIM focuses on optimal team size
  const optimalTeamSize = Math.sqrt(effortPM);
  const teamEfficiency = Math.min(1.0, optimalTeamSize / teamSize);
  
  const adjustedEffort = effortPM / teamEfficiency;
  const duration = adjustedEffort / teamSize;
  const cost = adjustedEffort * COST_PER_PM;
  
  // Risk based on team size mismatch
  let risk: 'low' | 'medium' | 'high' = 'low';
  if (teamEfficiency < 0.7) risk = 'high';
  else if (teamEfficiency < 0.85) risk = 'medium';
  
  return {
    cost: Math.round(cost),
    effort: adjustedEffort,
    duration,
    risk
  };
};

// RCA Price Model (Resource Constraint Analysis)
export const calculateRCA = (params: EstimationParams): EstimationResult => {
  const { projectSize, teamSize, timeline, complexity } = params;
  
  // Calculate based on constraints
  const complexityMultipliers = {
    low: 1.0,
    medium: 1.3,
    high: 1.6
  };
  
  const multiplier = complexityMultipliers[complexity];
  
  // Effort constrained by timeline and team
  const maxEffort = teamSize * timeline;
  const requiredEffort = (projectSize / 2) * multiplier; // Simplified formula
  
  const effortPM = Math.max(requiredEffort, maxEffort * 0.8);
  const duration = effortPM / teamSize;
  const cost = effortPM * COST_PER_PM;
  
  // Risk based on resource constraints
  let risk: 'low' | 'medium' | 'high' = 'low';
  if (requiredEffort > maxEffort * 1.2) risk = 'high';
  else if (requiredEffort > maxEffort) risk = 'medium';
  
  return {
    cost: Math.round(cost),
    effort: effortPM,
    duration,
    risk
  };
};

export const calculateAllModels = (params: EstimationParams) => {
  return {
    cocomo: calculateCOCOMO(params),
    slim: calculateSLIM(params),
    rca: calculateRCA(params)
  };
};

export const getRecommendedModel = (params: EstimationParams): 'cocomo' | 'slim' | 'rca' => {
  const results = calculateAllModels(params);
  
  // Recommend based on lowest risk
  const risks = {
    cocomo: results.cocomo.risk,
    slim: results.slim.risk,
    rca: results.rca.risk
  };
  
  // Priority: low > medium > high
  const riskPriority = { low: 0, medium: 1, high: 2 };
  
  let recommended: 'cocomo' | 'slim' | 'rca' = 'cocomo';
  let lowestRisk = riskPriority[risks.cocomo];
  
  if (riskPriority[risks.slim] < lowestRisk) {
    recommended = 'slim';
    lowestRisk = riskPriority[risks.slim];
  }
  
  if (riskPriority[risks.rca] < lowestRisk) {
    recommended = 'rca';
  }
  
  return recommended;
};
