import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpaceRoles } from '../../../shared/models/spaceRoles.model';
import { SpaceRolesService } from '../../../shared/services/spaceRoles.service';
import { UniverseDataService } from '../../../shared/services/universeData.service';
import { UniverseData } from '../../../shared/models/universeData.models';
import { Users } from '../../../shared/models/users.model';
import { AuthService } from '../../../shared/services/auth.service';
import { find } from 'rxjs';
import { Role } from '../../../shared/models/role.model';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  templateUrl: './admin-navbar.component.html',
  imports: [RouterLink, CommonModule, FormsModule]
})
export class AdminNavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('offcanvasTop') offcanvasElement!: ElementRef;

  spaceRoles: SpaceRoles[] = [];
  selectedRole: SpaceRoles | null = null;
  itemList: UniverseData[] = [];
  
  isFormOpen: boolean = false;
  isEditing: boolean = false;
  currentItem: any = { id: 0, name: '' };

  private offcanvasListener: any;

  isSubmitting: boolean = false;
  isLoggedIn = false;
  
  role: Role | null = null;
  user: Users | null = null;

  constructor(
    private roleService: SpaceRolesService,
    private universeDataService: UniverseDataService,
    private auth: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadRoles();
     this.auth.user$.subscribe(user => {
      this.user = user;
    });
  }

    get isCustomerLoggedIn(): boolean {
    
    return this.user?.roleId === 4;
  }

  get isAdminLoggedIn(): boolean {
    return this.user?.roleId === 3;
  }

  logout() {
  this.auth.logout();
  this.router.navigate(['/admin/login']);
}

  ngAfterViewInit(): void {
    if (this.offcanvasElement && this.offcanvasElement.nativeElement) {
      this.offcanvasListener = () => this.loadRoles();
      this.offcanvasElement.nativeElement.addEventListener('show.bs.offcanvas', this.offcanvasListener);
    }
  }

  ngOnDestroy(): void {
    if (this.offcanvasElement && this.offcanvasElement.nativeElement && this.offcanvasListener) {
      this.offcanvasElement.nativeElement.removeEventListener('show.bs.offcanvas', this.offcanvasListener);
    }
  }

  loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: (data) => {
        this.spaceRoles = data;
        
        if (this.spaceRoles.length > 0) {
          const currentSelectedId = this.selectedRole?.id;
          const match = this.spaceRoles.find(r => r.id === currentSelectedId);
          this.selectRole(match || this.spaceRoles[0]);
        } else {
          this.selectedRole = null;
          this.itemList = [];
        }
      },
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  selectRole(role: SpaceRoles): void {
    this.selectedRole = role;
    this.isFormOpen = false; // Always default to table view when switching roles
    this.fetchItemsForRole();
  }

  fetchItemsForRole(): void {
    if (!this.selectedRole) return;

    this.universeDataService.getAll(1, 100).subscribe({
      next: (res: any) => {
        const allData: UniverseData[] = res.data || res;
        // Strictly filter items matching the active category ID
        this.itemList = allData.filter(item => Number(item.spaceRoleId) === Number(this.selectedRole?.id));
      },
      error: (err) => console.error('Error fetching role objects:', err)
    });
  }

  openCreateForm(): void {
    this.currentItem = { id: 0, name: '' };
    this.isEditing = false;
    this.isFormOpen = true;
  }

  editItem(item: UniverseData): void {
    this.currentItem = { ...item };
    this.isEditing = true;
    this.isFormOpen = true;
  }

  cancelForm(): void {
    this.isFormOpen = false;
  }

saveItem(): void {
  // Prevent duplicate execution if already submitting
  if (this.isSubmitting) return;
  if (!this.currentItem.name?.trim() || !this.selectedRole) return;

  this.isSubmitting = true;

  const formData = new FormData();
  if (this.isEditing) {
    formData.append('Id', this.currentItem.id.toString());
  }
  formData.append('Name', this.currentItem.name.trim());
  formData.append('SpaceRoleId', this.selectedRole.id.toString());
  formData.append('Description', this.currentItem.description ?? 'N/A');
  formData.append('DistanceFromEarth', (this.currentItem.distanceFromEarth ?? 0).toString());
  formData.append('Radius', (this.currentItem.radius ?? 0).toString());
  formData.append('Mass', (this.currentItem.mass ?? 0).toString());
  formData.append('IsVisibleToNakedEye', String(this.currentItem.isVisibleToNakedEye ?? false));

  if (this.isEditing) {
    this.universeDataService.update(this.currentItem.id, formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.isFormOpen = false;
        this.fetchItemsForRole();
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error updating item:', err);
      }
    });
  } else {
    this.universeDataService.create(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.isFormOpen = false;
        this.currentItem = { id: 0, name: '' }; // Reset form state
        this.fetchItemsForRole();
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error creating item:', err);
      }
    });
  }
}

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this object?')) {
      this.universeDataService.delete(id).subscribe({
        next: () => this.fetchItemsForRole(),
        error: (err) => console.error('Error deleting item:', err)
      });
    }
  }
}