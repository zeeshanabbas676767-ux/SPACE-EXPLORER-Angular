import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UniverseData } from '../../../shared/models/universeData.models';
import { UniverseDataService } from '../../../shared/services/universeData.service';
import { SpaceRolesService } from '../../../shared/services/spaceRoles.service';
import { SpaceRoles } from '../../../shared/models/spaceRoles.model';

@Component({
  selector: 'admin-UniverseData',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './universeData.component.html'
})
export class AdminUniverseDataComponent implements OnInit {

  UData: UniverseData[] = [];
  roles: SpaceRoles[] = [];
  
  // Filtered list of items for secondary dropdown
  roleObjects: UniverseData[] = [];

  // Form Model
  inputData: any = {
    name: '',
    description: '',
    distanceFromEarth: null,
    radius: null,
    mass: null,
    isVisibleToNakedEye: false
  };

  selectedFile: File | null = null;
  fileName: string = '';
  previewUrl: string | null = null;
  private objectUrl: string | null = null;

  // Selected Identifiers
  selectedSpaceRolesId: number | null = null;
  selectedObjectId: number | null = null;
  selectedRoleName: string = '';

  loading = false;
  isEditMode = false;
  editingId: number | null = null; 

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  constructor(
    private universeDataService: UniverseDataService,
    private spaceRoleService: SpaceRolesService
  ) {}

  ngOnInit(): void {
    this.loadSpaceRoles();
    this.loadPage(1);
  }

  loadSpaceRoles(): void {
    this.spaceRoleService.getAll().subscribe({
      next: (data: SpaceRoles[]) => {
        this.roles = data;
      },
      error: (err) => console.error('Error fetching roles:', err)
    });
  }

  
 // Runs when user selects a Space Role Category from Dropdown 1
onRoleChange(): void {
  this.selectedObjectId = null;
  this.inputData.name = '';

  const foundRole = this.roles.find(r => r.id === this.selectedSpaceRolesId);
  this.selectedRoleName = foundRole ? foundRole.name : '';

  if (this.selectedSpaceRolesId) {
    // Fetch objects matching selected category
    this.universeDataService.getAll(1, 100).subscribe({
      next: (res: any) => {
        const allItems: UniverseData[] = res.data || res;
        this.roleObjects = allItems.filter(item => item.spaceRoleId === this.selectedSpaceRolesId);
      },
      error: (err) => console.error('Error fetching role items:', err)
    });
  } else {
    this.roleObjects = [];
  }
}

  // Runs when user picks an existing item from Dropdown 2 or selects "Create New Item"
  onObjectChange(): void {
    if (this.selectedObjectId) {
      const selectedItem = this.roleObjects.find(o => o.id === this.selectedObjectId);
      if (selectedItem) {
        this.inputData.name = selectedItem.name;
      }
    } else {
      this.inputData.name = '';
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;

      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
      }

      this.objectUrl = URL.createObjectURL(file);
      this.previewUrl = this.objectUrl;
    }
  }

  saveUniverseData(): void {
    if (this.isEditMode) {
      this.updateUniverseData();
    } else {
      this.createUniverseData();
    }
  }

  createUniverseData(): void {
    if (!this.selectedSpaceRolesId || !this.inputData.name) {
      alert('Please select a space role and enter an object name.');
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('Name', this.inputData.name.trim());
    formData.append('SpaceRoleId', this.selectedSpaceRolesId.toString());
    formData.append('Description', this.inputData.description ?? '');
    formData.append('DistanceFromEarth', (this.inputData.distanceFromEarth ?? 0).toString());
    formData.append('Radius', (this.inputData.radius ?? 0).toString());
    formData.append('Mass', (this.inputData.mass ?? 0).toString());
    formData.append('IsVisibleToNakedEye', String(this.inputData.isVisibleToNakedEye));

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.universeDataService.create(formData).subscribe({
      next: () => {
        this.loadPage(this.currentPage);
        this.resetForm();
        this.loading = false;
      },
      error: (err) => {
        console.error('Validation errors:', err);
        this.loading = false;
      }
    });
  }

  updateUniverseData(): void {
    if (!this.editingId) return;

    this.loading = true;
    const formData = new FormData();
    formData.append('Id', this.editingId.toString());
    formData.append('Name', this.inputData.name.trim());
    formData.append('SpaceRoleId', this.selectedSpaceRolesId!.toString());
    formData.append('Description', this.inputData.description ?? '');
    formData.append('DistanceFromEarth', (this.inputData.distanceFromEarth ?? 0).toString());
    formData.append('Radius', (this.inputData.radius ?? 0).toString());
    formData.append('Mass', (this.inputData.mass ?? 0).toString());
    formData.append('IsVisibleToNakedEye', String(this.inputData.isVisibleToNakedEye));

    if (this.selectedFile) {
      formData.append('ImageFile', this.selectedFile);
    }

    this.universeDataService.update(this.editingId, formData).subscribe({
      next: () => {
        this.loadPage(this.currentPage);
        this.resetForm();
        this.loading = false;
      },
      error: (err) => {
        console.error('Update error:', err);
        this.loading = false;
      }
    });
  }

  editUniverseData(data: UniverseData): void {
    this.isEditMode = true;
    this.editingId = data.id;

    this.selectedSpaceRolesId = data.spaceRoleId!;
    this.onRoleChange();

    this.selectedObjectId = data.id;
    this.inputData = {
      name: data.name,
      description: data.description,
      distanceFromEarth: data.distanceFromEarth,
      radius: data.radius,
      mass: data.mass,
      isVisibleToNakedEye: data.isVisibleToNakedEye
    };

    this.previewUrl = data.imageUrl;
  }

  removeUData(id: number): void {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.universeDataService.delete(id).subscribe({
        next: () => this.loadPage(this.currentPage),
        error: (err) => console.error('Error removing record:', err)
      });
    }
  }

 loadPage(page: number): void {
    this.universeDataService.getAll(page, this.pageSize).subscribe({
      next: (res: any) => {
        const allData: UniverseData[] = res.data || res;

        // Filter out quick-created navbar items (where description is 'N/A' or distance/radius are 0)
        this.UData = allData.filter(item => 
          item.description && 
          item.description !== 'N/A' && 
          (item.distanceFromEarth > 0 || item.radius > 0 || item.mass > 0)
        );

        this.totalItems = res.total || this.UData.length;
        this.currentPage = page;

        if (this.selectedSpaceRolesId) {
          this.onRoleChange();
        }
      },
      error: (err) => console.error('Failed to load page:', err)
    });
  }
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

  resetForm(): void {
    this.isEditMode = false;
    this.editingId = null;
    this.inputData = {
      name: '',
      description: '',
      distanceFromEarth: null,
      radius: null,
      mass: null,
      isVisibleToNakedEye: false
    };
    this.selectedSpaceRolesId = null;
    this.selectedObjectId = null;
    this.selectedRoleName = '';
    this.selectedFile = null;
    this.fileName = '';
    this.previewUrl = null;
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}