import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriorityLevel, TaskItem, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="task-card-wrapper"
      [class.is-highlighted]="task.highlighted"
      (click)="onCardClick()"
    >
      <!-- Full seamless SVG Folder-Tab Card Background & Border -->
      <svg
        class="folder-card-svg"
        viewBox="0 0 308 214"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <!-- Priority Tab Soft Glow Gradients -->
          <radialGradient [id]="'tab-glow-' + task.id" cx="24%" cy="6%" r="48%">
            <stop
              offset="0%"
              [attr.stop-color]="
                task.priority === 'LOW'
                  ? '#20c997'
                  : task.priority === 'MEDIUM'
                  ? '#f5a623'
                  : '#f05252'
              "
              stop-opacity="0.22"
            />
            <stop
              offset="65%"
              [attr.stop-color]="
                task.priority === 'LOW'
                  ? '#20c997'
                  : task.priority === 'MEDIUM'
                  ? '#f5a623'
                  : '#f05252'
              "
              stop-opacity="0.05"
            />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- Main White Folder Path -->
        <path
          class="folder-bg-path"
          d="M 1.5,19
             A 17.5,17.5 0 0,1 19,1.5
             L 154,1.5
             C 171,1.5 175,20.5 192,20.5
             L 289,20.5
             A 17.5,17.5 0 0,1 306.5,38
             L 306.5,195
             A 17.5,17.5 0 0,1 289,212.5
             L 19,212.5
             A 17.5,17.5 0 0,1 1.5,195
             Z"
          fill="#ffffff"
        />

        <!-- Soft Tinted Glow Inside Top-Left Folder Tab -->
        <path
          d="M 1.5,19
             A 17.5,17.5 0 0,1 19,1.5
             L 154,1.5
             C 171,1.5 175,20.5 192,20.5
             L 289,20.5
             A 17.5,17.5 0 0,1 306.5,38
             L 306.5,90
             L 1.5,90
             Z"
          [attr.fill]="'url(#tab-glow-' + task.id + ')'"
        />

        <!-- Folder Border Stroke -->
        <path
          class="folder-border-path"
          d="M 1.5,19
             A 17.5,17.5 0 0,1 19,1.5
             L 154,1.5
             C 171,1.5 175,20.5 192,20.5
             L 289,20.5
             A 17.5,17.5 0 0,1 306.5,38
             L 306.5,195
             A 17.5,17.5 0 0,1 289,212.5
             L 19,212.5
             A 17.5,17.5 0 0,1 1.5,195
             Z"
          fill="none"
          vector-effect="non-scaling-stroke"
        />
      </svg>

      <!-- Top Row: Priority Folder Tab -->
      <div class="card-top-bar">
        <div
          class="priority-badge"
          [ngClass]="{
            'priority-low': task.priority === 'LOW',
            'priority-medium': task.priority === 'MEDIUM',
            'priority-high': task.priority === 'HIGH'
          }"
        >
          <!-- Priority Flag Icon -->
          <svg class="flag-icon" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 2.5V13.5M3 3H11.5L9.7 6L11.5 9H3"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>{{ task.priorityLabel }}</span>
        </div>
      </div>

      <!-- Main Card Content -->
      <div class="card-content">
        <h3 class="task-title">{{ task.title }}</h3>

        <div class="task-meta-row">
          <div
            class="assignee-chip"
            (click)="onFilterAssignee($event, task.assignee.id)"
            title="Filter by {{ task.assignee.name }}"
          >
            <img
              [src]="task.assignee.avatar"
              [alt]="task.assignee.name"
              class="assignee-avatar"
            />
            <span class="assignee-name">{{ task.assignee.name }}</span>
          </div>

          <div class="due-date">
            <svg class="meta-icon" viewBox="0 0 16 16" fill="none">
              <rect
                x="2.2"
                y="3.2"
                width="11.6"
                height="10.6"
                rx="2"
                stroke="currentColor"
                stroke-width="1.3"
              />
              <path
                d="M5.2 1.8V4M10.8 1.8V4M2.2 6.4H13.8"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linecap="round"
              />
              <circle cx="5.5" cy="9" r="0.7" fill="currentColor" />
              <circle cx="8" cy="9" r="0.7" fill="currentColor" />
              <circle cx="10.5" cy="9" r="0.7" fill="currentColor" />
            </svg>
            <span>{{ task.dueDate }}</span>
          </div>
        </div>

        <p class="task-description">{{ task.description }}</p>

        <!-- Decorative pointer cursor on highlighted card matching screenshot -->
        <div class="decorative-pointer" *ngIf="task.highlighted" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5.5 3.5L19.5 10.2L12.4 12.6L9.8 19.5L5.5 3.5Z"
              fill="#ffffff"
              stroke="#2d3142"
              stroke-width="1.6"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <div class="card-footer">
          <div class="files-count">
            <svg class="meta-icon" viewBox="0 0 16 16" fill="none">
              <path
                d="M13.2 7.5L7.6 13.1C6.1 14.6 3.7 14.6 2.2 13.1C0.7 11.6 0.7 9.2 2.2 7.7L8.2 1.7C9.2 0.7 10.8 0.7 11.8 1.7C12.8 2.7 12.8 4.3 11.8 5.3L6.1 11C5.6 11.5 4.8 11.5 4.3 11C3.8 10.5 3.8 9.7 4.3 9.2L9.5 4"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>{{ task.filesCount }} files</span>
          </div>

          <div class="tags-list">
            <svg class="meta-icon" viewBox="0 0 16 16" fill="none">
              <path
                d="M2.5 8.6V3.7C2.5 3.04 3.04 2.5 3.7 2.5H8.6C8.92 2.5 9.23 2.63 9.45 2.85L13.65 7.05C14.12 7.52 14.12 8.28 13.65 8.75L9.25 13.15C8.78 13.62 8.02 13.62 7.55 13.15L2.85 9.45C2.63 9.23 2.5 8.92 2.5 8.6Z"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linejoin="round"
              />
              <circle cx="5.6" cy="5.6" r="1" fill="currentColor" />
            </svg>
            <span class="tags-text">
              <ng-container *ngFor="let tag of task.tags; let last = last">
                <button
                  type="button"
                  class="tag-link"
                  (click)="onFilterTag($event, tag)"
                  title="Filter by {{ tag }}"
                >{{ tag }}</button><span *ngIf="!last">, </span>
              </ng-container>
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-card-wrapper {
      position: relative;
      padding: 8px 18px 16px 18px;
      cursor: pointer;
      transition: transform 0.18s ease, filter 0.18s ease;
      filter: drop-shadow(0 4px 14px rgba(24, 32, 60, 0.035));
      user-select: none;
    }

    .task-card-wrapper:hover {
      transform: translateY(-2px);
      filter: drop-shadow(0 8px 20px rgba(24, 32, 60, 0.065));
    }

    .folder-card-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    .folder-border-path {
      stroke: #eceff6;
      stroke-width: 1.25px;
      transition: stroke 0.2s ease, stroke-width 0.2s ease;
    }

    .task-card-wrapper:hover .folder-border-path {
      stroke: #dcdfe9;
    }

    .task-card-wrapper.is-highlighted .folder-border-path {
      stroke: #c44d99;
      stroke-width: 1.9px;
    }

    .card-top-bar {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 24px;
      margin-bottom: 12px;
    }

    .priority-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding-left: 2px;
    }

    .flag-icon {
      width: 12px;
      height: 12px;
    }

    .priority-low {
      color: #20b486;
    }

    .priority-medium {
      color: #ebb035;
    }

    .priority-high {
      color: #f05454;
    }

    .card-menu-container {
      position: relative;
      margin-top: -8px;
      margin-right: -4px;
    }

    .dots-btn {
      background: transparent;
      border: none;
      color: #6b7280;
      width: 26px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      cursor: pointer;
      padding: 0;
      transition: background 0.15s ease, color 0.15s ease;
    }

    .dots-btn:hover {
      background: rgba(15, 23, 42, 0.05);
      color: #1e2330;
    }

    .dots-btn svg {
      width: 16px;
      height: 16px;
    }

    .card-dropdown-menu {
      position: absolute;
      top: 22px;
      right: 0;
      width: 160px;
      background: #ffffff;
      border: 1px solid #e5e8f0;
      border-radius: 12px;
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
      padding: 6px;
      z-index: 30;
    }

    .menu-section-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      padding: 4px 8px 2px;
    }

    .menu-item {
      width: 100%;
      text-align: left;
      background: transparent;
      border: none;
      padding: 6px 8px;
      font-size: 12px;
      font-weight: 500;
      color: #334155;
      border-radius: 7px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .menu-item:hover {
      background: #f4f6fb;
      color: #0f172a;
    }

    .menu-item.active {
      background: #eef2ff;
      color: #4f46e5;
      font-weight: 600;
    }

    .menu-item.delete-item {
      color: #ef4444;
    }

    .menu-item.delete-item:hover {
      background: #fef2f2;
    }

    .menu-divider {
      height: 1px;
      background: #eef0f6;
      margin: 4px 0;
    }

    .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }
    .backlog-dot { background: #94a3b8; }
    .progress-dot { background: #f59e0b; }
    .done-dot { background: #10b981; }

    .card-content {
      position: relative;
      z-index: 1;
    }

    .task-title {
      margin: 0 0 10px 0;
      font-size: 15px;
      font-weight: 700;
      color: #1c202e;
      letter-spacing: -0.015em;
      line-height: 1.3;
    }

    .task-meta-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 11px;
    }

    .assignee-chip {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      border-radius: 20px;
      transition: opacity 0.15s;
    }

    .assignee-chip:hover .assignee-name {
      color: #5542f6;
    }

    .assignee-avatar {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }

    .assignee-name {
      font-size: 12px;
      font-weight: 600;
      color: #4b5262;
      transition: color 0.15s;
    }

    .due-date {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      font-weight: 500;
      color: #7b8395;
    }

    .meta-icon {
      width: 14px;
      height: 14px;
      color: #8c94a6;
      flex-shrink: 0;
    }

    .task-description {
      margin: 0 0 14px 0;
      font-size: 12.2px;
      line-height: 1.48;
      color: #7d8597;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 36px;
    }

    .decorative-pointer {
      position: absolute;
      right: 16px;
      bottom: 24px;
      z-index: 5;
      pointer-events: none;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12));
    }

    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 11px;
      border-top: 1px solid #f0f2f7;
      font-size: 11.8px;
      color: #7b8395;
      font-weight: 500;
    }

    .files-count {
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .tags-list {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      max-width: 65%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tags-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tag-link {
      background: none;
      border: none;
      padding: 0;
      font: inherit;
      color: inherit;
      cursor: pointer;
      transition: color 0.15s;
    }

    .tag-link:hover {
      color: #5542f6;
      text-decoration: underline;
    }
  `]
})
export class TaskCardComponent {
  @Input({ required: true }) task!: TaskItem;
  @Output() selectCard = new EventEmitter<string>();
  @Output() moveStatus = new EventEmitter<{ taskId: string; status: TaskStatus }>();
  @Output() changePriority = new EventEmitter<{ taskId: string; priority: PriorityLevel }>();
  @Output() deleteTask = new EventEmitter<string>();
  @Output() filterByAssignee = new EventEmitter<string>();
  @Output() filterByTag = new EventEmitter<string>();

  menuOpen = false;

  onCardClick(): void {
    this.menuOpen = false;
    this.selectCard.emit(this.task.id);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  onMoveStatus(status: TaskStatus): void {
    this.menuOpen = false;
    this.moveStatus.emit({ taskId: this.task.id, status });
  }

  onChangePriority(priority: PriorityLevel): void {
    this.menuOpen = false;
    this.changePriority.emit({ taskId: this.task.id, priority });
  }

  onDelete(): void {
    this.menuOpen = false;
    this.deleteTask.emit(this.task.id);
  }

  onFilterAssignee(event: MouseEvent, assigneeId: string): void {
    event.stopPropagation();
    this.filterByAssignee.emit(assigneeId);
  }

  onFilterTag(event: MouseEvent, tag: string): void {
    event.stopPropagation();
    this.filterByTag.emit(tag);
  }
}

