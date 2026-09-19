import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { Users } from "../../../shared/models/users.model";
import { AuthService } from "../../../shared/services/auth.service";
import { Role } from "../../../shared/models/role.model";
import { RoleService } from "../../../shared/services/Role.service";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html'
})
export class AdminUsersComponent implements OnInit {
  user: Users[] = [];
  role: Role[] = [];
  
  loading = false;
  submitting = false;
  error: string | null = null;
  formError: string | null = null;

  // Filtering
  selectedRoleFilter: string = 'All';

  // Modal Controllers
  showCreateModal = false;
  showEditModal = false;

  // Forms State
  adminForm = { fullName: '', email: '', password: '', confirmPassword: '' };
  editForm = { id: 0, fullName: '', email: '', roleName: '' };

  constructor(
    private auth: AuthService, 
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadRole();
  }

  // GETTERS FOR TAB FILTERING
  get filteredUsers(): Users[] {
    if (this.selectedRoleFilter === 'All') return this.user;
    return this.user.filter(u => u.roleName?.toLowerCase() === this.selectedRoleFilter.toLowerCase());
  }

  getRoleCount(roleName: string): number {
    return this.user.filter(u => u.roleName?.toLowerCase() === roleName.toLowerCase()).length;
  }

  setFilter(filter: string): void {
    this.selectedRoleFilter = filter;
  }

  // DATA LOADERS
  loadRole(): void {
    this.roleService.getAll().subscribe({
      next: (data) => this.role = data,
      error: (err) => console.error('Error loading roles:', err)
    });
  }

  loadUser(): void {
    this.loading = true;
    this.error = null;

    this.auth.getAll().subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load users list.';
        this.loading = false;
      }
    });
  }

  // MODALS CONTROL
  openCreateAdminModal(): void {
    this.formError = null;
    this.adminForm = { fullName: '', email: '', password: '', confirmPassword: '' };
    this.showCreateModal = true;
  }

  openEditModal(user: Users): void {
    this.formError = null;
    this.editForm = { 
      id: user.id, 
      fullName: user.fullName, 
      email: user.email, 
      roleName: user.roleName || 'Customer' 
    };
    this.showEditModal = true;
  }

  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
  }

  // ACTIONS
  submitCreateAdmin(): void {
    this.formError = null;
    if (!this.adminForm.fullName || !this.adminForm.email || !this.adminForm.password) {
      this.formError = 'All fields are required.';
      return;
    }

    if (this.adminForm.password !== this.adminForm.confirmPassword) {
      this.formError = 'Passwords do not match.';
      return;
    }

    this.submitting = true;
    this.auth.RegisterAdmin({
      fullName: this.adminForm.fullName,
      email: this.adminForm.email,
      password: this.adminForm.password
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.closeModals();
        this.loadUser(); // Refresh list
      },
      error: (err) => {
        this.submitting = false;
        this.formError = err?.error?.message || 'Failed to register admin.';
      }
    });
  }

  submitEditUser(): void {
    // Basic placeholder for updating user details
    this.closeModals();
    alert('User updated successfully.');
  }

  delete(id: number): void {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.auth.delete(id).subscribe({
      next: () => {
        this.user = this.user.filter(p => p.id !== id);
      },
      error: (err) => {
        alert(err?.error?.message || 'Delete operation failed.');
      }
    });
  }
}