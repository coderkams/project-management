import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskItem, TeamMember } from '../../models/task.model';

@Component({
  selector: 'app-team-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="screen-container">
      <!-- Breadcrumbs & Department Filter -->
      <div class="sub-row">
        <div class="breadcrumbs">
          <span class="crumb">Workspace</span>
          <span class="sep">/</span>
          <span class="crumb active">Team Directory</span>
        </div>

        <div class="dept-pills">
          <button
            type="button"
            class="dept-btn"
            *ngFor="let dept of departments"
            [class.active]="selectedDept === dept"
            (click)="selectedDept = dept"
          >
            {{ dept }}
          </button>
        </div>
      </div>

      <!-- Title Row -->
      <div class="title-row">
        <div class="title-identity">
          <div class="icon-badge">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="8.5" r="3.2" stroke="currentColor" stroke-width="1.7" />
              <path d="M3.5 19C3.5 15.8 6 13.8 9 13.8C12 13.8 14.5 15.8 14.5 19" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              <circle cx="16.5" cy="9.5" r="2.5" stroke="currentColor" stroke-width="1.6" />
              <path d="M16.5 14.5C19 14.5 20.8 16.1 20.8 18.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
            </svg>
          </div>
          <div>
            <div class="title-flex">
              <h1>Campaign Team &amp; Contributors</h1>
              <span class="public-badge">{{ filteredMembers.length }} MEMBERS</span>
            </div>
            <p class="subtitle">Google LLC Workspace &bull; Click any member to inspect their assigned Kanban tasks</p>
          </div>
        </div>

        <button type="button" class="pink-cta-btn" (click)="showInviteModal = true">
          <span>+</span> Invite member
        </button>
      </div>

      <!-- Team Member Cards Grid -->
      <div class="team-grid">
        <div class="member-card" *ngFor="let m of filteredMembers">
          <div class="mc-top">
            <span class="dept-tag">{{ m.department || 'Marketing' }}</span>
            <span class="online-status">
              <i class="status-dot"></i> Active {{ m.lastInteraction }}
            </span>
          </div>

          <div class="mc-profile">
            <img [src]="m.avatar" [alt]="m.name" class="mc-avatar" />
            <div>
              <h3>{{ m.name }}</h3>
              <p class="mc-role">{{ m.role }}</p>
              <p class="mc-email">{{ m.email || (m.id + '@google.com') }}</p>
            </div>
          </div>

          <div class="mc-stats-row">
            <div class="stat-box">
              <span class="stat-num">{{ getMemberTasksCount(m.id) }}</span>
              <span class="stat-lbl">Assigned</span>
            </div>
            <div class="stat-box">
              <span class="stat-num">{{ getMemberDoneCount(m.id) }}</span>
              <span class="stat-lbl">Completed</span>
            </div>
            <div class="stat-box">
              <span class="stat-num">{{ getMemberFilesCount(m.id) }}</span>
              <span class="stat-lbl">Files</span>
            </div>
          </div>

          <div class="mc-capacity">
            <div class="cap-label-row">
              <span>SPRINT BANDWIDTH</span>
              <span>{{ m.capacity || 85 }}%</span>
            </div>
            <div class="cap-bar-track">
              <div
                class="cap-bar-fill"
                [style.width.%]="m.capacity || 85"
              ></div>
            </div>
          </div>

          <div class="mc-footer">
            <button
              type="button"
              class="view-tasks-btn"
              (click)="viewMemberTasks.emit(m.id)"
            >
              View {{ getMemberTasksCount(m.id) }} Board Tasks &rarr;
            </button>
          </div>
        </div>
      </div>

      <!-- Invite Member Modal -->
      <div class="modal-backdrop" *ngIf="showInviteModal" (click)="showInviteModal = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Invite Team Member</h3>
            <button type="button" class="close-btn" (click)="showInviteModal = false">&times;</button>
          </div>
          <form class="invite-form" (ngSubmit)="submitInvite()">
            <div class="field">
              <label>Full Name</label>
              <input type="text" name="invName" [(ngModel)]="inviteName" placeholder="e.g., Elena Rostova" required />
            </div>
            <div class="field">
              <label>Role Title</label>
              <input type="text" name="invRole" [(ngModel)]="inviteRole" placeholder="e.g., Paid Media Specialist" required />
            </div>
            <div class="field">
              <label>Department</label>
              <select name="invDept" [(ngModel)]="inviteDept">
                <option value="Marketing">Marketing</option>
                <option value="Design & Creative">Design &amp; Creative</option>
                <option value="Growth & SEO">Growth &amp; SEO</option>
                <option value="Analytics">Analytics</option>
              </select>
            </div>
            <div class="field">
              <label>Work Email</label>
              <input type="email" name="invEmail" [(ngModel)]="inviteEmail" placeholder="elena.rostova@google.com" />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" (click)="showInviteModal = false">Cancel</button>
              <button type="submit" class="btn-submit">Send Invite</button>
            </div>
          </form>
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

    .dept-pills {
      display: flex;
      background: #ffffff;
      padding: 4px;
      border-radius: 12px;
      border: 1px solid #e7eaf3;
      gap: 4px;
      flex-wrap: wrap;
    }

    .dept-btn {
      border: none;
      background: transparent;
      padding: 6px 12px;
      border-radius: 9px;
      font-family: inherit;
      font-size: 12px;
      font-weight: 600;
      color: #697082;
      cursor: pointer;
    }

    .dept-btn.active {
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

    .team-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(270px, 1fr));
      gap: 18px;
    }

    .member-card {
      background: #ffffff;
      border-radius: 22px;
      padding: 20px;
      border: 1px solid #eceff6;
      box-shadow: 0 4px 18px rgba(20, 28, 58, 0.03);
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: transform 0.18s ease, border-color 0.18s ease;
    }

    .member-card:hover {
      transform: translateY(-2px);
      border-color: #c44d99;
    }

    .mc-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .dept-tag {
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 3.5px 9px;
      border-radius: 7px;
      background: #f0eeff;
      color: #5641f5;
    }

    .online-status {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 11px;
      font-weight: 600;
      color: #7d8597;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #20b486;
      display: inline-block;
    }

    .mc-profile {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .mc-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #f0f2f8;
      flex-shrink: 0;
    }

    .mc-profile h3 {
      margin: 0;
      font-size: 16.5px;
      font-weight: 800;
      color: #181c2b;
    }

    .mc-role {
      margin: 2px 0;
      font-size: 12.5px;
      font-weight: 600;
      color: #4b5262;
    }

    .mc-email {
      margin: 0;
      font-size: 11.5px;
      color: #8c94a6;
    }

    .mc-stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      background: #f8f9fc;
      padding: 10px;
      border-radius: 14px;
      border: 1px solid #eef1f7;
    }

    .stat-box {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-num {
      font-size: 16px;
      font-weight: 800;
      color: #181c2b;
    }

    .stat-lbl {
      font-size: 10.5px;
      font-weight: 600;
      color: #828a9c;
    }

    .mc-capacity {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .cap-label-row {
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: #828a9c;
    }

    .cap-bar-track {
      height: 9px;
      background: #eaecf4;
      border-radius: 999px;
      padding: 1.5px;
    }

    .cap-bar-fill {
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

    .mc-footer {
      padding-top: 4px;
    }

    .view-tasks-btn {
      width: 100%;
      padding: 10px;
      border-radius: 12px;
      border: 1px solid #e4e7f2;
      background: #f9fafd;
      color: #363c4d;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s;
    }

    .view-tasks-btn:hover {
      background: #5641f5;
      border-color: #5641f5;
      color: #ffffff;
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.38);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    .modal-card {
      width: 100%;
      max-width: 420px;
      background: #ffffff;
      border-radius: 22px;
      padding: 24px;
      box-shadow: 0 24px 48px rgba(15, 23, 42, 0.18);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 800;
    }

    .close-btn {
      background: #f3f5fa;
      border: none;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      font-size: 17px;
      cursor: pointer;
    }

    .invite-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .field label {
      font-size: 11.5px;
      font-weight: 700;
      color: #4b5262;
    }

    .field input,
    .field select {
      padding: 9px 12px;
      border-radius: 10px;
      border: 1px solid #dce1ec;
      font-family: inherit;
      font-size: 13px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 8px;
    }

    .btn-cancel {
      padding: 9px 15px;
      border-radius: 10px;
      border: 1px solid #dce1ec;
      background: #ffffff;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-submit {
      padding: 9px 18px;
      border-radius: 10px;
      border: none;
      background: #5641f5;
      color: #ffffff;
      font-weight: 700;
      cursor: pointer;
    }

    @media (max-width: 1100px) {
      .team-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 720px) {
      .team-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TeamViewComponent {
  @Input() members: TeamMember[] = [];
  @Input() tasks: TaskItem[] = [];
  @Input() searchQuery = '';
  @Output() viewMemberTasks = new EventEmitter<string>();
  @Output() addMember = new EventEmitter<TeamMember>();

  departments = ['All', 'Marketing', 'Design & Creative', 'Growth & SEO', 'Analytics'];
  selectedDept = 'All';

  showInviteModal = false;
  inviteName = '';
  inviteRole = '';
  inviteDept = 'Marketing';
  inviteEmail = '';

  get filteredMembers(): TeamMember[] {
    const q = this.searchQuery.trim().toLowerCase();
    return this.members.filter((m) => {
      if (this.selectedDept !== 'All' && (m.department || 'Marketing') !== this.selectedDept) {
        return false;
      }
      if (q) {
        return (
          m.name.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          (m.department || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }

  getMemberTasksCount(memberId: string): number {
    return this.tasks.filter((t) => t.assignee.id === memberId).length;
  }

  getMemberDoneCount(memberId: string): number {
    return this.tasks.filter((t) => t.assignee.id === memberId && t.status === 'done').length;
  }

  getMemberFilesCount(memberId: string): number {
    return this.tasks
      .filter((t) => t.assignee.id === memberId)
      .reduce((sum, t) => sum + t.filesCount, 0);
  }

  submitInvite(): void {
    if (!this.inviteName.trim()) return;
    const id = 'member-' + Date.now();
    const initials = this.inviteName
      .trim()
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
      <rect width="80" height="80" rx="40" fill="#edeaff"/>
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" fill="#5641f5" font-family="sans-serif" font-weight="700" font-size="26">${initials}</text>
    </svg>`;

    this.addMember.emit({
      id,
      name: this.inviteName.trim(),
      role: this.inviteRole.trim() || 'Campaign Contributor',
      department: this.inviteDept,
      email: this.inviteEmail.trim() || `${this.inviteName.toLowerCase().replace(/\s+/g, '.')}@google.com`,
      lastInteraction: 'Just now',
      capacity: 60,
      avatar: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
    });

    this.inviteName = '';
    this.inviteRole = '';
    this.inviteEmail = '';
    this.showInviteModal = false;
  }
}

