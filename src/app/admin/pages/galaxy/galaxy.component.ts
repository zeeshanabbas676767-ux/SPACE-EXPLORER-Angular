import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { GalaxyService } from "../../../shared/services/Galaxy.service";
import { Galaxy } from "../../../shared/models/galaxy.model";
import { FormsModule } from '@angular/forms';
import { GalaxyService } from "../../../shared/services/galaxy.service";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './galaxy.component.html'
})
export class AdminGalaxyComponent implements OnInit {
    Galaxy: Galaxy[]= [];
  loading = false;
  error: string | null = null;
  // Form state
  showCreateForm = false;
  editingId: number | null = null;
  // Form model   
 formData: Galaxy={
  id: 0,
  galaxy_Name: '',
  spaceRoleId: 8
 }

  constructor(private GalaxyService: GalaxyService) {}

  ngOnInit(): void {
    this.loadGalaxy();
  }

  loadGalaxy(): void {
    this.loading = true;
    this.error = null;

    this.GalaxyService.getAll().subscribe({
      next: (data) => {
        this.Galaxy = data;
        this.loading = false;
      },
      error: (err: any) => {
        const errorMessage = err?.error?.message || err?.message || 'Failed to load Galaxy. Please check if the API is running.';
        this.error = `Error loading Galaxy: ${errorMessage}`;
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
    !this.formData.galaxy_Name
  ) {
    this.error = 'Please fill all required fields';
    return;
  }
    this.loading = true;
    this.GalaxyService.create(this.formData).subscribe({
      next: (newProduct) => {
        this.Galaxy = [...this.Galaxy, newProduct];
        this.resetForm();
        this.showCreateForm = false;
        this.loading = false;
      },
      error: (err) => {
        console.error('Validation error:', err.error);
        this.error = 'Failed to create Galaxy';
        this.loading = false;
      }
    });
  }
  
  
      // UPDATE
    startEdit(Galaxy: Galaxy): void {
      this.editingId = Galaxy.id || null;
      this.formData = { ...Galaxy };
      this.showCreateForm = false;
    }
  
    updateProduct(): void {
      if (!this.editingId) return;
      if (!this.formData.galaxy_Name) {
        this.error = 'Please fill in all required fields (Name and Price > 0)';
        return;
      }
  
      this.loading = true;
      this.error = null;
  
      this.GalaxyService.update(this.editingId, this.formData).subscribe({
        next: (data) => {
          this.Galaxy.findIndex(p => p.id === this.editingId)
          
          // const index = this.products.findIndex(p => p.id === this.editingId);
          // if (index > -1) {
          //   const newProducts = [...this.products];
          //   newProducts[index] = updatedProduct;
          //   this.products = newProducts;
          // }
          this.resetForm();
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Full error object:', err);
          console.error('Error status:', err?.status);
          console.error('Error statusText:', err?.statusText);
          console.error('Error body:', err?.error);
          console.error('Error message:', err?.message);
          
          // Try to extract meaningful error message
          let errorMessage = 'Failed to update Galaxy';
          if (err?.error?.message) {
            errorMessage = err.error.message;
          } else if (err?.error?.detail) {
            errorMessage = err.error.detail;
          } else if (typeof err?.error === 'string') {
            errorMessage = err.error;
          } else if (err?.message) {
            errorMessage = err.message;
          }
          
          this.error = `Error updating Galaxy (Status ${err?.status}): ${errorMessage}`;
          this.loading = false;
          console.error('Error updating Galaxy:', err);
        }
      });
    }
  
     deleteGalaxy(id: number): void {
    if (!confirm('Are you sure you want to delete this Galaxy?')) {
      return;
    }

    this.GalaxyService.delete(id).subscribe({
      next: () => {
        this.Galaxy = this.Galaxy.filter(p => p.id !== id);
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
        id: 0,
      galaxy_Name: '',
      spaceRoleId: 8
      };
      this.editingId = null;
    }
  
    cancelEdit(): void {
      this.resetForm();
    }



}
