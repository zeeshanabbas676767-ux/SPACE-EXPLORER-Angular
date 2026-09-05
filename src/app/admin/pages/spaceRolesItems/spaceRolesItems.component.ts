import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpaceRolesItems } from '../../../shared/models/SpaceRoleItems.model';
import { SpaceRoles } from '../../../shared/models/spaceRoles.model';
import { SpaceRolesItemsService } from '../../../shared/services/spaceRolesItems.service';
import { SpaceRolesService } from '../../../shared/services/spaceRoles.service';
import { CreateSpaceRolesItems } from '../../../shared/models/create-spaceRoleItems.model';
 
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './spaceRolesItems.component.html', 
})
export class AdminSpaceRolesItemsComponent implements OnInit {
   items: SpaceRolesItems[] = [];
   spaceRoles: SpaceRoles[]= [];
  loading = false;
  error: string | null = null;
  // Form state
  showCreateForm = false;
  editingId: number | null = null;
  // Form model
 formData : CreateSpaceRolesItems ={
  name: '',
  spaceRolesId: 0
};

  constructor(private itemservice: SpaceRolesItemsService, private rolesService: SpaceRolesService) {}

  ngOnInit(): void {
// 1. Load spaceRoles first (as you do now)
  this.rolesService.getAll().subscribe({
    next: (data) => this.spaceRoles = data,
  });

  // 2. Use loadPage to fetch the first 10 items
  this.loadPage();

}


  loaditems(): void {
    this.loading = true;
    this.error = null;
    this.rolesService.getAll().subscribe({
      next: (data) => {
        this.spaceRoles = data;
      },
    })
    this.itemservice.getAll().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (err: any) => {
        const errorMessage = err?.error?.message || err?.message || 'Failed to load items. Please check if the API is running.';
        this.error = `Error loading items: ${errorMessage}`;
        this.loading = false;
        console.error('Error calling API:', err);
      }
    });
  }

    // CREATE
  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetForm();
    }
  }

createProduct(): void {

  if (
    !this.formData.name ||
    !this.formData.spaceRolesId
  ) {
    this.error = 'Please fill required fields';
    return;
  }

  const formData = new FormData();
  formData.append('name', this.formData.name);
  formData.append('spaceRolesId', this.formData.spaceRolesId.toString());

  this.itemservice.create(formData).subscribe({
    next: (product) => {
      this.items.push(product);
      this.resetForm();
      this.showCreateForm = false;
    },
    error: () => {
      this.error = 'Image upload failed';
    }
  });
}



    // UPDATE
  startEdit(product: SpaceRolesItems): void {
    this.editingId = product.id || null;
  this.formData = {
    name: product.name || '',
    spaceRolesId: product.spaceRoleId || 0
  };
    this.showCreateForm = false;
  }

updateProduct(): void {
  if (!this.editingId) return;

  const formData = new FormData();
  formData.append('name', this.formData.name);
  formData.append('spaceRolesId', this.formData.spaceRolesId.toString());

  this.itemservice.update(this.editingId, formData).subscribe({
    next: () => {
      this.resetForm();
    }
  });
}

  deleteProduct(id: number): void {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    this.itemservice.delete(id).subscribe({
      next: () => {
        this.items = this.items.filter(p => p.id !== id);
      },
      error: (err) => {
        console.error(err);
        alert('Delete failed');
      }
    });
  }

    // HELPERS
  resetForm(): void {
    this.formData = {
    name: '',
    spaceRolesId: 0
    };
    this.editingId = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }

// product.component.ts
loadPage() {
  this.loading = true;
  
  // Pass empty strings for the parameters you don't need, 
  // so that 'page' lands in the correct argument slot
  this.itemservice.getAll().subscribe({
    next: (res: any) => {
      // If your API returns a direct array, use res; 
      // If your API returns { data: [], totalRecords: 0 }, use res.data
      this.items = res.data || res; 
      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}


}
