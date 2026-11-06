export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'backlog' | 'in_progress' | 'done';
export type SortOption = 'default' | 'priority_desc' | 'priority_asc' | 'date_asc' | 'date_desc' | 'files_desc' | 'title_asc';
export type GroupByOption = 'status' | 'priority' | 'assignee';
export type NavSection = 'dashboard' | 'projects' | 'calendar' | 'team' | 'reports' | 'settings';

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  lastInteraction: string;
  role: string;
  department?: string;
  email?: string;
  capacity?: number;
}

export interface TaskItem {
  id: string;
  title: string;
  priority: PriorityLevel;
  priorityLabel: string;
  assignee: TeamMember;
  dueDate: string;
  dueDateTimestamp: number;
  description: string;
  filesCount: number;
  tags: string[];
  status: TaskStatus;
  highlighted?: boolean;
}

export interface BoardColumn {
  id: string;
  title: string;
  defaultBadgeCount: number;
  status?: TaskStatus;
  tasks: TaskItem[];
}

export interface ProjectSummary {
  id: string;
  name: string;
  category: string;
  visibility: 'PUBLIC' | 'INTERNAL';
  progress: number;
  totalTasks: number;
  completedTasks: number;
  dueDate: string;
  lead: TeamMember;
  accentColor: string;
}
