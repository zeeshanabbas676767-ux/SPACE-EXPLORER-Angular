import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminNavbarComponent } from '../../admin/components/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from '../../admin/components/admin-sidebar/admin-sidebar.component';
import { AdminFooterComponent } from '../../admin/components/admin-footer/admin-footer.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, AdminNavbarComponent, AdminSidebarComponent, AdminFooterComponent],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {} 
 