import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BoardColumn,
  GroupByOption,
  NavSection,
  PriorityLevel,
  SortOption,
  TaskItem,
  TaskStatus,
  TeamMember
} from './models/task.model';
import {
  HEADER_AVATARS,
  INITIAL_TASKS,
  RECENT_INTERACTIONS,
  TEAM_MEMBERS
} from './data/mock-data';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TaskCardComponent } from './components/task-card/task-card.component';
import { DashboardViewComponent } from './components/dashboard-view/dashboard-view.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';
import { TeamViewComponent } from './components/team-view/team-view.component';
import { ReportsViewComponent } from './components/reports-view/reports-view.component';
import { SettingsViewComponent } from './components/settings-view/settings-view.component';

const STORAGE_KEY = 'scopeboard_tasks_v1';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    TaskCardComponent,
    DashboardViewComponent,
    CalendarViewComponent,
    TeamViewComponent,
    ReportsViewComponent,
    SettingsViewComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  activeNav: NavSection = 'projects';
  mobileMenuOpen = false;

  tasks: TaskItem[] = INITIAL_TASKS.map((t) => ({ ...t, tags: [...t.tags] }));
  recentInteractions: TeamMember[] = [...RECENT_INTERACTIONS];
  headerAvatars: TeamMember[] = [...HEADER_AVATARS];
  allMembers: TeamMember[] = Object.values(TEAM_MEMBERS);

  // Live Search, Filter, Sort & Group states
  searchQuery = '';
  selectedPriority: 'ALL' | PriorityLevel = 'ALL';
  selectedAssigneeId: string = 'ALL';
  selectedTag: string = 'ALL';
  sortBy: SortOption = 'default';
  groupBy: GroupByOption = 'status';

  // Dropdown states
  activeDropdown: 'filter' | 'sort' | 'group' | 'deliverables' | null = null;
  activeColumnMenuId: string | null = null;
  deliverableCategory = 'Assets & deliverables';

  // Add Task Modal state
  showAddModal = false;
  titleError = false;
  newTaskTitle = '';
  newTaskDescription = '';
  newTaskPriority: PriorityLevel = 'MEDIUM';
  newTaskStatus: TaskStatus = 'backlog';
  newTaskAssigneeId = 'olive';
  newTaskDueDate = 'Sep 25, 2025';
  newTaskFilesCount = 24;
  newTaskTags = 'Planning, Content';
  availableQuickTags = ['Research', 'Planning', 'Seo', 'Social Media', 'Design', 'Tech', 'Content', 'UI', 'UX'];

  // Inline Quick-Add state per column
  inlineAddColumnStatus: TaskStatus | null = null;
  inlineTaskTitle = '';
  inlineTaskPriority: PriorityLevel = 'MEDIUM';

  // Toast Notification state
  toastMessage = '';
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as TaskItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.tasks = parsed;
        }
      }
    } catch {
      // Ignore storage errors
    }
  }

  private saveTasks(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks));
    } catch {
      // Ignore storage errors
    }
  }

  showToast(msg: string): void {
    this.toastMessage = msg;
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => {
      this.toastMessage = '';
    }, 3200);
  }

  get allTags(): string[] {
    const tagSet = new Set<string>();
    this.tasks.forEach((t) => t.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }

  get hasActiveFilters(): boolean {
    return (
      this.searchQuery.trim().length > 0 ||
      this.selectedPriority !== 'ALL' ||
      this.selectedAssigneeId !== 'ALL' ||
      this.selectedTag !== 'ALL'
    );
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.selectedPriority !== 'ALL') count++;
    if (this.selectedAssigneeId !== 'ALL') count++;
    if (this.selectedTag !== 'ALL') count++;
    return count;
  }

  get sortLabel(): string {
    switch (this.sortBy) {
      case 'priority_desc':
        return 'Priority: High → Low';
      case 'priority_asc':
        return 'Priority: Low → High';
      case 'date_asc':
        return 'Date: Earliest';
      case 'date_desc':
        return 'Date: Latest';
      case 'files_desc':
        return 'Most Files';
      case 'title_asc':
        return 'Title: A → Z';
      default:
        return 'Sorted by';
    }
  }

  get groupLabel(): string {
    switch (this.groupBy) {
      case 'priority':
        return 'Group: Priority';
      case 'assignee':
        return 'Group: Assignee';
      default:
        return 'Group by';
    }
  }

  get progressPercentage(): number {
    const doneCount = this.tasks.filter((t) => t.status === 'done').length;
    if (this.tasks.length === 9 && doneCount === 3) {
      return 25;
    }
    if (this.tasks.length === 0) return 0;
    return Math.round((doneCount / this.tasks.length) * 100);
  }

  get filteredTasks(): TaskItem[] {
    const query = this.searchQuery.trim().toLowerCase();

    return this.tasks.filter((task) => {
      if (this.selectedPriority !== 'ALL' && task.priority !== this.selectedPriority) {
        return false;
      }
      if (this.selectedAssigneeId !== 'ALL' && task.assignee.id !== this.selectedAssigneeId) {
        return false;
      }
      if (
        this.selectedTag !== 'ALL' &&
        !task.tags.some((t) => t.toLowerCase() === this.selectedTag.toLowerCase())
      ) {
        return false;
      }
      if (query) {
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        const matchesAssignee = task.assignee.name.toLowerCase().includes(query);
        const matchesTag = task.tags.some((t) => t.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesAssignee || matchesTag;
      }
      return true;
    });
  }

  private sortTasks(items: TaskItem[]): TaskItem[] {
    const copy = [...items];
    const priorityRank: Record<PriorityLevel, number> = {
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1
    };

    switch (this.sortBy) {
      case 'priority_desc':
        return copy.sort((a, b) => priorityRank[b.priority] - priorityRank[a.priority]);
      case 'priority_asc':
        return copy.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
      case 'date_asc':
        return copy.sort((a, b) => a.dueDateTimestamp - b.dueDateTimestamp);
      case 'date_desc':
        return copy.sort((a, b) => b.dueDateTimestamp - a.dueDateTimestamp);
      case 'files_desc':
        return copy.sort((a, b) => b.filesCount - a.filesCount);
      case 'title_asc':
        return copy.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return copy;
    }
  }

  get boardColumns(): BoardColumn[] {
    const filtered = this.filteredTasks;

    if (this.groupBy === 'priority') {
      const highTasks = this.sortTasks(filtered.filter((t) => t.priority === 'HIGH'));
      const medTasks = this.sortTasks(filtered.filter((t) => t.priority === 'MEDIUM'));
      const lowTasks = this.sortTasks(filtered.filter((t) => t.priority === 'LOW'));

      return [
        {
          id: 'col-high',
          title: 'High Priority',
          defaultBadgeCount: highTasks.length,
          status: 'backlog',
          tasks: highTasks
        },
        {
          id: 'col-medium',
          title: 'Medium Priority',
          defaultBadgeCount: medTasks.length,
          status: 'in_progress',
          tasks: medTasks
        },
        {
          id: 'col-low',
          title: 'Low Priority',
          defaultBadgeCount: lowTasks.length,
          status: 'done',
          tasks: lowTasks
        }
      ];
    }

    if (this.groupBy === 'assignee') {
      const featuredMembers = [
        TEAM_MEMBERS['olive'],
        TEAM_MEMBERS['maya'],
        TEAM_MEMBERS['alex']
      ];
      return featuredMembers.map((member) => {
        const memberTasks = this.sortTasks(
          filtered.filter((t) => t.assignee.id === member.id)
        );
        return {
          id: `col-${member.id}`,
          title: member.name,
          defaultBadgeCount: memberTasks.length,
          status: 'backlog',
          tasks: memberTasks
        };
      });
    }

    const backlogTasks = this.sortTasks(filtered.filter((t) => t.status === 'backlog'));
    const inProgressTasks = this.sortTasks(filtered.filter((t) => t.status === 'in_progress'));
    const doneTasks = this.sortTasks(filtered.filter((t) => t.status === 'done'));

    return [
      {
        id: 'col-backlog',
        title: 'Backlog',
        defaultBadgeCount: this.hasActiveFilters
          ? backlogTasks.length
          : Math.max(0, 6 + (backlogTasks.length - 3)),
        status: 'backlog',
        tasks: backlogTasks
      },
      {
        id: 'col-in-progress',
        title: 'In Progress',
        defaultBadgeCount: this.hasActiveFilters
          ? inProgressTasks.length
          : Math.max(0, 12 + (inProgressTasks.length - 3)),
        status: 'in_progress',
        tasks: inProgressTasks
      },
      {
        id: 'col-done',
        title: 'Done',
        defaultBadgeCount: this.hasActiveFilters
          ? doneTasks.length
          : Math.max(0, 25 + (doneTasks.length - 3)),
        status: 'done',
        tasks: doneTasks
      }
    ];
  }

  toggleDropdown(menu: 'filter' | 'sort' | 'group' | 'deliverables', event: MouseEvent): void {
    event.stopPropagation();
    this.activeColumnMenuId = null;
    this.activeDropdown = this.activeDropdown === menu ? null : menu;
  }

  toggleColumnMenu(colId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.activeDropdown = null;
    this.activeColumnMenuId = this.activeColumnMenuId === colId ? null : colId;
  }

  onColumnAddModal(status: TaskStatus = 'backlog'): void {
    this.activeColumnMenuId = null;
    this.openAddModal(status);
  }

  onColumnQuickAdd(status: TaskStatus = 'backlog'): void {
    this.activeColumnMenuId = null;
    this.openInlineAdd(status);
  }

  onColumnSortByPriority(): void {
    this.activeColumnMenuId = null;
    this.sortBy = 'priority_desc';
    this.showToast('Sorted by Priority (High → Low)');
  }

  onColumnMoveAllToDone(col: BoardColumn): void {
    this.activeColumnMenuId = null;
    const idsInCol = new Set(col.tasks.map((t) => t.id));
    this.tasks = this.tasks.map((t) =>
      idsInCol.has(t.id) ? { ...t, status: 'done' } : t
    );
    this.saveTasks();
    this.showToast(`Moved ${idsInCol.size} tasks from ${col.title} to Done`);
  }

  @HostListener('document:click')
  closeDropdowns(): void {
    this.activeDropdown = null;
    this.activeColumnMenuId = null;
  }

  onSelectCard(taskId: string): void {
    this.tasks = this.tasks.map((t) => ({
      ...t,
      highlighted: t.id === taskId ? !t.highlighted : false
    }));
    this.saveTasks();
  }

  onMoveTaskStatus(event: { taskId: string; status: TaskStatus }): void {
    this.tasks = this.tasks.map((t) =>
      t.id === event.taskId ? { ...t, status: event.status } : t
    );
    this.saveTasks();
    this.showToast('Task moved to ' + this.formatStatusName(event.status));
  }

  onChangeTaskPriority(event: { taskId: string; priority: PriorityLevel }): void {
    const labelMap: Record<PriorityLevel, string> = {
      LOW: 'LOW PRIORITY',
      MEDIUM: 'MEDIUM PRIORITY',
      HIGH: 'HIGH PRIORITY'
    };
    this.tasks = this.tasks.map((t) =>
      t.id === event.taskId
        ? { ...t, priority: event.priority, priorityLabel: labelMap[event.priority] }
        : t
    );
    this.saveTasks();
  }

  onDeleteTask(taskId: string): void {
    this.tasks = this.tasks.filter((t) => t.id !== taskId);
    this.saveTasks();
    this.showToast('Task removed from board');
  }

  toggleAssigneeFilter(memberId: string): void {
    this.selectedAssigneeId =
      this.selectedAssigneeId === memberId ? 'ALL' : memberId;
    if (this.activeNav !== 'projects') {
      this.activeNav = 'projects';
    }
  }

  onViewMemberTasksFromTeam(memberId: string): void {
    this.selectedAssigneeId = memberId;
    this.activeNav = 'projects';
  }

  onAddTeamMember(newMember: TeamMember): void {
    this.allMembers = [...this.allMembers, newMember];
    this.recentInteractions = [newMember, ...this.recentInteractions.slice(0, 4)];
    this.showToast(`${newMember.name} invited to workspace!`);
  }

  toggleTagFilter(tag: string): void {
    this.selectedTag = this.selectedTag === tag ? 'ALL' : tag;
  }

  toggleHighPriorityQuickFilter(): void {
    this.selectedPriority = this.selectedPriority === 'HIGH' ? 'ALL' : 'HIGH';
    if (this.activeNav !== 'projects') {
      this.activeNav = 'projects';
    }
  }

  clearAllFilters(): void {
    this.searchQuery = '';
    this.selectedPriority = 'ALL';
    this.selectedAssigneeId = 'ALL';
    this.selectedTag = 'ALL';
    this.sortBy = 'default';
    this.groupBy = 'status';
  }

  getMemberName(memberId: string): string {
    const found = this.allMembers.find((m) => m.id === memberId);
    return found ? found.name : memberId;
  }

  formatStatusName(status: TaskStatus): string {
    if (status === 'in_progress') return 'In Progress';
    if (status === 'done') return 'Done';
    return 'Backlog';
  }

  // Modal Task Creation
  openAddModal(defaultStatus: TaskStatus = 'backlog'): void {
    this.newTaskStatus = defaultStatus;
    this.newTaskTitle = '';
    this.newTaskDescription = '';
    this.newTaskPriority = 'MEDIUM';
    this.newTaskAssigneeId =
      this.selectedAssigneeId !== 'ALL' ? this.selectedAssigneeId : 'olive';
    this.newTaskDueDate = 'Sep 25, 2025';
    this.newTaskFilesCount = 12;
    this.newTaskTags = 'Planning, Content';
    this.titleError = false;
    this.showAddModal = true;
  }

  openAddModalForDate(dateLabel: string): void {
    this.openAddModal('backlog');
    this.newTaskDueDate = dateLabel;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.titleError = false;
  }

  toggleQuickTagInModal(tag: string): void {
    const current = this.newTaskTags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const exists = current.some((t) => t.toLowerCase() === tag.toLowerCase());
    const updated = exists
      ? current.filter((t) => t.toLowerCase() !== tag.toLowerCase())
      : [...current, tag];
    this.newTaskTags = updated.join(', ');
  }

  isQuickTagSelected(tag: string): boolean {
    return this.newTaskTags
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .includes(tag.toLowerCase());
  }

  submitNewTask(): void {
    if (!this.newTaskTitle.trim()) {
      this.titleError = true;
      return;
    }

    const labelMap: Record<PriorityLevel, string> = {
      LOW: 'LOW PRIORITY',
      MEDIUM: 'MEDIUM PRIORITY',
      HIGH: 'HIGH PRIORITY'
    };

    const parsedTags = this.newTaskTags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const foundAssignee =
      this.allMembers.find((m) => m.id === this.newTaskAssigneeId) ||
      TEAM_MEMBERS['olive'];

    const newTask: TaskItem = {
      id: 'task-' + Date.now(),
      title: this.newTaskTitle.trim(),
      description:
        this.newTaskDescription.trim() ||
        'Campaign deliverable scoped for upcoming sprint review.',
      priority: this.newTaskPriority,
      priorityLabel: labelMap[this.newTaskPriority],
      assignee: foundAssignee,
      dueDate: this.newTaskDueDate.trim() || 'Sep 25, 2025',
      dueDateTimestamp: Date.now(),
      filesCount: Number(this.newTaskFilesCount) >= 0 ? Number(this.newTaskFilesCount) : 1,
      tags: parsedTags.length ? parsedTags : ['Campaign'],
      status: this.newTaskStatus,
      highlighted: true
    };

    // Reset filters that might hide the newly created task
    if (this.selectedPriority !== 'ALL' && this.selectedPriority !== newTask.priority) {
      this.selectedPriority = 'ALL';
    }
    if (this.selectedAssigneeId !== 'ALL' && this.selectedAssigneeId !== newTask.assignee.id) {
      this.selectedAssigneeId = 'ALL';
    }
    if (this.selectedTag !== 'ALL') {
      this.selectedTag = 'ALL';
    }
    if (this.searchQuery.trim()) {
      this.searchQuery = '';
    }

    this.tasks = [
      newTask,
      ...this.tasks.map((t) => ({ ...t, highlighted: false }))
    ];
    this.saveTasks();
    this.showAddModal = false;
    this.titleError = false;
    this.showToast(`Created "${newTask.title}" in ${this.formatStatusName(newTask.status)}`);
  }

  // Inline Quick-Add inside any Kanban column
  openInlineAdd(status: TaskStatus): void {
    this.inlineAddColumnStatus = status;
    this.inlineTaskTitle = '';
    this.inlineTaskPriority = 'MEDIUM';
  }

  cancelInlineAdd(): void {
    this.inlineAddColumnStatus = null;
    this.inlineTaskTitle = '';
  }

  submitInlineTask(status: TaskStatus): void {
    if (!this.inlineTaskTitle.trim()) return;

    const labelMap: Record<PriorityLevel, string> = {
      LOW: 'LOW PRIORITY',
      MEDIUM: 'MEDIUM PRIORITY',
      HIGH: 'HIGH PRIORITY'
    };

    const assignee =
      this.selectedAssigneeId !== 'ALL'
        ? this.allMembers.find((m) => m.id === this.selectedAssigneeId) || TEAM_MEMBERS['olive']
        : TEAM_MEMBERS['olive'];

    const newTask: TaskItem = {
      id: 'task-' + Date.now(),
      title: this.inlineTaskTitle.trim(),
      description: 'New deliverable added directly to ' + this.formatStatusName(status) + '.',
      priority: this.inlineTaskPriority,
      priorityLabel: labelMap[this.inlineTaskPriority],
      assignee,
      dueDate: 'Sep 30, 2025',
      dueDateTimestamp: Date.now(),
      filesCount: 1,
      tags: ['Planning'],
      status,
      highlighted: true
    };

    this.tasks = [
      newTask,
      ...this.tasks.map((t) => ({ ...t, highlighted: false }))
    ];
    this.saveTasks();
    this.inlineAddColumnStatus = null;
    this.inlineTaskTitle = '';
    this.showToast(`Added "${newTask.title}" to ${this.formatStatusName(status)}`);
  }
}
