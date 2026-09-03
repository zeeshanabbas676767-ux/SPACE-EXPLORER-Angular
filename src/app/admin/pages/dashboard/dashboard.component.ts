import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Chart, registerables } from 'chart.js';

import { CategoryService } from '../../../shared/services/category.service';
import { OrderService } from '../../../shared/services/order.service';
import { SpaceRolesService } from '../../../shared/services/spaceRoles.service';
import { UniverseDataService } from '../../../shared/services/universeData.service';
import { exploreUniverseService } from '../../../shared/services/exploreUniverse.service';
import { AuthService } from '../../../shared/services/auth.service';

Chart.register(...registerables);

export interface SpaceRoleSummary {
  name: string;
  count: number;
}

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule]
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild('roleChart') roleChartRef!: ElementRef<HTMLCanvasElement>;

  isLoading = true;
  errorMessage = '';

  totalProducts = 0;
  totalCategories = 0;
  totalOrders = 0;
  totalSpaceRoles = 0;
  totalUniverseObjects = 0;
  totalUsers = 0;

  roleSummaries: SpaceRoleSummary[] = [];
  chartInstance: Chart | null = null;

  constructor(
    private categoryService: CategoryService,
    private orderService: OrderService,
    private spaceRolesService: SpaceRolesService,
    private universeDataService: UniverseDataService,
    private exploreUniverseService: exploreUniverseService,
    private AuthService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.isLoading = true;

    forkJoin({
      products: this.exploreUniverseService.getAll('1', '1000'),
      categories: this.categoryService.getAll(),
      orders: this.orderService.getOrders(),
      roles: this.spaceRolesService.getAll(),
      universeData: this.universeDataService.getAll(1, 1000),
      users: this.AuthService.getAll()
    }).subscribe({
      next: (res: any) => {
        const productsList: any[] = res.products?.data || res.products || [];
        this.totalProducts = productsList.length;

        const categoriesList: any[] = res.categories?.data || res.categories || [];
        this.totalCategories = categoriesList.length;

        const ordersList: any[] = res.orders?.data || res.orders || [];
        this.totalOrders = ordersList.length;

        const rolesList: any[] = res.roles?.data || res.roles || [];
        this.totalSpaceRoles = rolesList.length;

        const universeList: any[] = res.universeData?.data || res.universeData || [];
        this.totalUniverseObjects = universeList.length;

        // REAL USER COUNT: Gets actual array length from backend
        const usersList = res.users?.data || res.users || [];
        this.totalUsers = Array.isArray(usersList) ? usersList.length : 0;

        // COMPLETELY DECOUPLED FROM UNIVERSE DATA:
        // Counts how many Categories belong to each Space Role instead of reading Universe Data rows!
        this.roleSummaries = rolesList.map((role: any) => {
          const count = categoriesList.filter((c: any) => 
            c.spaceRoleId === role.id || c.roleId === role.id || c.spaceRoleName === role.name
          ).length;

          // Fallback: If your categories aren't linked to roles, give each distinct role a base count of 1
          return { name: role.name, count: count > 0 ? count : 1 };
        });

        this.isLoading = false;
        setTimeout(() => this.renderChart(), 100);
      },
      error: (err) => {
        console.error('Error loading dashboard metrics:', err);
        this.errorMessage = 'Failed to load dashboard data.';
        this.isLoading = false;
      }
    });
  }

  renderChart(): void {
    if (!this.roleChartRef) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const labels = this.roleSummaries.map(r => r.name);
    const data = this.roleSummaries.map(r => r.count);

    this.chartInstance = new Chart(this.roleChartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Space Category Breakdown',
          data: data,
          backgroundColor: [
            '#0d6efd',
            '#6f42c1',
            '#0dcaf0',
            '#ffc107',
            '#198754',
            '#fd7e14'
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { size: 13, weight: 'bold' }
            }
          }
        }
      }
    });
  }
}