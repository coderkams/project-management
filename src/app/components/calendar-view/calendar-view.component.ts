import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItem } from '../../models/task.model';

interface CalendarDayCell {
  dayNumber: number;
  dateLabel: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: TaskItem[];
  milestone?: string;
}

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="screen-container">
      <!-- Top Breadcrumbs & View Switcher -->
      <div class="sub-row">
        <div class="breadcrumbs">
          <span class="crumb">Projects</span>
          <span class="sep">/</span>
          <span class="crumb active">Campaign Calendar</span>
        </div>

        <div class="month-controls">
          <button type="button" class="nav-arrow" (click)="prevMonth()">&larr;</button>
          <span class="month-label">{{ currentMonthTitle }}</span>
          <button type="button" class="nav-arrow" (click)="nextMonth()">&rarr;</button>
        </div>
      </div>

      <!-- Title Row -->
      <div class="title-row">
        <div class="title-identity">
          <div class="icon-badge">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="4.5" width="17" height="16" rx="3" stroke="currentColor" stroke-width="1.7" />
              <path d="M8 2.8V6M16 2.8V6M3.5 9.5H20.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            </svg>
          </div>
          <div>
            <div class="title-flex">
              <h1>Release &amp; Deliverable Schedule</h1>
              <span class="public-badge">SYNCED</span>
            </div>
            <p class="subtitle">Click any calendar date to inspect due tasks or schedule a new deliverable</p>
          </div>
        </div>

        <button
          type="button"
          class="pink-cta-btn"
          (click)="openNewTaskForDate.emit(selectedDateLabel)"
        >
          <span>+</span> Add on {{ selectedDateLabel }}
        </button>
      </div>

      <!-- Calendar Main Layout: 7-Column Grid + Selected Day Inspector -->
      <div class="calendar-layout">
        <!-- 7-Col Month Grid -->
        <div class="calendar-board">
          <div class="weekdays-header">
            <div class="weekday-name" *ngFor="let wd of weekdays">{{ wd }}</div>
          </div>

          <div class="days-grid">
            <div
              class="day-cell"
              *ngFor="let cell of calendarCells"
              [class.muted]="!cell.isCurrentMonth"
              [class.is-today]="cell.isToday"
              [class.is-selected]="cell.dateLabel === selectedDateLabel"
              (click)="selectDay(cell)"
            >
              <div class="day-top">
                <span class="day-num">{{ cell.dayNumber }}</span>
                <span class="task-count-dot" *ngIf="cell.tasks.length > 0">
                  {{ cell.tasks.length }} due
                </span>
              </div>

              <div class="milestone-banner" *ngIf="cell.milestone">
                &#9733; {{ cell.milestone }}
              </div>

              <div class="day-tasks">
                <div
                  class="cal-task-pill"
                  *ngFor="let t of cell.tasks.slice(0, 2)"
                  [class.low]="t.priority === 'LOW'"
                  [class.med]="t.priority === 'MEDIUM'"
                  [class.high]="t.priority === 'HIGH'"
                >
                  <span class="pill-dot"></span>
                  <span class="pill-title">{{ t.title }}</span>
                </div>
                <div class="more-tasks-chip" *ngIf="cell.tasks.length > 2">
                  +{{ cell.tasks.length - 2 }} more
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side Day Schedule Inspector -->
        <aside class="day-inspector">
          <div class="inspector-header">
            <div>
              <span class="inspector-kicker">SELECTED DATE</span>
              <h3>{{ selectedDateLabel }}</h3>
            </div>
            <span class="badge-count">{{ selectedDayTasks.length }} Tasks</span>
          </div>

          <div class="inspector-list" *ngIf="selectedDayTasks.length > 0; else noTasksTpl">
            <div class="inspector-card" *ngFor="let task of selectedDayTasks">
              <div class="ic-top">
                <span
                  class="ic-prio"
                  [class.low]="task.priority === 'LOW'"
                  [class.med]="task.priority === 'MEDIUM'"
                  [class.high]="task.priority === 'HIGH'"
                >
                  {{ task.priorityLabel }}
                </span>
                <span class="ic-status">{{ formatStatus(task.status) }}</span>
              </div>
              <h4>{{ task.title }}</h4>
              <p>{{ task.description }}</p>
              <div class="ic-footer">
                <div class="ic-assignee">
                  <img [src]="task.assignee.avatar" [alt]="task.assignee.name" />
                  <span>{{ task.assignee.name }}</span>
                </div>
                <span class="ic-files">{{ task.filesCount }} files</span>
              </div>
            </div>
          </div>

          <ng-template #noTasksTpl>
            <div class="empty-day-box">
              <p>No deliverables due on {{ selectedDateLabel }}.</p>
              <button
                type="button"
                class="schedule-btn"
                (click)="openNewTaskForDate.emit(selectedDateLabel)"
              >
                + Schedule task for {{ selectedDateLabel }}
              </button>
            </div>
          </ng-template>

          <div class="upcoming-milestones">
            <h4>Key Campaign Milestones</h4>
            <div class="ms-item">
              <span class="ms-date">Sep 19</span>
              <span>Influencer Outreach Kickoff</span>
            </div>
            <div class="ms-item">
              <span class="ms-date">Sep 25</span>
              <span>Competitor &amp; Landing Page Freeze</span>
            </div>
            <div class="ms-item">
              <span class="ms-date">Sep 28</span>
              <span>Q4 Campaign Objectives Sign-off</span>
            </div>
            <div class="ms-item">
              <span class="ms-date">Oct 05</span>
              <span>Instagram Creative Asset Launch</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .screen-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding-bottom: 28px;
    }

    .sub-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .crumb {
      background: #eaecf4;
      color: #697082;
      font-size: 12px;
      font-weight: 600;
      padding: 5px 12px;
      border-radius: 8px;
    }

    .crumb.active {
      color: #363c4d;
      font-weight: 700;
    }

    .sep {
      color: #b4bac8;
      font-size: 13px;
    }

    .month-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #ffffff;
      padding: 5px 12px;
      border-radius: 12px;
      border: 1px solid #e6e9f2;
    }

    .month-label {
      font-size: 13px;
      font-weight: 800;
      color: #1c202e;
      min-width: 125px;
      text-align: center;
    }

    .nav-arrow {
      border: none;
      background: #f3f5fa;
      width: 26px;
      height: 26px;
      border-radius: 7px;
      cursor: pointer;
      font-weight: 700;
      color: #4b5262;
    }

    .nav-arrow:hover {
      background: #5641f5;
      color: #ffffff;
    }

    .title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }

    .title-identity {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .icon-badge {
      width: 52px;
      height: 52px;
      border-radius: 15px;
      background: #ebeff7;
      border: 1px solid #e2e6f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #5641f5;
    }

    .icon-badge svg {
      width: 24px;
      height: 24px;
    }

    .title-flex {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .title-flex h1 {
      margin: 0;
      font-size: 27px;
      font-weight: 800;
      color: #181c2b;
      letter-spacing: -0.025em;
    }

    .public-badge {
      padding: 3.5px 9px;
      border-radius: 7px;
      background: #e8fbf3;
      border: 1px solid #bbf0da;
      color: #1ca87a;
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.05em;
    }

    .subtitle {
      margin: 4px 0 0 0;
      font-size: 13px;
      color: #7d8597;
      font-weight: 500;
    }

    .pink-cta-btn {
      height: 38px;
      padding: 0 18px;
      border-radius: 999px;
      border: none;
      background: linear-gradient(135deg, #ff2c96 0%, #f11f82 100%);
      color: #ffffff;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      box-shadow: 0 6px 16px rgba(244, 34, 134, 0.28);
    }

    .calendar-layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 18px;
      align-items: start;
    }

    .calendar-board {
      background: #ffffff;
      border-radius: 24px;
      padding: 18px;
      border: 1px solid #eceff6;
      box-shadow: 0 4px 20px rgba(20, 28, 58, 0.03);
    }

    .weekdays-header {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      margin-bottom: 10px;
    }

    .weekday-name {
      text-align: center;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #8c94a6;
      padding: 6px 0;
    }

    .days-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
    }

    .day-cell {
      min-height: 104px;
      background: #f9fafd;
      border: 1.5px solid #edf0f7;
      border-radius: 15px;
      padding: 9px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 5px;
      transition: all 0.15s ease;
    }

    .day-cell:hover {
      border-color: #cbd2e3;
      background: #ffffff;
    }

    .day-cell.muted {
      opacity: 0.42;
    }

    .day-cell.is-today {
      background: #f5f3ff;
      border-color: #c5bcff;
    }

    .day-cell.is-selected {
      border-color: #c44d99;
      background: #ffffff;
      box-shadow: 0 6px 18px rgba(196, 77, 153, 0.12);
    }

    .day-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .day-num {
      font-size: 12.5px;
      font-weight: 800;
      color: #212636;
    }

    .task-count-dot {
      font-size: 9.5px;
      font-weight: 700;
      background: #edeaff;
      color: #5641f5;
      padding: 1.5px 6px;
      border-radius: 999px;
    }

    .milestone-banner {
      font-size: 9.5px;
      font-weight: 700;
      background: #fdf0f6;
      color: #f03a8b;
      padding: 3px 6px;
      border-radius: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .day-tasks {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 2px;
    }

    .cal-task-pill {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 3px 6px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .cal-task-pill.low {
      background: #e9fbf4;
      color: #169c70;
    }
    .cal-task-pill.med {
      background: #fff7e6;
      color: #cc8b19;
    }
    .cal-task-pill.high {
      background: #ffecee;
      color: #dc3f3f;
    }

    .pill-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: currentColor;
      flex-shrink: 0;
    }

    .pill-title {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .more-tasks-chip {
      font-size: 9.5px;
      font-weight: 700;
      color: #7d8597;
      padding-left: 4px;
    }

    /* Day Inspector */
    .day-inspector {
      background: #ffffff;
      border-radius: 24px;
      padding: 20px;
      border: 1px solid #eceff6;
      box-shadow: 0 4px 20px rgba(20, 28, 58, 0.03);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .inspector-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 12px;
      border-bottom: 1px solid #eff1f7;
    }

    .inspector-kicker {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.07em;
      color: #949cae;
    }

    .inspector-header h3 {
      margin: 3px 0 0 0;
      font-size: 18px;
      font-weight: 800;
      color: #181c2b;
    }

    .badge-count {
      background: #f0eeff;
      color: #5641f5;
      font-size: 11.5px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 8px;
    }

    .inspector-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .inspector-card {
      padding: 14px;
      border-radius: 16px;
      background: #f8f9fc;
      border: 1px solid #eaeef6;
    }

    .ic-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .ic-prio {
      font-size: 9px;
      font-weight: 800;
    }
    .ic-prio.low { color: #20b486; }
    .ic-prio.med { color: #ebb035; }
    .ic-prio.high { color: #f05454; }

    .ic-status {
      font-size: 10px;
      font-weight: 700;
      color: #7d8597;
      background: #eaecf4;
      padding: 2px 7px;
      border-radius: 5px;
    }

    .inspector-card h4 {
      margin: 0 0 5px 0;
      font-size: 14px;
      font-weight: 700;
      color: #1c202e;
    }

    .inspector-card p {
      margin: 0 0 10px 0;
      font-size: 12px;
      color: #7d8597;
      line-height: 1.4;
    }

    .ic-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11.5px;
      color: #697082;
    }

    .ic-assignee {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 600;
    }

    .ic-assignee img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }

    .empty-day-box {
      padding: 22px 14px;
      text-align: center;
      background: #f8f9fc;
      border-radius: 16px;
      border: 1.5px dashed #dce1ec;
      color: #7d8597;
      font-size: 12.5px;
    }

    .schedule-btn {
      margin-top: 10px;
      border: none;
      background: #5641f5;
      color: #ffffff;
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      padding: 8px 14px;
      border-radius: 9px;
      cursor: pointer;
    }

    .upcoming-milestones {
      border-top: 1px solid #eff1f7;
      padding-top: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .upcoming-milestones h4 {
      margin: 0 0 4px 0;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #8c94a6;
    }

    .ms-item {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 12px;
      color: #363c4d;
      font-weight: 600;
    }

    .ms-date {
      background: #fdf0f6;
      color: #f03a8b;
      font-size: 10.5px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      flex-shrink: 0;
    }

    @media (max-width: 1100px) {
      .calendar-layout {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .title-flex h1 {
        font-size: 20px;
      }
      .icon-badge {
        width: 42px;
        height: 42px;
      }
      .calendar-board {
        padding: 10px;
        border-radius: 18px;
      }
      .days-grid {
        gap: 4px;
      }
      .day-cell {
        min-height: 64px;
        padding: 5px;
        border-radius: 10px;
      }
      .day-num {
        font-size: 11px;
      }
      .task-count-dot {
        font-size: 8px;
        padding: 1px 4px;
      }
      .milestone-banner {
        display: none;
      }
      .cal-task-pill {
        padding: 2px 4px;
        font-size: 8.5px;
      }
    }
  `]
})
export class CalendarViewComponent {
  @Input() tasks: TaskItem[] = [];
  @Output() openNewTaskForDate = new EventEmitter<string>();

  weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  currentMonth: 'sep' | 'oct' = 'sep';
  selectedDateLabel = 'Sep 25, 2025';

  get currentMonthTitle(): string {
    return this.currentMonth === 'sep' ? 'September 2025' : 'October 2025';
  }

  prevMonth(): void {
    this.currentMonth = 'sep';
    this.selectedDateLabel = 'Sep 25, 2025';
  }

  nextMonth(): void {
    this.currentMonth = 'oct';
    this.selectedDateLabel = 'Oct 5, 2025';
  }

  get calendarCells(): CalendarDayCell[] {
    const cells: CalendarDayCell[] = [];
    if (this.currentMonth === 'sep') {
      // September 2025 starts on Monday (Sep 1 is Monday!)
      for (let d = 1; d <= 30; d++) {
        const dateLabel = `Sep ${d}, 2025`;
        const dayTasks = this.tasks.filter((t) => t.dueDate === dateLabel);
        let milestone: string | undefined;
        if (d === 16) milestone = 'Email Drip Review';
        if (d === 25) milestone = 'Sprint Milestone';
        if (d === 28) milestone = 'KPI Sign-off';

        cells.push({
          dayNumber: d,
          dateLabel,
          isCurrentMonth: true,
          isToday: d === 25,
          tasks: dayTasks,
          milestone
        });
      }
      // Trailing Oct days
      for (let d = 1; d <= 5; d++) {
        const dateLabel = `Oct ${d}, 2025`;
        cells.push({
          dayNumber: d,
          dateLabel,
          isCurrentMonth: false,
          isToday: false,
          tasks: this.tasks.filter((t) => t.dueDate === dateLabel)
        });
      }
    } else {
      // Leading Sep days (Sep 29, 30)
      for (let d = 29; d <= 30; d++) {
        const dateLabel = `Sep ${d}, 2025`;
        cells.push({
          dayNumber: d,
          dateLabel,
          isCurrentMonth: false,
          isToday: false,
          tasks: this.tasks.filter((t) => t.dueDate === dateLabel)
        });
      }
      for (let d = 1; d <= 31; d++) {
        const dateLabel = `Oct ${d}, 2025`;
        let milestone: string | undefined;
        if (d === 5) milestone = 'IG Creatives Launch';
        if (d === 15) milestone = 'Campaign Go-Live';
        cells.push({
          dayNumber: d,
          dateLabel,
          isCurrentMonth: true,
          isToday: d === 5,
          tasks: this.tasks.filter((t) => t.dueDate === dateLabel),
          milestone
        });
      }
    }
    return cells;
  }

  get selectedDayTasks(): TaskItem[] {
    return this.tasks.filter((t) => t.dueDate === this.selectedDateLabel);
  }

  selectDay(cell: CalendarDayCell): void {
    this.selectedDateLabel = cell.dateLabel;
  }

  formatStatus(status: string): string {
    if (status === 'in_progress') return 'In Progress';
    if (status === 'done') return 'Done';
    return 'Backlog';
  }
}

