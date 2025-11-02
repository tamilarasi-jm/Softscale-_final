import { Tool, ProjectTemplate, ProjectPhase, TOOL_CATEGORIES } from '../types';

export const TOOLS: Tool[] = [
  // Design Tools
  { id: 'figma', name: 'Figma', category: TOOL_CATEGORIES.DESIGN, monthlyPriceUSD: 12, hasFreePlan: true },
  { id: 'canva', name: 'Canva', category: TOOL_CATEGORIES.DESIGN, monthlyPriceUSD: 12.99, hasFreePlan: true },
  { id: 'adobe-xd', name: 'Adobe XD', category: TOOL_CATEGORIES.DESIGN, monthlyPriceUSD: 9.99, hasFreePlan: false },
  { id: 'pixlr', name: 'Pixlr', category: TOOL_CATEGORIES.DESIGN, monthlyPriceUSD: 7.99, hasFreePlan: true },
  
  // No-code/Low-code
  { id: 'bubble', name: 'Bubble', category: TOOL_CATEGORIES.NO_CODE, monthlyPriceUSD: 25, hasFreePlan: true },
  { id: 'webflow', name: 'Webflow', category: TOOL_CATEGORIES.NO_CODE, monthlyPriceUSD: 14, hasFreePlan: true },
  { id: 'appsmith', name: 'Appsmith', category: TOOL_CATEGORIES.NO_CODE, monthlyPriceUSD: 0.4, hasFreePlan: true },
  { id: 'airtable', name: 'Airtable', category: TOOL_CATEGORIES.NO_CODE, monthlyPriceUSD: 10, hasFreePlan: true },
  
  // Backend/Hosting
  { id: 'heroku', name: 'Heroku', category: TOOL_CATEGORIES.BACKEND, monthlyPriceUSD: 7, hasFreePlan: true },
  { id: 'digitalocean', name: 'DigitalOcean', category: TOOL_CATEGORIES.BACKEND, monthlyPriceUSD: 5, hasFreePlan: false },
  { id: 'docker', name: 'Docker', category: TOOL_CATEGORIES.BACKEND, monthlyPriceUSD: 7, hasFreePlan: true },
  { id: 'firebase', name: 'Firebase', category: TOOL_CATEGORIES.BACKEND, monthlyPriceUSD: 0, hasFreePlan: true },
  
  // Dev Tools
  { id: 'github', name: 'GitHub', category: TOOL_CATEGORIES.DEV_TOOLS, monthlyPriceUSD: 4, hasFreePlan: true },
  { id: 'vscode', name: 'VS Code', category: TOOL_CATEGORIES.DEV_TOOLS, monthlyPriceUSD: 0, hasFreePlan: true },
  { id: 'jetbrains', name: 'JetBrains', category: TOOL_CATEGORIES.DEV_TOOLS, monthlyPriceUSD: 6.90, hasFreePlan: false },
  { id: 'postman', name: 'Postman', category: TOOL_CATEGORIES.DEV_TOOLS, monthlyPriceUSD: 12, hasFreePlan: true },
  
  // Project Management
  { id: 'trello', name: 'Trello', category: TOOL_CATEGORIES.PM, monthlyPriceUSD: 10, hasFreePlan: true },
  { id: 'asana', name: 'Asana', category: TOOL_CATEGORIES.PM, monthlyPriceUSD: 10.99, hasFreePlan: true },
  { id: 'notion', name: 'Notion', category: TOOL_CATEGORIES.PM, monthlyPriceUSD: 8, hasFreePlan: true },
  { id: 'clickup', name: 'ClickUp', category: TOOL_CATEGORIES.PM, monthlyPriceUSD: 5, hasFreePlan: true },
];

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'small-mvp',
    name: 'Small MVP',
    description: '3-4 week project for a minimal viable product',
    estimatedDuration: 4,
    phases: [
      { id: 'research', name: 'Research', duration: 3, dependencies: [] },
      { id: 'design', name: 'Design', duration: 5, dependencies: ['research'] },
      { id: 'development', name: 'Development', duration: 10, dependencies: ['design'] },
      { id: 'testing', name: 'Testing', duration: 4, dependencies: ['development'] },
      { id: 'launch', name: 'Launch', duration: 2, dependencies: ['testing'] },
    ]
  },
  {
    id: 'medium-app',
    name: 'Medium App',
    description: '6-10 week project for a medium complexity application',
    estimatedDuration: 10,
    phases: [
      { id: 'research', name: 'Research', duration: 5, dependencies: [] },
      { id: 'design', name: 'Design', duration: 10, dependencies: ['research'] },
      { id: 'development', name: 'Development', duration: 20, dependencies: ['design'] },
      { id: 'integration', name: 'Integration', duration: 10, dependencies: ['development'] },
      { id: 'testing', name: 'Testing', duration: 10, dependencies: ['integration'] },
      { id: 'deploy', name: 'Deploy', duration: 5, dependencies: ['testing'] },
    ]
  },
  {
    id: 'large-system',
    name: 'Large System',
    description: '12-20+ week project for a large scale system',
    estimatedDuration: 20,
    phases: [
      { id: 'research', name: 'Research', duration: 10, dependencies: [] },
      { id: 'design', name: 'Design', duration: 20, dependencies: ['research'] },
      { id: 'development', name: 'Development', duration: 40, dependencies: ['design'] },
      { id: 'review', name: 'Review', duration: 10, dependencies: ['development'] },
      { id: 'testing', name: 'Testing', duration: 15, dependencies: ['review'] },
      { id: 'deploy', name: 'Deploy', duration: 10, dependencies: ['testing'] },
      { id: 'maintain', name: 'Maintain', duration: 0, dependencies: ['deploy'] },
    ]
  }
];
