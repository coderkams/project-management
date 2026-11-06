import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="screen-container">
      <!-- Top Breadcrumbs & Tab Switcher -->
      <div class="sub-row">
        <div class="breadcrumbs">
          <span class="crumb">Workspace</span>
          <span class="sep">/</span>
          <span class="crumb active">Settings &amp; Preferences</span>
        </div>

        <div class="tab-pills">
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'general'"
            (click)="activeTab = 'general'"
          >
            General
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'notifications'"
            (click)="activeTab = 'notifications'"
          >
            Notifications
          </button>
          <button
            type="button"
            class="tab-btn"
            [class.active]="activeTab === 'security'"
            (click)="activeTab = 'security'"
          >
            Security &amp; SSO
          </button>
        </div>
      </div>

      <!-- Title Row -->
      <div class="title-row">
        <div class="title-identity">
          <div class="icon-badge">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="1.7" />
              <path
                d="M12 3.5V5.5M12 18.5V20.5M3.5 12H5.5M18.5 12H20.5M6 6L7.4 7.4M16.6 16.6L18 18M18 6L16.6 7.4M7.4 16.6L6 18"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
              />
            </svg>
          </div>
          <div>
            <div class="title-flex">
              <h1>Workspace Configuration</h1>
              <span class="public-badge">ADMIN ACCESS</span>
            </div>
            <p class="subtitle">Manage Google LLC workspace branding, board defaults, and notification rules</p>
          </div>
        </div>

        <button type="button" class="pink-cta-btn" (click)="saveSettings()">
          <span>&#10003;</span> {{ savedToast ? 'Settings Saved!' : 'Save Changes' }}
        </button>
      </div>

      <!-- Settings Content Grid -->
      <div class="settings-grid">
        <!-- Left Main Column -->
        <div class="settings-main">
          <!-- General Tab -->
          <div class="settings-card" *ngIf="activeTab === 'general'">
            <div class="sc-header">
              <h2>Organization Profile</h2>
              <p>Primary identity shown in the sidebar and public project boards</p>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Workspace Name</label>
                <input type="text" [(ngModel)]="workspaceName" />
              </div>

              <div class="form-group">
                <label>Workspace Slug URL</label>
                <input type="text" [(ngModel)]="workspaceSlug" />
              </div>

              <div class="form-group">
                <label>Default Project Visibility</label>
                <select [(ngModel)]="defaultVisibility">
                  <option value="PUBLIC">Public (Anyone with link)</option>
                  <option value="INTERNAL">Internal (Google LLC only)</option>
                </select>
              </div>

              <div class="form-group">
                <label>Default Kanban Grouping</label>
                <select [(ngModel)]="defaultGrouping">
                  <option value="status">Status (Backlog / In Progress / Done)</option>
                  <option value="priority">Priority Tier</option>
                  <option value="assignee">Team Member</option>
                </select>
              </div>

              <div class="form-group full-span">
                <label>Workspace Description</label>
                <textarea rows="2" [(ngModel)]="workspaceDesc"></textarea>
              </div>
            </div>
          </div>

          <!-- Notifications Tab -->
          <div class="settings-card" *ngIf="activeTab === 'notifications'">
            <div class="sc-header">
              <h2>Notification &amp; Alert Rules</h2>
              <p>Choose when Scopeboard notifies your team about campaign updates</p>
            </div>

            <div class="toggle-list">
              <div class="toggle-row">
                <div>
                  <strong>High-Priority Task Escalations</strong>
                  <p>Send instant alert when a task is flagged as HIGH PRIORITY</p>
                </div>
                <button
                  type="button"
                  class="switch-btn"
                  [class.on]="notifyHighPriority"
                  (click)="notifyHighPriority = !notifyHighPriority"
                >
                  <span class="knob"></span>
                </button>
              </div>

              <div class="toggle-row">
                <div>
                  <strong>Assignee Status Changes</strong>
                  <p>Notify task owners when cards move between Backlog, In Progress, and Done</p>
                </div>
                <button
                  type="button"
                  class="switch-btn"
                  [class.on]="notifyStatusMove"
                  (click)="notifyStatusMove = !notifyStatusMove"
                >
                  <span class="knob"></span>
                </button>
              </div>

              <div class="toggle-row">
                <div>
                  <strong>Daily Morning Campaign Digest</strong>
                  <p>Email summary at 8:30 AM with due deliverables and progress percentage</p>
                </div>
                <button
                  type="button"
                  class="switch-btn"
                  [class.on]="notifyDailyDigest"
                  (click)="notifyDailyDigest = !notifyDailyDigest"
                >
                  <span class="knob"></span>
                </button>
              </div>
            </div>
          </div>

          <!-- Security Tab -->
          <div class="settings-card" *ngIf="activeTab === 'security'">
            <div class="sc-header">
              <h2>Single Sign-On &amp; Permissions</h2>
              <p>Enterprise authentication connected to Google Workspace</p>
            </div>

            <div class="toggle-list">
              <div class="toggle-row">
                <div>
                  <strong>Enforce Google Workspace SSO</strong>
                  <p>Require &#64;google.com domain authentication for all team members</p>
                </div>
                <button
                  type="button"
                  class="switch-btn"
                  [class.on]="enforceSso"
                  (click)="enforceSso = !enforceSso"
                >
                  <span class="knob"></span>
                </button>
              </div>

              <div class="toggle-row">
                <div>
                  <strong>Allow Public Board Sharing</strong>
                  <p>Permit project leads to mark campaigns as PUBLIC with external read access</p>
                </div>
                <button
                  type="button"
                  class="switch-btn"
                  [class.on]="allowPublicBoards"
                  (click)="allowPublicBoards = !allowPublicBoards"
                >
                  <span class="knob"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side Connected Integrations Card -->
        <aside class="settings-side">
          <div class="settings-card">
            <div class="sc-header">
              <h2>Connected Suite</h2>
              <p>Active workspace integrations</p>
            </div>

            <div class="integration-list">
              <div class="int-item">
                <div class="int-badge">G</div>
                <div class="int-info">
                  <strong>Google Drive &amp; Docs</strong>
                  <span>Syncing 1,381 campaign files</span>
                </div>
                <span class="connected-pill">Connected</span>
              </div>

              <div class="int-item">
                <div class="int-badge purple">C</div>
                <div class="int-info">
                  <strong>Google Calendar</strong>
                  <span>2-way milestone sync active</span>
                </div>
                <span class="connected-pill">Connected</span>
              </div>

              <div class="int-item">
                <div class="int-badge pink">F</div>
                <div class="int-info">
                  <strong>Figma Creative Cloud</strong>
                  <span>Auto-preview on design cards</span>
                </div>
                <span class="connected-pill">Connected</span>
              </div>
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

    .tab-pills {
      display: flex;
      background: #ffffff;
      padding: 4px;
      border-radius: 12px;
      border: 1px solid #e7eaf3;
      gap: 4px;
    }

    .tab-btn {
      border: none;
      background: transparent;
      padding: 6px 14px;
      border-radius: 9px;
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      color: #697082;
      cursor: pointer;
    }

    .tab-btn.active {
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
      background: #f0eeff;
      border: 1px solid #d8d2ff;
      color: #5641f5;
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

    .settings-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 18px;
      align-items: start;
    }

    .settings-card {
      background: #ffffff;
      border-radius: 24px;
      padding: 22px;
      border: 1px solid #eceff6;
      box-shadow: 0 4px 18px rgba(20, 28, 58, 0.03);
    }

    .sc-header {
      margin-bottom: 18px;
      padding-bottom: 14px;
      border-bottom: 1px solid #eff1f7;
    }

    .sc-header h2 {
      margin: 0;
      font-size: 16.5px;
      font-weight: 800;
      color: #181c2b;
    }

    .sc-header p {
      margin: 4px 0 0 0;
      font-size: 12px;
      color: #828a9c;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group.full-span {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-size: 12px;
      font-weight: 700;
      color: #4b5262;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 10px 12px;
      border-radius: 11px;
      border: 1px solid #dce1ec;
      background: #f9fafd;
      font-family: inherit;
      font-size: 13px;
      color: #1c202e;
      outline: none;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      border-color: #5641f5;
      background: #ffffff;
    }

    .toggle-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 14px;
      border-radius: 14px;
      background: #f8f9fc;
      border: 1px solid #eceff6;
    }

    .toggle-row strong {
      display: block;
      font-size: 13.5px;
      color: #181c2b;
      margin-bottom: 3px;
    }

    .toggle-row p {
      margin: 0;
      font-size: 12px;
      color: #7d8597;
    }

    .switch-btn {
      width: 44px;
      height: 24px;
      border-radius: 999px;
      border: none;
      background: #d5dae6;
      padding: 3px;
      cursor: pointer;
      position: relative;
      transition: background 0.2s;
      flex-shrink: 0;
    }

    .switch-btn.on {
      background: #5641f5;
    }

    .knob {
      display: block;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #ffffff;
      transition: transform 0.2s;
    }

    .switch-btn.on .knob {
      transform: translateX(20px);
    }

    .integration-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .int-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 15px;
      background: #f8f9fc;
      border: 1px solid #eceff6;
    }

    .int-badge {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: #ffffff;
      border: 1px solid #e2e6f0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      color: #4b5262;
      flex-shrink: 0;
    }

    .int-badge.purple {
      background: #f0eeff;
      color: #5641f5;
      border-color: #d8d2ff;
    }

    .int-badge.pink {
      background: #fdf0f6;
      color: #f03a8b;
      border-color: #f7cbe0;
    }

    .int-info {
      flex: 1;
    }

    .int-info strong {
      display: block;
      font-size: 13px;
      color: #181c2b;
    }

    .int-info span {
      font-size: 11.5px;
      color: #828a9c;
    }

    .connected-pill {
      font-size: 10.5px;
      font-weight: 800;
      color: #1ca87a;
      background: #e8fbf3;
      padding: 4px 8px;
      border-radius: 7px;
    }

    @media (max-width: 1020px) {
      .settings-grid {
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
      .settings-card {
        padding: 16px;
        border-radius: 18px;
      }
      .form-grid {
        grid-template-columns: 1fr;
      }
      .tab-pills {
        width: 100%;
        justify-content: space-between;
      }
      .tab-btn {
        flex: 1;
        text-align: center;
        padding: 6px 8px;
      }
    }
  `]
})
export class SettingsViewComponent {
  activeTab: 'general' | 'notifications' | 'security' = 'general';

  workspaceName = 'Google LLC';
  workspaceSlug = 'scopeboard.app/google-llc';
  defaultVisibility = 'PUBLIC';
  defaultGrouping = 'status';
  workspaceDesc = 'Global marketing campaigns, product launches, and creative asset tracking for Google LLC.';

  notifyHighPriority = true;
  notifyStatusMove = true;
  notifyDailyDigest = false;

  enforceSso = true;
  allowPublicBoards = true;

  savedToast = false;

  saveSettings(): void {
    this.savedToast = true;
    setTimeout(() => {
      this.savedToast = false;
    }, 2500);
  }
}

