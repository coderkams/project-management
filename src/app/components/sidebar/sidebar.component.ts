import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavSection, TeamMember } from '../../models/task.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Mobile Drawer Backdrop -->
    <div
      class="mobile-backdrop"
      *ngIf="mobileOpen"
      (click)="closeMobile.emit()"
    ></div>

    <aside
      class="sidebar"
      [class.collapsed]="collapsed"
      [class.mobile-open]="mobileOpen"
    >
      <!-- Brand Header -->
      <div class="brand-header">
        <div class="brand-logo-group" *ngIf="!collapsed">
          <div class="logo-mark">
            <svg viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#5641f5" />
              <path
                d="M9 9.5C9 8.67 9.67 8 10.5 8H15.2C16.8 8 18 9.2 18 10.8V14.5L10.2 22.3C9.5 21.8 9 20.9 9 19.8V9.5Z"
                fill="#ffffff"
              />
              <path
                d="M23 22.5C23 23.33 22.33 24 21.5 24H16.8C15.2 24 14 22.8 14 21.2V17.5L21.8 9.7C22.5 10.2 23 11.1 23 12.2V22.5Z"
                fill="#ffffff"
                opacity="0.92"
              />
            </svg>
          </div>
          <div class="brand-text">
            <div class="brand-name">
              Scopeboard<sup class="reg-mark">&reg;</sup>
            </div>
            <div class="brand-subtitle">PROJECT MANAGEMENT</div>
          </div>
        </div>

        <button
          type="button"
          class="collapse-btn desktop-only"
          (click)="collapsed = !collapsed"
          title="Toggle sidebar"
        >
          <svg viewBox="0 0 20 20" fill="none">
            <path
              d="M9.5 6.5L6 10L9.5 13.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.5 7H15M11.5 10H15M12.5 13H15"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <button
          type="button"
          class="collapse-btn mobile-close-btn"
          (click)="closeMobile.emit()"
          title="Close menu"
        >
          &times;
        </button>
      </div>

      <!-- Primary Navigation -->
      <nav class="sidebar-nav">
        <button
          type="button"
          class="nav-item"
          [class.active]="activeNav === 'dashboard'"
          (click)="onNavigate('dashboard')"
        >
          <svg class="nav-icon" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="3" width="5.5" height="5.5" rx="1.5" stroke="currentColor" stroke-width="1.5" />
            <rect x="11.5" y="3" width="5.5" height="5.5" rx="1.5" stroke="currentColor" stroke-width="1.5" />
            <rect x="3" y="11.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" stroke-width="1.5" />
            <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" stroke-width="1.5" />
          </svg>
          <span *ngIf="!collapsed">Dashboard</span>
        </button>

        <button
          type="button"
          class="nav-item"
          [class.active]="activeNav === 'projects'"
          (click)="onNavigate('projects')"
        >
          <svg class="nav-icon" viewBox="0 0 20 20" fill="none">
            <path
              d="M2.8 6.2C2.8 5.1 3.7 4.2 4.8 4.2H7.9C8.4 4.2 8.9 4.45 9.2 4.85L10.3 6.3H15.2C16.3 6.3 17.2 7.2 17.2 8.3V14.2C17.2 15.3 16.3 16.2 15.2 16.2H4.8C3.7 16.2 2.8 15.3 2.8 14.2V6.2Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
          </svg>
          <span *ngIf="!collapsed">Projects</span>
        </button>

        <button
          type="button"
          class="nav-item"
          [class.active]="activeNav === 'calendar'"
          (click)="onNavigate('calendar')"
        >
          <svg class="nav-icon" viewBox="0 0 20 20" fill="none">
            <rect x="3" y="4.2" width="14" height="12.8" rx="2.2" stroke="currentColor" stroke-width="1.5" />
            <path d="M6.5 2.6V5.2M13.5 2.6V5.2M3 8.2H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="7" cy="11.5" r="0.8" fill="currentColor" />
            <circle cx="10" cy="11.5" r="0.8" fill="currentColor" />
            <circle cx="13" cy="11.5" r="0.8" fill="currentColor" />
          </svg>
          <span *ngIf="!collapsed">Calendar</span>
        </button>

        <button
          type="button"
          class="nav-item"
          [class.active]="activeNav === 'team'"
          (click)="onNavigate('team')"
        >
          <svg class="nav-icon" viewBox="0 0 20 20" fill="none">
            <circle cx="7.5" cy="7" r="2.6" stroke="currentColor" stroke-width="1.5" />
            <path d="M3 15.8C3 13.3 5 11.6 7.5 11.6C10 11.6 12 13.3 12 15.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="13.5" cy="7.6" r="2" stroke="currentColor" stroke-width="1.4" />
            <path d="M13.5 11.8C15.5 11.8 17 13.1 17 15.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />
          </svg>
          <span *ngIf="!collapsed">Team</span>
        </button>

        <button
          type="button"
          class="nav-item"
          [class.active]="activeNav === 'reports'"
          (click)="onNavigate('reports')"
        >
          <svg class="nav-icon" viewBox="0 0 20 20" fill="none">
            <rect x="3.2" y="3.5" width="13.6" height="10.5" rx="2" stroke="currentColor" stroke-width="1.5" />
            <path d="M7 17H13M10 14V17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <span *ngIf="!collapsed">Reports</span>
        </button>

        <button
          type="button"
          class="nav-item"
          [class.active]="activeNav === 'settings'"
          (click)="onNavigate('settings')"
        >
          <svg class="nav-icon" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="2.4" stroke="currentColor" stroke-width="1.5" />
            <path
              d="M10 3.2V4.6M10 15.4V16.8M3.2 10H4.6M15.4 10H16.8M5.2 5.2L6.2 6.2M13.8 13.8L14.8 14.8M14.8 5.2L13.8 6.2M6.2 13.8L5.2 14.8"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
          <span *ngIf="!collapsed">Settings</span>
        </button>
      </nav>

      <div class="sidebar-divider" *ngIf="!collapsed"></div>

      <!-- Recent Interactions -->
      <div class="recent-section" *ngIf="!collapsed">
        <div class="section-heading">RECENT INTERATIONS</div>

        <div class="interactions-list">
          <button
            type="button"
            class="interaction-item"
            *ngFor="let person of recentInteractions"
            [class.selected-member]="selectedAssigneeId === person.id"
            (click)="onSelectMember(person.id)"
            [title]="'Click to filter tasks by ' + person.name"
          >
            <img [src]="person.avatar" [alt]="person.name" class="member-avatar" />
            <div class="member-info">
              <div class="member-name">{{ person.name }}</div>
              <div class="member-time">{{ person.lastInteraction }}</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Bottom Workspace Card -->
      <div class="workspace-card" *ngIf="!collapsed">
        <div class="workspace-top">
          <div class="google-badge">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M20.4 12.2C20.4 11.55 20.34 10.95 20.23 10.38H12V13.9H16.73C16.52 15.02 15.88 15.98 14.92 16.62V18.88H17.75C19.43 17.34 20.4 15.02 20.4 12.2Z"
                fill="#8c93a4"
              />
              <path
                d="M12 20.75C14.36 20.75 16.35 19.97 17.79 18.63L14.96 16.44C14.18 16.97 13.18 17.29 12 17.29C9.72 17.29 7.79 15.75 7.09 13.68H4.17V15.95C5.61 18.8 8.57 20.75 12 20.75Z"
                fill="#7a8294"
              />
              <path
                d="M7.09 13.68C6.91 13.15 6.81 12.58 6.81 12C6.81 11.42 6.91 10.85 7.09 10.32V8.05H4.17C3.57 9.24 3.23 10.58 3.23 12C3.23 13.42 3.57 14.76 4.17 15.95L7.09 13.68Z"
                fill="#979eae"
              />
              <path
                d="M12 6.71C13.29 6.71 14.44 7.15 15.35 8.02L17.86 5.51C16.34 4.09 14.36 3.25 12 3.25C8.57 3.25 5.61 5.2 4.17 8.05L7.09 10.32C7.79 8.25 9.72 6.71 12 6.71Z"
                fill="#838b9c"
              />
            </svg>
          </div>
          <div class="workspace-meta">
            <div class="workspace-label">Workspace</div>
            <div class="workspace-org">Google LLC</div>
          </div>
        </div>

        <div class="workspace-actions">
          <button type="button" class="ws-action-btn" (click)="onNavigate('settings')">
            <svg viewBox="0 0 16 16" fill="none">
              <path
                d="M6.5 13.5H4.2C3.54 13.5 3 12.96 3 12.3V3.7C3 3.04 3.54 2.5 4.2 2.5H6.5M10.5 11L13.5 8L10.5 5M6.5 8H13.2"
                stroke="currentColor"
                stroke-width="1.3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>LOG OUT</span>
          </button>
          <button type="button" class="ws-action-btn" (click)="onNavigate('team')">
            <span>CONTACTS</span>
          </button>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .mobile-backdrop {
      display: none;
    }

    .sidebar {
      width: 242px;
      background: #ffffff;
      border-radius: 26px;
      padding: 24px 18px 18px 18px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 30px rgba(20, 28, 58, 0.04);
      height: 100%;
      box-sizing: border-box;
      transition: width 0.22s ease, transform 0.25s ease;
      flex-shrink: 0;
    }

    .sidebar.collapsed {
      width: 78px;
      padding: 24px 12px 18px 12px;
      align-items: center;
    }

    .brand-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 4px 24px 4px;
    }

    .brand-logo-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-mark {
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      filter: drop-shadow(0 4px 10px rgba(86, 65, 245, 0.25));
    }

    .logo-mark svg {
      width: 100%;
      height: 100%;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-family: 'Fraunces', Georgia, serif;
      font-style: italic;
      font-weight: 700;
      font-size: 19px;
      line-height: 1.05;
      color: #181c2e;
      letter-spacing: -0.02em;
    }

    .reg-mark {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-style: normal;
      font-size: 9px;
      font-weight: 600;
      color: #7c8498;
      margin-left: 2px;
      top: -0.6em;
    }

    .brand-subtitle {
      font-size: 6.8px;
      font-weight: 800;
      letter-spacing: 0.14em;
      color: #6b7385;
      margin-top: 2px;
    }

    .collapse-btn {
      background: transparent;
      border: none;
      color: #6b7280;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      transition: background 0.15s, color 0.15s;
    }

    .collapse-btn:hover {
      background: #f3f5fa;
      color: #181c2e;
    }

    .collapse-btn svg {
      width: 18px;
      height: 18px;
    }

    .mobile-close-btn {
      display: none;
      font-size: 22px;
      line-height: 1;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 11px 14px;
      border: none;
      background: transparent;
      border-radius: 13px;
      font-family: inherit;
      font-size: 13.5px;
      font-weight: 600;
      color: #545b6d;
      cursor: pointer;
      transition: all 0.18s ease;
      text-align: left;
    }

    .nav-item:hover:not(.active) {
      background: #f5f6fb;
      color: #1f2433;
    }

    .nav-item.active {
      background: linear-gradient(135deg, #5d46f8 0%, #4c35e4 100%);
      color: #ffffff;
      box-shadow: 0 8px 18px rgba(86, 65, 245, 0.28);
    }

    .nav-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .sidebar-divider {
      height: 1px;
      background: #eff1f7;
      margin: 20px 6px 18px 6px;
    }

    .recent-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0 4px;
      overflow-y: auto;
    }

    .section-heading {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #9ba2b3;
      margin-bottom: 14px;
      padding: 0 4px;
    }

    .interactions-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .interaction-item {
      display: flex;
      align-items: center;
      gap: 11px;
      width: 100%;
      padding: 5px 6px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 12px;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      transition: background 0.15s, border-color 0.15s;
    }

    .interaction-item:hover {
      background: #f6f7fb;
    }

    .interaction-item.selected-member {
      background: #f2f0ff;
      border-color: #d6ceff;
    }

    .member-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }

    .member-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .member-name {
      font-size: 13px;
      font-weight: 700;
      color: #212636;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .member-time {
      font-size: 11px;
      font-weight: 500;
      color: #959dae;
    }

    .workspace-card {
      margin-top: 18px;
      background: #f4f6fa;
      border-radius: 18px;
      overflow: hidden;
      border: 1px solid #eceff6;
      flex-shrink: 0;
    }

    .workspace-top {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
    }

    .google-badge {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
      flex-shrink: 0;
    }

    .google-badge svg {
      width: 20px;
      height: 20px;
    }

    .workspace-meta {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .workspace-label {
      font-size: 11px;
      font-weight: 500;
      color: #8c94a6;
    }

    .workspace-org {
      font-size: 13.5px;
      font-weight: 700;
      color: #1f2433;
    }

    .workspace-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-top: 1px solid #e6e9f2;
    }

    .ws-action-btn {
      background: transparent;
      border: none;
      padding: 10px 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      font-family: inherit;
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #6e7689;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }

    .ws-action-btn:first-child {
      border-right: 1px solid #e6e9f2;
    }

    .ws-action-btn:hover {
      background: #ebeef6;
      color: #1e2330;
    }

    .ws-action-btn svg {
      width: 13px;
      height: 13px;
    }

    @media (max-width: 900px) {
      .mobile-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.42);
        backdrop-filter: blur(3px);
        z-index: 190;
      }

      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 268px !important;
        max-width: 84vw;
        border-radius: 0 24px 24px 0;
        z-index: 200;
        transform: translateX(-105%);
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.25);
        overflow-y: auto;
      }

      .sidebar.mobile-open {
        transform: translateX(0);
      }

      .desktop-only {
        display: none;
      }

      .mobile-close-btn {
        display: flex;
      }
    }
  `]
})
export class SidebarComponent {
  @Input() recentInteractions: TeamMember[] = [];
  @Input() selectedAssigneeId: string = 'ALL';
  @Input() activeNav: NavSection = 'projects';
  @Input() mobileOpen = false;
  @Output() activeNavChange = new EventEmitter<NavSection>();
  @Output() selectAssignee = new EventEmitter<string>();
  @Output() closeMobile = new EventEmitter<void>();

  collapsed = false;

  onNavigate(section: NavSection): void {
    this.activeNav = section;
    this.activeNavChange.emit(section);
    this.closeMobile.emit();
  }

  onSelectMember(memberId: string): void {
    this.selectAssignee.emit(memberId);
    this.closeMobile.emit();
  }
}
