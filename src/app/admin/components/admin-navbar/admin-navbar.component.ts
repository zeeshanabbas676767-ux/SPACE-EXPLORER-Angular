import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Users } from '../../../shared/models/users.model';
import { AuthService } from '../../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminSidebarComponent } from "../admin-sidebar/admin-sidebar.component";
@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  templateUrl: './admin-navbar.component.html',
 imports: [RouterLink, CommonModule, FormsModule]
})
export class AdminNavbarComponent {
//   user: Users | null = null;
//     isLoggedIn = false;

//     constructor(private auth: AuthService,) { 
//       this.auth.user$.subscribe(u => this.user = u);
//     }

//     logout() {
//   this.auth.logout();
// }
}
 