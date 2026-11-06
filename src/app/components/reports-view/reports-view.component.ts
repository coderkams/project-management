import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskItem, TeamMember } from '../../models/task.model';

@Component({
  selector: 'app-reports-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="screen-container">
      <!-- Top Breadcrumbs & Timeframe -->
      <div class="sub-row">
        <div class="breadcrumbs">
          <span class="crumb">Workspace</span>
          <span class="sep">/</span>
          <span class="crumb active">Analytics &amp; Reports</span>
        </div>

        <div class="period-pills">
          <button
            type="button"
            class="period-btn"
            [class.active]="timeframe === '30d'"
            (click)="timeframe = '30d'"
          >
            Last 30 Days
          </button>
          <button
            type="button"
            class="period-btn"
            [class.active]="timeframe === 'q3'"
            (click)="timeframe = 'q3'"
          >
            Q3 2025
          </button>
          <button
            type="button"
            class="period-btn"
            [class.active]="timeframe === 'q4'"
            (click)="timeframe = 'q4'"
          >
            Q4 Forecast
          </button>
        </div>
      </div>

      <!-- Title Row -->
      <div class="title-row">
        <div class="title-identity">
          <div class="icon-badge">
            <svg viewBox="0 0 24 24" fill="none">
              <rect x="3.5" y="4" width="17" height="13" rx="2.5" stroke="currentColor" stroke-width="1.7" />
              <path d="M8 20H16M12 17V20M8 13V10M12 13V7.5M16 13V9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            </svg>
          </div>
          <div>
            <div class="title-flex">
              <h1>Campaign Performance Reports</h1>
              <span class="public-badge">UPDATED TODAY</span>
            </div>
            <p class="subtitle">Deliverable velocity, priority distribution, and contributor efficiency</p>
          </div>
        </div>

        <button type="button" class="pink-cta-btn" (click)="exportCsv()">
          <span>&darr;</span> {{ exportedBanner ? 'CSV Exported!' : 'Export CSV Report' }}
        </button>
      </div>

      <!-- Top Analytics Charts Grid -->
      <div class="charts-grid">
        <!-- Left Card: Status & Priority Distribution -->
        <div class="report-card">
          <div class="rc-header">
            <div>
              <h2>Deliverable Distribution</h2>
              <p>Breakdown across workflow stages and priority tiers</p>
            </div>
          </div>

          <div class="donut-layout">
            <div class="donut-wrap">
              <svg viewBox="0 0 120 120" class="donut-svg">
                <circle cx="60" cy="60" r="44" fill="none" stroke="#eceff6" stroke-width="14" />
                <!-- Done segment -->
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  stroke="#20b486"
                  stroke-width="14"
                  stroke-dasharray="110 276"
                  stroke-dashoffset="0"
                  stroke-linecap="round"
                />
                <!-- In Progress segment -->
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  stroke="#5641f5"
                  stroke-width="14"
                  stroke-dasharray="85 276"
                  stroke-dashoffset="-118"
                  stroke-linecap="round"
                />
                <!-- Backlog segment -->
                <circle
                  cx="60"
                  cy="60"
                  r="44"
                  fill="none"
                  stroke="#f93295"
                  stroke-width="14"
                  stroke-dasharray="60 276"
                  stroke-dashoffset="-210"
                  stroke-linecap="round"
                />
              </svg>
              <div class="donut-center">
                <strong>{{ tasks.length }}</strong>
                <span>Board Tasks</span>
              </div>
            </div>

            <div class="dist-bars">
              <div class="dist-item">
                <div class="dist-top">
                  <span><i class="dot green"></i> Completed (Done)</span>
                  <strong>{{ doneCount }} tasks ({{ getPct(doneCount) }}%)</strong>
                </div>
                <div class="dist-track">
                  <div class="dist-fill green" [style.width.%]="getPct(doneCount)"></div>
                </div>
              </div>

              <div class="dist-item">
                <div class="dist-top">
                  <span><i class="dot purple"></i> In Progress</span>
                  <strong>{{ inProgressCount }} tasks ({{ getPct(inProgressCount) }}%)</strong>
                </div>
                <div class="dist-track">
                  <div class="dist-fill purple" [style.width.%]="getPct(inProgressCount)"></div>
                </div>
              </div>

              <div class="dist-item">
                <div class="dist-top">
                  <span><i class="dot pink"></i> Backlog Queue</span>
                  <strong>{{ backlogCount }} tasks ({{ getPct(backlogCount) }}%)</strong>
                </div>
                <div class="dist-track">
                  <div class="dist-fill pink" [style.width.%]="getPct(backlogCount)"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Card: Sprint Velocity Trend Curve -->
        <div class="report-card">
          <div class="rc-header">
            <div>
              <h2>Sprint Burndown &amp; Velocity</h2>
              <p>Cumulative asset delivery across September – October</p>
            </div>
            <span class="kpi-pill">+24% vs Q3</span>
          </div>

          <div class="line-chart-box">
            <svg viewBox="0 0 440 160" class="line-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#5641f5" stop-opacity="0.26" />
                  <stop offset="100%" stop-color="#5641f5" stop-opacity="0.0" />
                </linearGradient>
              </defs>
              <!-- Grid lines -->
              <line x1="0" y1="35" x2="440" y2="35" stroke="#eff1f7" stroke-width="1" />
              <line x1="0" y1="75" x2="440" y2="75" stroke="#eff1f7" stroke-width="1" />
              <line x1="0" y1="115" x2="440" y2="115" stroke="#eff1f7" stroke-width="1" />

              <!-- Area under curve -->
              <path
                d="M 10,130 C 70,120 110,95 160,88 C 210,80 250,55 310,48 C 360,42 400,22 430,18 L 430,150 L 10,150 Z"
                fill="url(#areaGrad)"
              />
              <!-- Main velocity curve -->
              <path
                d="M 10,130 C 70,120 110,95 160,88 C 210,80 250,55 310,48 C 360,42 400,22 430,18"
                fill="none"
                stroke="#5641f5"
                stroke-width="3"
                stroke-linecap="round"
              />
              <!-- Target dashed line -->
              <path
                d="M 10,135 L 430,30"
                fill="none"
                stroke="#f93295"
                stroke-width="2"
                stroke-dasharray="5 5"
              />
              <!-- Data points -->
              <circle cx="95" cy="104" r="4.5" fill="#ffffff" stroke="#5641f5" stroke-width="2.5" />
              <circle cx="215" cy="72" r="4.5" fill="#ffffff" stroke="#5641f5" stroke-width="2.5" />
              <circle cx="330" cy="44" r="4.5" fill="#ffffff" stroke="#5641f5" stroke-width="2.5" />
              <circle cx="430" cy="18" r="5" fill="#f93295" stroke="#ffffff" stroke-width="2" />
            </svg>

            <div class="x-axis-labels">
              <span>Week 1 (Sep 1)</span>
              <span>Week 2 (Sep 8)</span>
              <span>Week 3 (Sep 15)</span>
              <span>Week 4 (Sep 22)</span>
              <span>Week 5 (Oct 1)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Deliverable Breakdown Table -->
      <div class="report-card">
        <div class="rc-header">
          <div>
            <h2>Contributor Deliverable Summary</h2>
            <p>Asset production and completion metrics across team members</p>
          </div>
        </div>

        <div class="table-wrap">
          <table class="report-table">
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Department</th>
                <th>Assigned Tasks</th>
                <th>Completed</th>
                <th>Attached Files</th>
                <th>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let m of members">
                <td>
                  <div class="td-member">
                    <img [src]="m.avatar" [alt]="m.name" />
                    <div>
                      <strong>{{ m.name }}</strong>
                      <span>{{ m.role }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="dept-pill">{{ m.department || 'Marketing' }}</span>
                </td>
                <td><strong>{{ getAssigned(m.id) }}</strong> tasks</td>
                <td>{{ getDone(m.id) }} done</td>
                <td>{{ getFiles(m.id) }} files</td>
                <td>
                  <div class="rate-cell">
                    <div class="rate-track">
                      <div class="rate-fill" [style.width.%]="m.capacity || 84"></div>
                    </div>
                    <span>{{ m.capacity || 84 }}%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
    }

    .period-btn.active {
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

    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1.15fr;
      gap: 18px;
    }

    .report-card {
      background: #ffffff;
      border-radius: 24px;
      padding: 22px;
      border: 1px solid #eceff6;
      box-shadow: 0 4px 18px rgba(20, 28, 58, 0.03);
    }

    .rc-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 18px;
    }

    .rc-header h2 {
      margin: 0;
      font-size: 16.5px;
      font-weight: 800;
      color: #181c2b;
    }

    .rc-header p {
      margin: 3px 0 0 0;
      font-size: 12px;
      color: #828a9c;
    }

    .kpi-pill {
      background: #e8fbf3;
      color: #1ca87a;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 8px;
    }

    .donut-layout {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .donut-wrap {
      position: relative;
      width: 136px;
      height: 136px;
      flex-shrink: 0;
    }

    .donut-svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .donut-center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .donut-center strong {
      font-size: 24px;
      font-weight: 800;
      color: #181c2b;
    }

    .donut-center span {
      font-size: 10px;
      font-weight: 700;
      color: #828a9c;
    }

    .dist-bars {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .dist-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .dist-top {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #4b5262;
    }

    .dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 5px;
    }
    .dot.green { background: #20b486; }
    .dot.purple { background: #5641f5; }
    .dot.pink { background: #f93295; }

    .dist-track {
      height: 8px;
      background: #eaecf4;
      border-radius: 999px;
      overflow: hidden;
    }

    .dist-fill {
      height: 100%;
      border-radius: 999px;
    }
    .dist-fill.green { background: #20b486; }
    .dist-fill.purple { background: #5641f5; }
    .dist-fill.pink { background: #f93295; }

    .line-chart-box {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .line-svg {
      width: 100%;
      height: 150px;
    }

    .x-axis-labels {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 600;
      color: #8c94a6;
    }

    /* Table */
    .table-wrap {
      overflow-x: auto;
    }

    .report-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .report-table th {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #8c94a6;
      padding: 10px 12px;
      border-bottom: 1px solid #eceff6;
    }

    .report-table td {
      padding: 13px 12px;
      border-bottom: 1px solid #f2f4f9;
      font-size: 13px;
      color: #363c4d;
    }

    .td-member {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .td-member img {
      width: 34px;
      height: 34px;
      border-radius: 50%;
    }

    .td-member strong {
      display: block;
      color: #181c2b;
      font-size: 13.5px;
    }

    .td-member span {
      font-size: 11.5px;
      color: #828a9c;
    }

    .dept-pill {
      background: #f0eeff;
      color: #5641f5;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 9px;
      border-radius: 7px;
    }

    .rate-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .rate-track {
      width: 110px;
      height: 8px;
      background: #eaecf4;
      border-radius: 999px;
      overflow: hidden;
    }

    .rate-fill {
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

    .rate-cell span {
      font-size: 12px;
      font-weight: 700;
      color: #181c2b;
    }

    @media (max-width: 1080px) {
      .charts-grid {
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
      .report-card {
        padding: 16px;
        border-radius: 18px;
      }
      .donut-layout {
        flex-direction: column;
        align-items: stretch;
      }
      .donut-wrap {
        margin: 0 auto;
      }
      .x-axis-labels span {
        font-size: 9.5px;
      }
    }
  `]
})
export class ReportsViewComponent {
  @Input() tasks: TaskItem[] = [];
  @Input() members: TeamMember[] = [];

  timeframe: '30d' | 'q3' | 'q4' = '30d';
  exportedBanner = false;

  get doneCount(): number {
    return this.tasks.filter((t) => t.status === 'done').length;
  }

  get inProgressCount(): number {
    return this.tasks.filter((t) => t.status === 'in_progress').length;
  }

  get backlogCount(): number {
    return this.tasks.filter((t) => t.status === 'backlog').length;
  }

  getPct(count: number): number {
    if (!this.tasks.length) return 0;
    return Math.round((count / this.tasks.length) * 100);
  }

  getAssigned(memberId: string): number {
    return this.tasks.filter((t) => t.assignee.id === memberId).length;
  }

  getDone(memberId: string): number {
    return this.tasks.filter((t) => t.assignee.id === memberId && t.status === 'done').length;
  }

  getFiles(memberId: string): number {
    return this.tasks
      .filter((t) => t.assignee.id === memberId)
      .reduce((sum, t) => sum + t.filesCount, 0);
  }

  exportCsv(): void {
    this.exportedBanner = true;
    setTimeout(() => {
      this.exportedBanner = false;
    }, 2500);
  }
}

