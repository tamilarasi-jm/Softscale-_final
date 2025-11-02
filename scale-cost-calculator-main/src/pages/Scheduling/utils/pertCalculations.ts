import { Activity, PERTResult } from "../types";

/**
 * Calculate expected time using PERT formula
 */
export const calculateExpectedTime = (
  optimistic: number,
  mostLikely: number,
  pessimistic: number
): number => {
  return (optimistic + 4 * mostLikely + pessimistic) / 6;
};

/**
 * Calculate standard deviation
 */
export const calculateStandardDeviation = (
  optimistic: number,
  pessimistic: number
): number => {
  return (pessimistic - optimistic) / 6;
};

/**
 * Perform forward pass to calculate Early Start and Early Finish times
 */
const forwardPass = (activities: Activity[]): Activity[] => {
  const activitiesMap = new Map(activities.map(act => [act.id, { ...act }]));
  
  // Find activities with no predecessors (start nodes)
  const startActivities = Array.from(activitiesMap.values()).filter(
    act => act.predecessors.length === 0
  );

  // Initialize start activities
  startActivities.forEach(activity => {
    activity.earlyStart = 0;
    activity.earlyFinish = calculateExpectedTime(
      activity.optimistic,
      activity.mostLikely,
      activity.pessimistic
    );
  });

  // Process remaining activities in topological order
  const processed = new Set(startActivities.map(a => a.id));
  const queue = [...startActivities];

  while (queue.length > 0) {
    const current = queue.shift()!;
    
    // Update successors
    current.successors?.forEach(successorId => {
      const successor = activitiesMap.get(successorId)!;
      
      // Check if all predecessors are processed
      const allPredecessorsProcessed = successor.predecessors.every(predId => 
        processed.has(predId)
      );
      
      if (allPredecessorsProcessed) {
        // Find maximum early finish time among all predecessors
        const maxEarlyFinish = Math.max(
          ...successor.predecessors.map(predId => {
            const pred = activitiesMap.get(predId)!;
            return pred.earlyFinish!;
          })
        );
        
        successor.earlyStart = maxEarlyFinish;
        successor.earlyFinish = maxEarlyFinish + calculateExpectedTime(
          successor.optimistic,
          successor.mostLikely,
          successor.pessimistic
        );
        
        processed.add(successorId);
        queue.push(successor);
      }
    });
  }

  return Array.from(activitiesMap.values());
};

/**
 * Perform backward pass to calculate Late Start and Late Finish times
 */
const backwardPass = (activities: Activity[]): Activity[] => {
  const activitiesMap = new Map(activities.map(act => [act.id, { ...act }]));
  const activitiesList = Array.from(activitiesMap.values());
  
  // Find end activities (no successors)
  const endActivities = activitiesList.filter(
    act => !activitiesList.some(a => a.predecessors.includes(act.id))
  );
  
  // Project duration is the maximum early finish time
  const projectDuration = Math.max(...endActivities.map(a => a.earlyFinish!));
  
  // Initialize end activities
  endActivities.forEach(activity => {
    activity.lateFinish = projectDuration;
    activity.lateStart = projectDuration - calculateExpectedTime(
      activity.optimistic,
      activity.mostLikely,
      activity.pessimistic
    );
  });
  
  // Process activities in reverse topological order
  const processed = new Set(endActivities.map(a => a.id));
  const queue = [...endActivities];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    // Process predecessors
    current.predecessors.forEach(predecessorId => {
      const predecessor = activitiesMap.get(predecessorId)!;
      
      // Initialize successors if not already done
      if (!predecessor.successors) {
        predecessor.successors = [];
      }
      
      // Add current activity as successor to predecessor
      if (!predecessor.successors.includes(current.id)) {
        predecessor.successors.push(current.id);
      }
      
      // Initialize late finish if not set
      if (predecessor.lateFinish === undefined) {
        predecessor.lateFinish = current.lateStart!;
      } else {
        // Find minimum late start among all successors
        predecessor.lateFinish = Math.min(predecessor.lateFinish, current.lateStart!);
      }
      
      // Calculate late start
      predecessor.lateStart = predecessor.lateFinish - calculateExpectedTime(
        predecessor.optimistic,
        predecessor.mostLikely,
        predecessor.pessimistic
      );
      
      // Add to queue if all successors are processed
      const allSuccessorsProcessed = predecessor.successors.every(succId => 
        processed.has(succId)
      );
      
      if (allSuccessorsProcessed && !processed.has(predecessorId)) {
        processed.add(predecessorId);
        queue.push(predecessor);
      }
    });
  }
  
  return activitiesList;
};

/**
 * Calculate slack and identify critical path
 */
const calculateSlackAndCriticalPath = (activities: Activity[]): Activity[] => {
  const criticalPath: string[] = [];
  
  const updatedActivities = activities.map(activity => {
    const slack = (activity.lateFinish ?? 0) - (activity.earlyFinish ?? 0);
    const isCritical = Math.abs(slack) < 0.01; // Account for floating point precision
    
    if (isCritical) {
      criticalPath.push(activity.id);
    }
    
    return {
      ...activity,
      slack,
      isCritical,
    };
  });
  
  return updatedActivities;
};

/**
 * Main PERT calculation function
 */
export const calculatePERT = (activities: Activity[]): PERTResult => {
  // Add successors to activities
  const activitiesWithSuccessors = activities.map(activity => {
    const successors = activities
      .filter(a => a.predecessors.includes(activity.id))
      .map(a => a.id);
    
    return {
      ...activity,
      successors,
    };
  });
  
  // Perform forward pass
  const afterForwardPass = forwardPass(activitiesWithSuccessors);
  
  // Perform backward pass
  const afterBackwardPass = backwardPass(afterForwardPass);
  
  // Calculate slack and identify critical path
  const finalActivities = calculateSlackAndCriticalPath(afterBackwardPass);
  
  // Get critical path
  const criticalPath = finalActivities
    .filter(act => act.isCritical)
    .sort((a, b) => (a.earlyStart ?? 0) - (b.earlyStart ?? 0))
    .map(act => act.id);
  
  // Calculate total project duration
  const totalDuration = Math.max(
    ...finalActivities.map(a => a.earlyFinish ?? 0)
  );
  
  // Prepare AON and AOA data (to be implemented)
  const aonData = {};
  const aoaData = {};
  
  return {
    activities: finalActivities,
    criticalPath,
    totalDuration,
    aonData,
    aoaData,
  };
};

/**
 * Convert PERT activities to Gantt tasks
 */
export const convertToGanttTasks = (activities: Activity[]): any[] => {
  return activities.map(activity => ({
    id: activity.id,
    name: activity.name,
    start: new Date(2023, 0, 1 + (activity.earlyStart ?? 0)),
    end: new Date(2023, 0, 1 + (activity.earlyFinish ?? 0)),
    progress: activity.progress ?? 0,
    dependencies: activity.predecessors,
    riskLevel: activity.riskLevel ?? 'medium',
    styles: {
      backgroundColor: getRiskColor(activity.riskLevel),
      progressColor: getRiskColor(activity.riskLevel, true),
    },
  }));
};

/**
 * Get color based on risk level
 */
const getRiskColor = (riskLevel?: 'low' | 'medium' | 'high', isProgress = false): string => {
  switch (riskLevel) {
    case 'high':
      return isProgress ? '#ef4444' : '#fecaca';
    case 'low':
      return isProgress ? '#10b981' : '#bbf7d0';
    case 'medium':
    default:
      return isProgress ? '#f59e0b' : '#fef08a';
  }
};
