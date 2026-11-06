import { ProjectSummary, TaskItem, TeamMember } from '../models/task.model';

function svgAvatar(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

export const TEAM_MEMBERS: Record<string, TeamMember> = {
  robin: {
    id: 'robin',
    name: 'Robin Cooper',
    lastInteraction: '2 min. ago',
    role: 'Content Strategist',
    department: 'Marketing',
    email: 'robin.cooper@google.com',
    capacity: 84,
    avatar: svgAvatar(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
        <defs>
          <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#e4e7ec"/>
            <stop offset="100%" stop-color="#cfd4dc"/>
          </linearGradient>
        </defs>
        <rect width="80" height="80" rx="40" fill="url(#bg1)"/>
        <path d="M16 78 C18 58 62 58 64 78" fill="#1e2430"/>
        <path d="M32 54 L48 54 L48 64 L32 64 Z" fill="#e6b89c"/>
        <ellipse cx="40" cy="39" rx="14" ry="17" fill="#f1c6ab"/>
        <path d="M24 35 C22 21 32 15 41 16 C51 16 57 23 55 36 C53 29 48 25 40 25 C31 25 27 29 24 35 Z" fill="#4a3222"/>
        <circle cx="30" cy="22" r="5" fill="#4a3222"/>
        <circle cx="40" cy="19" r="6" fill="#573b28"/>
        <circle cx="50" cy="23" r="5" fill="#4a3222"/>
        <circle cx="35" cy="38" r="1.8" fill="#2b211b"/>
        <circle cx="45" cy="38" r="1.8" fill="#2b211b"/>
        <path d="M36 47 Q40 50 44 47" stroke="#b57659" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    `)
  },
  olive: {
    id: 'olive',
    name: 'Olive Kenji',
    lastInteraction: '40 min. ago',
    role: 'Growth & Research Lead',
    department: 'Growth & SEO',
    email: 'olive.kenji@google.com',
    capacity: 92,
    avatar: svgAvatar(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
        <rect width="80" height="80" rx="40" fill="#dfe3ea"/>
        <path d="M14 80 C16 58 64 58 66 80" fill="#232733"/>
        <rect x="33" y="50" width="14" height="14" fill="#8d583e"/>
        <ellipse cx="40" cy="38" rx="14" ry="17.5" fill="#9f6649"/>
        <path d="M25 33 C25 18 55 18 55 33 C52 25 28 25 25 33 Z" fill="#1b1716"/>
        <path d="M27 42 C28 52 52 52 53 42 C52 54 46 56 40 56 C34 56 28 54 27 42 Z" fill="#241c19" opacity="0.75"/>
        <circle cx="34.5" cy="37" r="1.8" fill="#1a1412"/>
        <circle cx="45.5" cy="37" r="1.8" fill="#1a1412"/>
        <path d="M36 46 Q40 49.5 44 46" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    `)
  },
  sophia: {
    id: 'sophia',
    name: 'Sophia Bennett',
    lastInteraction: '4 hours ago',
    role: 'Brand Director',
    department: 'Design & Creative',
    email: 'sophia.bennett@google.com',
    capacity: 76,
    avatar: svgAvatar(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
        <rect width="80" height="80" rx="40" fill="#e6e8ef"/>
        <path d="M22 36 C21 55 24 68 28 76 L52 76 C56 68 59 55 58 36 Z" fill="#1b191d"/>
        <path d="M16 80 C19 60 61 60 64 80" fill="#1e222d"/>
        <rect x="34" y="51" width="12" height="12" fill="#eabfa4"/>
        <ellipse cx="40" cy="38" rx="13.5" ry="16.5" fill="#f5ccb3"/>
        <path d="M25 38 C25 20 35 16 40 16 C47 16 56 21 55 38 C51 28 45 25 39 26 C33 27 28 31 25 38 Z" fill="#1b191d"/>
        <circle cx="35" cy="38" r="1.7" fill="#231f20"/>
        <circle cx="45" cy="38" r="1.7" fill="#231f20"/>
        <path d="M36 46 Q40 49 44 46" stroke="#c86d68" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    `)
  },
  marcus: {
    id: 'marcus',
    name: 'Marcus Levin',
    lastInteraction: '2 days ago',
    role: 'CRM & Data Analyst',
    department: 'Analytics',
    email: 'marcus.levin@google.com',
    capacity: 88,
    avatar: svgAvatar(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
        <rect width="80" height="80" rx="40" fill="#e2e6ee"/>
        <path d="M15 80 C18 59 62 59 65 80" fill="#262b38"/>
        <path d="M32 60 L40 72 L48 60 Z" fill="#ffffff"/>
        <rect x="33" y="50" width="14" height="13" fill="#d9a98c"/>
        <ellipse cx="40" cy="38" rx="14" ry="17" fill="#e5b89b"/>
        <path d="M25 35 C24 19 36 15 42 16 C51 17 57 23 55 35 C52 27 46 24 39 24 C32 24 28 28 25 35 Z" fill="#2a211d"/>
        <path d="M28 43 C29 52 51 52 52 43 C50 53 45 55 40 55 C35 55 30 53 28 43 Z" fill="#332823" opacity="0.8"/>
        <circle cx="35" cy="37.5" r="1.8" fill="#1f1916"/>
        <circle cx="45" cy="37.5" r="1.8" fill="#1f1916"/>
        <path d="M36.5 46 Q40 48.5 43.5 46" stroke="#a66b53" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      </svg>
    `)
  },
  maya: {
    id: 'maya',
    name: 'Maya Hart',
    lastInteraction: '5 days ago',
    role: 'Creative & SEO Lead',
    department: 'Design & Creative',
    email: 'maya.hart@google.com',
    capacity: 95,
    avatar: svgAvatar(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
        <rect width="80" height="80" rx="40" fill="#e8ebf2"/>
        <path d="M20 35 C18 55 22 69 27 77 L53 77 C58 69 62 55 60 35 Z" fill="#251c1a"/>
        <path d="M16 80 C20 60 60 60 64 80" fill="#222530"/>
        <rect x="34" y="50" width="12" height="12" fill="#dead92"/>
        <ellipse cx="40" cy="38" rx="13.5" ry="16.5" fill="#ecc0a6"/>
        <path d="M24 37 C24 19 35 15 41 16 C49 17 57 22 56 37 C52 27 45 25 39 25 C32 25 27 29 24 37 Z" fill="#251c1a"/>
        <circle cx="35" cy="38" r="1.8" fill="#231c1a"/>
        <circle cx="45" cy="38" r="1.8" fill="#231c1a"/>
        <path d="M36 46 Q40 49 44 46" stroke="#bf6b63" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    `)
  },
  alex: {
    id: 'alex',
    name: 'Alex Hill',
    lastInteraction: '1 day ago',
    role: 'Marketing Strategist',
    department: 'Marketing',
    email: 'alex.hill@google.com',
    capacity: 79,
    avatar: svgAvatar(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
        <rect width="80" height="80" rx="40" fill="#dde3ec"/>
        <path d="M15 80 C18 59 62 59 65 80" fill="#41526b"/>
        <rect x="33" y="50" width="14" height="13" fill="#e2b49a"/>
        <ellipse cx="40" cy="38" rx="14" ry="16.5" fill="#eec4ab"/>
        <path d="M26 34 C25 20 35 16 42 17 C50 18 55 23 54 34 C51 27 45 24 39 24 C32 24 28 28 26 34 Z" fill="#5e4332"/>
        <circle cx="35" cy="38" r="1.8" fill="#261f1b"/>
        <circle cx="45" cy="38" r="1.8" fill="#261f1b"/>
        <path d="M36 46 Q40 48.5 44 46" stroke="#b07259" stroke-width="1.8" fill="none" stroke-linecap="round"/>
      </svg>
    `)
  }
};

export const RECENT_INTERACTIONS: TeamMember[] = [
  TEAM_MEMBERS['robin'],
  TEAM_MEMBERS['olive'],
  TEAM_MEMBERS['sophia'],
  TEAM_MEMBERS['marcus'],
  TEAM_MEMBERS['maya']
];

export const HEADER_AVATARS: TeamMember[] = [
  TEAM_MEMBERS['olive'],
  TEAM_MEMBERS['robin'],
  TEAM_MEMBERS['sophia']
];

export const PROJECT_SUMMARIES: ProjectSummary[] = [
  {
    id: 'proj-marketing',
    name: 'Marketing Campaign',
    category: 'Assets & deliverables',
    visibility: 'PUBLIC',
    progress: 25,
    totalTasks: 43,
    completedTasks: 25,
    dueDate: 'Oct 15, 2025',
    lead: TEAM_MEMBERS['olive'],
    accentColor: '#f93295'
  },
  {
    id: 'proj-redesign',
    name: 'Scopeboard Mobile 2.0',
    category: 'UI/UX & Design System',
    visibility: 'INTERNAL',
    progress: 68,
    totalTasks: 32,
    completedTasks: 22,
    dueDate: 'Nov 04, 2025',
    lead: TEAM_MEMBERS['maya'],
    accentColor: '#5641f5'
  },
  {
    id: 'proj-crm',
    name: 'Customer Data Pipeline',
    category: 'CRM & Segmentation',
    visibility: 'INTERNAL',
    progress: 82,
    totalTasks: 28,
    completedTasks: 23,
    dueDate: 'Sep 30, 2025',
    lead: TEAM_MEMBERS['marcus'],
    accentColor: '#20b486'
  },
  {
    id: 'proj-brand',
    name: 'Q4 Brand Storytelling',
    category: 'Social & Influencer PR',
    visibility: 'PUBLIC',
    progress: 45,
    totalTasks: 19,
    completedTasks: 9,
    dueDate: 'Oct 28, 2025',
    lead: TEAM_MEMBERS['sophia'],
    accentColor: '#ebb035'
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  // BACKLOG
  {
    id: 'task-1',
    title: "Research competitors' campaigns",
    priority: 'LOW',
    priorityLabel: 'LOW PRIORITY',
    assignee: TEAM_MEMBERS['olive'],
    dueDate: 'Sep 25, 2025',
    dueDateTimestamp: new Date('2025-09-25').getTime(),
    description: 'Collect data on top-performing campaigns and platforms.',
    filesCount: 56,
    tags: ['Research', 'Tech'],
    status: 'backlog'
  },
  {
    id: 'task-2',
    title: 'Brainstorm content ideas',
    priority: 'MEDIUM',
    priorityLabel: 'MEDIUM PRIORITY',
    assignee: TEAM_MEMBERS['robin'],
    dueDate: 'Sep 26, 2025',
    dueDateTimestamp: new Date('2025-09-26').getTime(),
    description: 'Initial ideas for ad creatives and blog posts. Find new ideas.',
    filesCount: 150,
    tags: ['Planning'],
    status: 'backlog'
  },
  {
    id: 'task-3',
    title: 'Define campaign objectives',
    priority: 'HIGH',
    priorityLabel: 'HIGH PRIORITY',
    assignee: TEAM_MEMBERS['alex'],
    dueDate: 'Sep 28, 2025',
    dueDateTimestamp: new Date('2025-09-28').getTime(),
    description: 'Clarify KPIs, budget, and target audience. Learn more about your competitors.',
    filesCount: 410,
    tags: ['Research', 'Seo'],
    status: 'backlog'
  },

  // IN PROGRESS
  {
    id: 'task-4',
    title: 'Design Instagram creatives',
    priority: 'MEDIUM',
    priorityLabel: 'MEDIUM PRIORITY',
    assignee: TEAM_MEMBERS['maya'],
    dueDate: 'Oct 5, 2025',
    dueDateTimestamp: new Date('2025-10-05').getTime(),
    description: 'Carousel and story visuals with campaign theme.',
    filesCount: 121,
    tags: ['Social Media', 'Planning'],
    status: 'in_progress'
  },
  {
    id: 'task-5',
    title: 'Email template design',
    priority: 'LOW',
    priorityLabel: 'LOW PRIORITY',
    assignee: TEAM_MEMBERS['alex'],
    dueDate: 'Sep 16, 2025',
    dueDateTimestamp: new Date('2025-09-16').getTime(),
    description: 'Created master template for email drip.',
    filesCount: 56,
    tags: ['Design', 'Email', 'Content'],
    status: 'in_progress'
  },
  {
    id: 'task-6',
    title: 'Landing page draft',
    priority: 'LOW',
    priorityLabel: 'LOW PRIORITY',
    assignee: TEAM_MEMBERS['olive'],
    dueDate: 'Sep 25, 2025',
    dueDateTimestamp: new Date('2025-09-25').getTime(),
    description: 'Create first version for A/B testing.',
    filesCount: 56,
    tags: ['UI', 'UX', 'Design'],
    status: 'in_progress'
  },

  // DONE
  {
    id: 'task-7',
    title: 'Audience segmentation',
    priority: 'LOW',
    priorityLabel: 'LOW PRIORITY',
    assignee: TEAM_MEMBERS['marcus'],
    dueDate: 'Sep 25, 2025',
    dueDateTimestamp: new Date('2025-09-25').getTime(),
    description: 'Groups defined in CRM with demographics.',
    filesCount: 81,
    tags: ['Research', 'Content'],
    status: 'done'
  },
  {
    id: 'task-8',
    title: 'SEO audit results',
    priority: 'MEDIUM',
    priorityLabel: 'MEDIUM PRIORITY',
    assignee: TEAM_MEMBERS['maya'],
    dueDate: 'Sep 26, 2025',
    dueDateTimestamp: new Date('2025-09-26').getTime(),
    description: 'Review findings and integrate suggestions. The website content review.',
    filesCount: 41,
    tags: ['Seo', 'Planning'],
    status: 'done',
    highlighted: true
  },
  {
    id: 'task-9',
    title: 'Influencer outreach',
    priority: 'MEDIUM',
    priorityLabel: 'MEDIUM PRIORITY',
    assignee: TEAM_MEMBERS['olive'],
    dueDate: 'Sep 19, 2025',
    dueDateTimestamp: new Date('2025-09-19').getTime(),
    description: 'Contact influencers and propose collaboration.',
    filesCount: 410,
    tags: ['Social Media'],
    status: 'done'
  }
];
