export interface Activity {
  id: string;
  name: string;
  duration: number;
  predecessors: string[];
  es?: number;
  ef?: number;
  ls?: number;
  lf?: number;
  float?: number;
  isCritical?: boolean;
}

export interface AOAEvent {
  id: string;
  eet?: number;  // Earliest Event Time
  let?: number;  // Latest Event Time
  isCritical?: boolean;
}

export interface AOAActivity {
  id: string;
  from: string;
  to: string;
  duration: number;
  name: string;
  totalFloat?: number;
  freeFloat?: number;
  isCritical?: boolean;
}

// AON Calculations
export const calculateAON = (activities: Activity[]): Activity[] => {
  // Create a map for quick lookup
  const activityMap = new Map<string, Activity>();
  activities.forEach(act => {
    activityMap.set(act.id, { ...act });
  });

  // Forward Pass (Calculate ES and EF)
  const calculateForwardPass = (activityId: string): number => {
    const activity = activityMap.get(activityId)!;
    
    if (activity.es !== undefined) return activity.es;
    
    if (activity.predecessors.length === 0) {
      activity.es = 0;
    } else {
      activity.es = Math.max(
        ...activity.predecessors.map(predId => {
          const pred = activityMap.get(predId)!;
          return calculateForwardPass(predId) + pred.duration;
        })
      );
    }
    
    activity.ef = activity.es + activity.duration;
    return activity.es;
  };

  // Calculate forward pass for all activities
  activities.forEach(activity => {
    if (activity.es === undefined) {
      calculateForwardPass(activity.id);
    }
  });

  // Find project duration (maximum EF)
  const projectDuration = Math.max(
    ...Array.from(activityMap.values()).map(a => a.ef!)
  );

  // Backward Pass (Calculate LS and LF)
  const calculateBackwardPass = (activityId: string): number => {
    const activity = activityMap.get(activityId)!;
    
    if (activity.lf !== undefined) return activity.lf;
    
    // Find all activities that have this one as a predecessor
    const successors = Array.from(activityMap.values()).filter(a => 
      a.predecessors.includes(activityId)
    );
    
    if (successors.length === 0) {
      // Last activity
      activity.lf = projectDuration;
    } else {
      activity.lf = Math.min(
        ...successors.map(succ => {
          const succLs = calculateBackwardPass(succ.id) - succ.duration;
          return succLs;
        })
      );
    }
    
    activity.ls = activity.lf - activity.duration;
    activity.float = activity.ls - activity.es!;
    activity.isCritical = Math.abs(activity.float!) < 0.001; // Handle floating point precision
    
    return activity.lf;
  };

  // Calculate backward pass for all activities in reverse order
  const reverseOrder = [...activities].reverse();
  reverseOrder.forEach(activity => {
    if (activity.lf === undefined) {
      calculateBackwardPass(activity.id);
    }
  });

  return Array.from(activityMap.values());
};

// AOA Calculations
export const calculateAOA = (activities: AOAActivity[]) => {
  // Extract all unique events
  const events = new Set<string>();
  activities.forEach(activity => {
    events.add(activity.from);
    events.add(activity.to);
  });

  const eventMap = new Map<string, AOAEvent>();
  events.forEach(eventId => {
    eventMap.set(eventId, { id: eventId });
  });

  // Forward Pass (Calculate EET)
  const calculateEET = (eventId: string): number => {
    const event = eventMap.get(eventId)!;
    
    if (event.eet !== undefined) return event.eet;
    
    // Find all incoming activities
    const incoming = activities.filter(a => a.to === eventId);
    
    if (incoming.length === 0) {
      // Start event
      event.eet = 0;
    } else {
      event.eet = Math.max(
        ...incoming.map(a => {
          const fromEET = calculateEET(a.from);
          return fromEET + a.duration;
        })
      );
    }
    
    return event.eet;
  };

  // Calculate EET for all events
  events.forEach(eventId => {
    if (eventMap.get(eventId)?.eet === undefined) {
      calculateEET(eventId);
    }
  });

  // Project duration is EET of the last event
  const projectDuration = Math.max(
    ...Array.from(eventMap.values()).map(e => e.eet!)
  );

  // Backward Pass (Calculate LET)
  const calculateLET = (eventId: string): number => {
    const event = eventMap.get(eventId)!;
    
    if (event.let !== undefined) return event.let;
    
    // Find all outgoing activities
    const outgoing = activities.filter(a => a.from === eventId);
    
    if (outgoing.length === 0) {
      // End event
      event.let = projectDuration;
    } else {
      event.let = Math.min(
        ...outgoing.map(a => {
          const toLET = calculateLET(a.to);
          return toLET - a.duration;
        })
      );
    }
    
    return event.let;
  };

  // Calculate LET for all events in reverse order
  const reverseOrder = Array.from(events).reverse();
  reverseOrder.forEach(eventId => {
    if (eventMap.get(eventId)?.let === undefined) {
      calculateLET(eventId);
    }
  });

  // Mark critical events (where EET = LET)
  eventMap.forEach(event => {
    event.isCritical = Math.abs(event.eet! - event.let!) < 0.001;
  });

  // Calculate floats for activities
  const updatedActivities = activities.map(activity => {
    const fromEvent = eventMap.get(activity.from)!;
    const toEvent = eventMap.get(activity.to)!;
    
    const totalFloat = toEvent.let! - fromEvent.eet! - activity.duration;
    const freeFloat = toEvent.eet! - fromEvent.eet! - activity.duration;
    
    return {
      ...activity,
      totalFloat,
      freeFloat,
      isCritical: Math.abs(totalFloat) < 0.001 // Handle floating point precision
    };
  });

  return {
    events: Array.from(eventMap.values()),
    activities: updatedActivities,
    projectDuration
  };
};

// Helper function to convert AON activities to AOA format
export const convertAONtoAOA = (activities: Activity[]): AOAActivity[] => {
  const aoaActivities: AOAActivity[] = [];
  const eventMap = new Map<string, number>();
  let nextEventId = 1;
  
  // Create start event
  const startEvent = '1';
  eventMap.set('start', 1);
  
  // Add a mapping for each activity
  activities.forEach(activity => {
    const fromEvent = activity.predecessors.length > 0 
      ? activity.predecessors[0] // Simplified - in a real scenario, you'd need to handle multiple predecessors
      : startEvent;
      
    const toEvent = (nextEventId++).toString();
    
    aoaActivities.push({
      id: activity.id,
      from: fromEvent,
      to: toEvent,
      duration: activity.duration,
      name: activity.name
    });
  });
  
  return aoaActivities;
};
