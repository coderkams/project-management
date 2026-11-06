import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NavSection,
  ProjectSummary,
  TaskItem,
  TeamMember
} from '../../models/task.model';
import { PROJECT_SUMMARIES } from '../../data/mock-data';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="screen-container">
      <!-- Sub-header Breadcrumbs & Period Selector -->
      <div class="sub-row">
        <div class="breadcrumbs">
          <span class="crumb">Workspace</span>
          <span class="sep">/</span>
          <span class="crumb active">Dashboard Overview</span>
        </div>

        <div class="period-pills">
          <button
            type="button"
            class="period-btn"
            [class.active]="selectedPeriod === 'week'"
            (click)="selectedPeriod = 'week'"
          >
            This Week
          </button>
          <button
            type="button"
            class="period-btn"
            [class.active]="selectedPeriod === 'month'"
            (click)="selectedPeriod = 'month'"
          >
            This Month
          </button>
          <button
            type="button"
            class="period-btn"
            [class.active]="selectedPeriod === 'quarter'"
            (click)="selectedPeriod = 'quarter'"
          >
            Q4 2025
          </button>
        </div>
      </div>

      <!-- Hero Title Row -->
      <div class="title-row">
        <div class="title-identity">
          <div class="icon-badge">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7.5" height="7.5" rx="2" stroke="currentColor" stroke-width="1.7" />
              <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" stroke="currentColor" stroke-width="1.7" />
              <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" stroke="currentColor" stroke-width="1.7" />
              <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" stroke="currentColor" stroke-width="1.7" />
            </svg>
          </div>
          <div>
            <div class="title-flex">
              <h1>Executive Dashboard</h1>
              <span class="live-pill">LIVE METRICS</span>
            </div>
            <p class="subtitle">Google LLC Workspace &bull; {{ tasks.length }} active board deliverables tracked</p>
          </div>
        </div>

        <button type="button" class="pink-cta-btn" (click)="openNewTask.emit()">
          <span>+</span> Add new task
        </button>
      </div>

      <!-- 4 KPI Cards Row -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-tag tag-purple">TOTAL DELIVERABLES</span>
            <span class="kpi-trend up">+14.2%</span>
          </div>
          <div class="kpi-value">{{ 34 + tasks.length }}</div>
          <div class="kpi-sub">{{ backlogCount }} in backlog queue</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-tag tag-amber">IN PROGRESS</span>
            <span class="kpi-trend up">+4 this week</span>
          </div>
          <div class="kpi-value">{{ 9 + inProgressCount }}</div>
          <div class="kpi-sub">{{ highPriorityCount }} high-priority items</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-tag tag-green">COMPLETED TASKS</span>
            <span class="kpi-trend up">96% on-time</span>
          </div>
          <div class="kpi-value">{{ 22 + doneCount }}</div>
          <div class="kpi-sub">{{ totalFilesCount }} campaign files attached</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-top">
            <span class="kpi-tag tag-pink">SPRINT VELOCITY</span>
            <span class="kpi-trend up">Target: 85%</span>
          </div>
          <div class="kpi-value">88%</div>
          <div class="mini-progress-track">
            <div class="mini-progress-fill" style="width: 88%"></div>
          </div>
        </div>
      </div>

      <!-- Main Two-Column Content -->
      <div class="dashboard-main-grid">
        <!-- Left Column: Active Projects + Weekly Output -->
        <div class="dash-col-left">
          <div class="panel-card">
            <div class="panel-header">
              <div>
                <h2>Active Workspace Projects</h2>
                <p>Click any campaign to inspect its Kanban deliverables</p>
              </div>
              <button
                type="button"
                class="ghost-link-btn"
                (click)="navigate.emit('projects')"
              >
                Open Kanban Board &rarr;
              </button>
            </div>

            <div class="projects-list">
              <div
                class="project-row-card"
                *ngFor="let proj of filteredProjects"
                (click)="navigate.emit('projects')"
              >
                <div class="proj-main">
                  <div class="proj-title-wrap">
                    <span
                      class="proj-dot"
                      [style.background]="proj.accentColor"
                    ></span>
                    <div>
                      <div class="proj-name-line">
                        <strong>{{ proj.name }}</strong>
                        <span
                          class="vis-badge"
                          [class.public]="proj.visibility === 'PUBLIC'"
                        >
                          {{ proj.visibility }}
                        </span>
                      </div>
                      <span class="proj-cat">{{ proj.category }} &bull; Due {{ proj.dueDate }}</span>
                    </div>
                  </div>

                  <div class="proj-lead">
                    <img [src]="proj.lead.avatar" [alt]="proj.lead.name" />
                    <span>{{ proj.lead.name }}</span>
                  </div>
                </div>

                <div class="proj-progress-col">
                  <div class="proj-pct-row">
                    <span>PROGRESS: {{ proj.progress }}%</span>
                    <span>{{ proj.completedTasks }}/{{ proj.totalTasks }} tasks</span>
                  </div>
                  <div class="proj-bar-track">
                    <div
                      class="proj-bar-fill"
                      [style.width.%]="proj.progress"
                      [style.background]="proj.accentColor"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Weekly Sprint Activity Bar Chart -->
          <div class="panel-card">
            <div class="panel-header">
              <div>
                <h2>Weekly Deliverable Throughput</h2>
                <p>Completed vs. scoped tasks across the current sprint</p>
              </div>
              <div class="chart-legend">
                <span><i class="leg-dot purple"></i> Completed</span>
                <span><i class="leg-dot pink"></i> Newly Scoped</span>
              </div>
            </div>

            <div class="bar-chart-wrap">
              <div class="bar-col" *ngFor="let item of weeklyData">
                <div class="bars-pair">
                  <div
                    class="bar-item completed"
                    [style.height.%]="item.completed"
                    [title]="item.completed + ' completed'"
                  ></div>
                  <div
                    class="bar-item scoped"
                    [style.height.%]="item.scoped"
                    [title]="item.scoped + ' scoped'"
                  ></div>
                </div>
                <span class="bar-day">{{ item.day }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Priority Focus Tasks & Team Capacity -->
        <div class="dash-col-right">
          <div class="panel-card">
            <div class="panel-header">
              <div>
                <h2>Priority Focus Queue</h2>
                <p>Tasks requiring immediate review</p>
              </div>
              <span class="count-pill">{{ priorityTasks.length }}</span>
            </div>

            <div class="focus-tasks-list">
              <div
                class="focus-task-item"
                *ngFor="let t of priorityTasks"
                (click)="navigate.emit('projects')"
              >
                <div class="focus-task-top">
                  <span
                    class="prio-chip"
                    [class.high]="t.priority === 'HIGH'"
                    [class.med]="t.priority === 'MEDIUM'"
                    [class.low]="t.priority === 'LOW'"
                  >
                    {{ t.priorityLabel }}
                  </span>
                  <span class="focus-date">{{ t.dueDate }}</span>
                </div>
                <div class="focus-title">{{ t.title }}</div>
                <div class="focus-bottom">
                  <div class="focus-user">
                    <img [src]="t.assignee.avatar" [alt]="t.assignee.name" />
                    <span>{{ t.assignee.name }}</span>
                  </div>
                  <button
                    type="button"
                    class="quick-done-btn"
                    *ngIf="t.status !== 'done'"
                    (click)="onQuickComplete($event, t.id)"
                  >
                    Mark Done
                  </button>
                  <span class="done-tag" *ngIf="t.status === 'done'">Completed</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Workload Snapshot -->
          <div class="panel-card">
            <div class="panel-header">
              <div>
                <h2>Team Bandwidth</h2>
                <p>Active allocation by lead</p>
              </div>
              <button
                type="button"
                class="ghost-link-btn"
                (click)="navigate.emit('team')"
              >
                View Team &rarr;
              </button>
            </div>

            <div class="capacity-list">
              <div class="cap-row" *ngFor="let m of members.slice(0, 4)">
                <img [src]="m.avatar" [alt]="m.name" class="cap-avatar" />
                <div class="cap-info">
                  <div class="cap-name-line">
                    <strong>{{ m.name }}</strong>
                    <span>{{ m.capacity || 85 }}%</span>
                  </div>
                  <div class="cap-track">
                    <div
                      class="cap-fill"
                      [style.width.%]="m.capacity || 85"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

    .period-pills {
      display: flex;
      background: #ffffff;
      padding: 4px;
      border-radius: 12px;
      border: 1px solid #e7eaf3;
      gap: 4px;
    }

    .period-btn {
      border: none;
      background: transparent;
      padding: 6px 13px;
      border-radius: 9px;
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      color: #697082;
      cursor: pointer;
      transition: all 0.15s;
    }

    .period-btn.active {
      background: #5641f5;
      color: #ffffff;
      box-shadow: 0 4px 10px rgba(86, 65, 245, 0.25);
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

    .live-pill {
      padding: 3.5px 9px;
      border-radius: 7px;
      background: #fdf0f6;
      border: 1px solid #f7cbe0;
      color: #f03a8b;
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

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }

    .kpi-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 18px 20px;
      border: 1px solid #eceff6;
      box-shadow: 0 4px 16px rgba(20, 28, 58, 0.03);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .kpi-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .kpi-tag {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 0.05em;
      padding: 3px 8px;
      border-radius: 6px;
    }

    .tag-purple { background: #f0eeff; color: #5641f5; }
    .tag-amber { background: #fff7e6; color: #e09b22; }
    .tag-green { background: #e8fbf3; color: #1ca87a; }
    .tag-pink { background: #fdf0f6; color: #f03a8b; }

    .kpi-trend {
      font-size: 11px;
      font-weight: 700;
      color: #20b486;
    }

    .kpi-value {
      font-size: 28px;
      font-weight: 800;
      color: #181c2b;
      letter-spacing: -0.02em;
    }

    .kpi-sub {
      font-size: 12px;
      color: #7d8597;
      font-weight: 500;
    }

    .mini-progress-track {
      height: 10px;
      background: #eaecf4;
      border-radius: 999px;
      padding: 2px;
      margin-top: 4px;
    }

    .mini-progress-fill {
      height: 100%;
      border-radius: 999px;
      background: repeating-linear-gradient(
        -45deg,
        #f93295,
        #f93295 5px,
        #ff4da6 5px,
        #ff4da6 10px
      );
    }

    .dashboard-main-grid {
      display: grid;
      grid-template-columns: 1.55fr 1fr;
      gap: 18px;
    }

    .dash-col-left,
    .dash-col-right {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .panel-card {
      background: #ffffff;
      border-radius: 22px;
      padding: 20px 22px;
      border: 1px solid #eceff6;
      box-shadow: 0 4px 18px rgba(20, 28, 58, 0.03);
    }

    .panel-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 16px;
      gap: 12px;
    }

    .panel-header h2 {
      margin: 0;
      font-size: 16.5px;
      font-weight: 800;
      color: #1b202e;
    }

    .panel-header p {
      margin: 3px 0 0 0;
      font-size: 12px;
      color: #828a9c;
    }

    .ghost-link-btn {
      background: #f4f6fb;
      border: none;
      padding: 7px 12px;
      border-radius: 9px;
      font-family: inherit;
      font-size: 12px;
      font-weight: 700;
      color: #5641f5;
      cursor: pointer;
    }

    .ghost-link-btn:hover {
      background: #eae8ff;
    }

    .projects-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .project-row-card {
      padding: 14px 16px;
      border-radius: 16px;
      background: #f8f9fc;
      border: 1px solid #eceff6;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      cursor: pointer;
      transition: transform 0.15s, border-color 0.15s;
    }

    .project-row-card:hover {
      transform: translateY(-1px);
      border-color: #d0d5e6;
      background: #ffffff;
    }

    .proj-main {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 1;
      gap: 12px;
    }

    .proj-title-wrap {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .proj-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .proj-name-line {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #1c202e;
    }

    .vis-badge {
      font-size: 9px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 5px;
      background: #eceff6;
      color: #646c7e;
    }

    .vis-badge.public {
      background: #fdf0f6;
      color: #f03a8b;
    }

    .proj-cat {
      font-size: 11.5px;
      color: #828a9c;
    }

    .proj-lead {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 12px;
      font-weight: 600;
      color: #4b5262;
    }

    .proj-lead img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }

    .proj-progress-col {
      width: 170px;
      flex-shrink: 0;
    }

    .proj-pct-row {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      font-weight: 700;
      color: #7d8597;
      margin-bottom: 5px;
    }

    .proj-bar-track {
      height: 8px;
      background: #e6e9f2;
      border-radius: 999px;
      overflow: hidden;
    }

    .proj-bar-fill {
      height: 100%;
      border-radius: 999px;
    }

    /* Bar Chart */
    .chart-legend {
      display: flex;
      gap: 12px;
      font-size: 11.5px;
      font-weight: 600;
      color: #697082;
    }

    .leg-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 4px;
    }

    .leg-dot.purple { background: #5641f5; }
    .leg-dot.pink { background: #f93295; }

    .bar-chart-wrap {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 12px;
      height: 165px;
      align-items: end;
      padding-top: 16px;
    }

    .bar-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      justify-content: flex-end;
      gap: 8px;
    }

    .bars-pair {
      display: flex;
      align-items: flex-end;
      gap: 5px;
      height: 130px;
      width: 100%;
      justify-content: center;
    }

    .bar-item {
      width: 14px;
      border-radius: 6px 6px 3px 3px;
      transition: height 0.3s ease;
    }

    .bar-item.completed {
      background: linear-gradient(180deg, #5d46f8 0%, #4c35e4 100%);
    }

    .bar-item.scoped {
      background: linear-gradient(180deg, #ff389c 0%, #f02486 100%);
      opacity: 0.85;
    }

    .bar-day {
      font-size: 11.5px;
      font-weight: 700;
      color: #7d8597;
    }

    /* Focus Tasks */
    .count-pill {
      background: #eceef5;
      color: #5641f5;
      font-size: 12px;
      font-weight: 800;
      padding: 3px 9px;
      border-radius: 8px;
    }

    .focus-tasks-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .focus-task-item {
      padding: 12px 14px;
      border-radius: 15px;
      background: #f8f9fc;
      border: 1px solid #eceff6;
      cursor: pointer;
      transition: border-color 0.15s;
    }

    .focus-task-item:hover {
      border-color: #c44d99;
      background: #ffffff;
    }

    .focus-task-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .prio-chip {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.05em;
    }

    .prio-chip.high { color: #f05454; }
    .prio-chip.med { color: #ebb035; }
    .prio-chip.low { color: #20b486; }

    .focus-date {
      font-size: 11px;
      color: #828a9c;
      font-weight: 500;
    }

    .focus-title {
      font-size: 13.5px;
      font-weight: 700;
      color: #1c202e;
      margin-bottom: 10px;
    }

    .focus-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .focus-user {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: #4b5262;
    }

    .focus-user img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }

    .quick-done-btn {
      border: none;
      background: #edeaff;
      color: #5641f5;
      font-family: inherit;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 7px;
      cursor: pointer;
    }

    .quick-done-btn:hover {
      background: #5641f5;
      color: #ffffff;
    }

    .done-tag {
      font-size: 11px;
      font-weight: 700;
      color: #20b486;
    }

    /* Capacity List */
    .capacity-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .cap-row {
      display: flex;
      align-items: center;
      gap: 11px;
    }

    .cap-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .cap-info {
      flex: 1;
    }

    .cap-name-line {
      display: flex;
      justify-content: space-between;
      font-size: 12.5px;
      color: #1c202e;
      margin-bottom: 5px;
    }

    .cap-name-line span {
      font-weight: 700;
      color: #697082;
    }

    .cap-track {
      height: 7px;
      background: #eaecf4;
      border-radius: 999px;
      overflow: hidden;
    }

    .cap-fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, #5641f5, #f93295);
    }

    @media (max-width: 1100px) {
      .kpi-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .dashboard-main-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .kpi-grid {
        grid-template-columns: 1fr;
      }
      .title-flex h1 {
        font-size: 21px;
      }
      .icon-badge {
        width: 42px;
        height: 42px;
      }
      .panel-card {
        padding: 16px;
      }
      .panel-header {
        flex-direction: column;
        align-items: flex-start;
      }
      .project-row-card {
        flex-direction: column;
        align-items: stretch;
      }
      .proj-main {
        flex-direction: column;
        align-items: flex-start;
      }
      .proj-progress-col {
        width: 100%;
      }
      .bar-chart-wrap {
        gap: 6px;
      }
      .bar-item {
        width: 10px;
      }
    }
  `]
})
export class DashboardViewComponent {
  @Input() tasks: TaskItem[] = [];
  @Input() members: TeamMember[] = [];
  @Input() searchQuery = '';
  @Output() navigate = new EventEmitter<NavSection>();
  @Output() openNewTask = new EventEmitter<void>();
  @Output() markTaskDone = new EventEmitter<string>();

  selectedPeriod: 'week' | 'month' | 'quarter' = 'month';
  projects: ProjectSummary[] = PROJECT_SUMMARIES;

  weeklyData = [
    { day: 'Mon', completed: 62, scoped: 45 },
    { day: 'Tue', completed: 78, scoped: 54 },
    { day: 'Wed', completed: 55, scoped: 70 },
    { day: 'Thu', completed: 92, scoped: 64 },
    { day: 'Fri', completed: 84, scoped: 50 },
    { day: 'Sat', completed: 40, scoped: 28 },
    { day: 'Sun', completed: 34, scoped: 22 }
  ];

  get filteredProjects(): ProjectSummary[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.projects;
    return this.projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.lead.name.toLowerCase().includes(q)
    );
  }

  get backlogCount(): number {
    return this.tasks.filter((t) => t.status === 'backlog').length;
  }

  get inProgressCount(): number {
    return this.tasks.filter((t) => t.status === 'in_progress').length;
  }

  get doneCount(): number {
    return this.tasks.filter((t) => t.status === 'done').length;
  }

  get highPriorityCount(): number {
    return this.tasks.filter((t) => t.priority === 'HIGH').length;
  }

  get totalFilesCount(): number {
    return this.tasks.reduce((sum, t) => sum + t.filesCount, 0);
  }

  get priorityTasks(): TaskItem[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.tasks
      .filter((t) => !q || t.title.toLowerCase().includes(q) || t.assignee.name.toLowerCase().includes(q))
      .slice(0, 5);
  }

  onQuickComplete(event: MouseEvent, taskId: string): void {
    event.stopPropagation();
    this.markTaskDone.emit(taskId);
  }
}

