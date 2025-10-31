// Advanced Estimation Models: FPA, PERT, and Story Points

export interface FeatureInput {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  dependencies: string[];
  
  // FPA inputs
  fpa?: {
    type: 'input' | 'output' | 'file' | 'interface' | 'inquiry';
    complexity: 'low' | 'medium' | 'high';
    numberOfElements: number;
    technicalFactor: number; // 0-14
  };
  
  // PERT inputs
  pert?: {
    optimistic: number; // days
    mostLikely: number; // days
    pessimistic: number; // days
  };
  
  // Story Points inputs
  storyPoints?: {
    description: string;
    points: number;
    teamVelocity: number; // points per sprint
    teamSize: number;
    sprintLength: number; // days
  };
  
  // RCA/Risk inputs
  rca?: {
    assignedResources: number;
    hourlyRate: number;
    riskFactor: number; // 0-30%
  };
}

export interface FeatureEstimationResult {
  featureId: string;
  featureName: string;
  fpa?: {
    functionPoints: number;
    effort: number; // person-days
    cost: number;
    duration: number; // days
  };
  pert?: {
    expectedEffort: number; // person-days
    variance: number;
    standardDeviation: number;
    risk: 'low' | 'medium' | 'high';
    cost: number;
    duration: number; // days
  };
  storyPoints?: {
    effort: number; // person-days
    sprints: number;
    duration: number; // days
    cost: number;
  };
}

// FPA Complexity Weights
const FPA_WEIGHTS = {
  input: { low: 3, medium: 4, high: 6 },
  output: { low: 4, medium: 5, high: 7 },
  file: { low: 7, medium: 10, high: 15 },
  interface: { low: 5, medium: 7, high: 10 },
  inquiry: { low: 3, medium: 4, high: 6 }
};

// Historical productivity: 1 FP = X person-days
const FP_TO_EFFORT_RATIO = 0.5; // Adjust based on organization

// Calculate Function Point Analysis
export const calculateFPA = (feature: FeatureInput): FeatureEstimationResult['fpa'] => {
  if (!feature.fpa) return undefined;
  
  const { type, complexity, numberOfElements, technicalFactor } = feature.fpa;
  
  // Calculate UFP (Unadjusted Function Points)
  const complexityWeight = FPA_WEIGHTS[type][complexity];
  const ufp = numberOfElements * complexityWeight;
  
  // Apply Technical Complexity Factor (TCF)
  const tcf = 0.65 + (0.01 * technicalFactor);
  const functionPoints = ufp * tcf;
  
  // Convert to effort (person-days)
  const effort = functionPoints * FP_TO_EFFORT_RATIO;
  
  // Estimate cost (assuming $500/person-day)
  const cost = effort * 500;
  
  // Estimate duration (assuming 1 person working)
  const duration = effort;
  
  return {
    functionPoints: Math.round(functionPoints * 10) / 10,
    effort: Math.round(effort * 10) / 10,
    cost: Math.round(cost),
    duration: Math.round(duration)
  };
};

// Calculate Three-Point / PERT
export const calculatePERT = (feature: FeatureInput): FeatureEstimationResult['pert'] => {
  if (!feature.pert) return undefined;
  
  const { optimistic, mostLikely, pessimistic } = feature.pert;
  
  // Expected Effort: E = (O + 4M + P) / 6
  const expectedEffort = (optimistic + (4 * mostLikely) + pessimistic) / 6;
  
  // Variance: V = ((P - O) / 6)^2
  const variance = Math.pow((pessimistic - optimistic) / 6, 2);
  
  // Standard Deviation
  const standardDeviation = Math.sqrt(variance);
  
  // Risk assessment based on variance
  let risk: 'low' | 'medium' | 'high' = 'low';
  if (standardDeviation > 5) risk = 'high';
  else if (standardDeviation > 2) risk = 'medium';
  
  // Cost estimation (assuming $500/person-day)
  const cost = expectedEffort * 500;
  
  // Duration equals expected effort for single resource
  const duration = expectedEffort;
  
  return {
    expectedEffort: Math.round(expectedEffort * 10) / 10,
    variance: Math.round(variance * 100) / 100,
    standardDeviation: Math.round(standardDeviation * 10) / 10,
    risk,
    cost: Math.round(cost),
    duration: Math.round(duration)
  };
};

// Calculate Agile Story Points
export const calculateStoryPoints = (feature: FeatureInput): FeatureEstimationResult['storyPoints'] => {
  if (!feature.storyPoints) return undefined;
  
  const { points, teamVelocity, teamSize, sprintLength } = feature.storyPoints;
  
  // Number of sprints needed
  const sprints = Math.ceil(points / teamVelocity);
  
  // Total duration in days
  const duration = sprints * sprintLength;
  
  // Effort in person-days
  const effort = (duration / sprintLength) * teamVelocity * (sprintLength / teamSize);
  
  // Cost estimation (assuming $500/person-day)
  const cost = effort * 500 * teamSize;
  
  return {
    effort: Math.round(effort * 10) / 10,
    sprints,
    duration,
    cost: Math.round(cost)
  };
};

// Calculate all advanced models for a feature
export const calculateFeatureEstimations = (feature: FeatureInput): FeatureEstimationResult => {
  return {
    featureId: feature.id,
    featureName: feature.name,
    fpa: calculateFPA(feature),
    pert: calculatePERT(feature),
    storyPoints: calculateStoryPoints(feature)
  };
};

// Aggregate results across multiple features
export const aggregateFeatureEstimations = (
  features: FeatureInput[]
): {
  fpa: { totalEffort: number; totalCost: number; totalDuration: number };
  pert: { totalEffort: number; totalCost: number; totalDuration: number; avgRisk: string };
  storyPoints: { totalEffort: number; totalCost: number; totalDuration: number; totalSprints: number };
} => {
  const results = features.map(calculateFeatureEstimations);
  
  const fpaResults = results.filter(r => r.fpa);
  const pertResults = results.filter(r => r.pert);
  const storyResults = results.filter(r => r.storyPoints);
  
  const fpa = {
    totalEffort: fpaResults.reduce((sum, r) => sum + (r.fpa?.effort || 0), 0),
    totalCost: fpaResults.reduce((sum, r) => sum + (r.fpa?.cost || 0), 0),
    totalDuration: Math.max(...fpaResults.map(r => r.fpa?.duration || 0))
  };
  
  const pert = {
    totalEffort: pertResults.reduce((sum, r) => sum + (r.pert?.expectedEffort || 0), 0),
    totalCost: pertResults.reduce((sum, r) => sum + (r.pert?.cost || 0), 0),
    totalDuration: Math.max(...pertResults.map(r => r.pert?.duration || 0)),
    avgRisk: calculateAvgRisk(pertResults.map(r => r.pert?.risk || 'low'))
  };
  
  const storyPoints = {
    totalEffort: storyResults.reduce((sum, r) => sum + (r.storyPoints?.effort || 0), 0),
    totalCost: storyResults.reduce((sum, r) => sum + (r.storyPoints?.cost || 0), 0),
    totalDuration: Math.max(...storyResults.map(r => r.storyPoints?.duration || 0)),
    totalSprints: Math.max(...storyResults.map(r => r.storyPoints?.sprints || 0))
  };
  
  return { fpa, pert, storyPoints };
};

const calculateAvgRisk = (risks: ('low' | 'medium' | 'high')[]): string => {
  const riskValues = { low: 1, medium: 2, high: 3 };
  const avg = risks.reduce((sum, r) => sum + riskValues[r], 0) / risks.length;
  if (avg <= 1.5) return 'low';
  if (avg <= 2.5) return 'medium';
  return 'high';
};
