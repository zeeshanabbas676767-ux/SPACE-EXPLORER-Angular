import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { MoonService } from "../../../shared/services/Moon.service";
import { Moon } from "../../../shared/models/moon.model";
import { FormsModule } from '@angular/forms';
import { MoonService } from "../../../shared/services/moon.service";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moon.component.html'
})
export class AdminMoonComponent implements OnInit {
    Moons: Moon[]= [];
  loading = false;
  error: string | null = null;
  // Form state
  showCreateForm = false;
  editingId: number | null = null;
  // Form model   
 formData: Moon={
  id: 0,
  moon_Name: '',
  spaceRoleId: 9
 }

  constructor(private MoonService: MoonService) {}

  ngOnInit(): void {
    this.loadMoon();
  }

  loadMoon(): void {
    this.loading = true;
    this.error = null;

    this.MoonService.getAll().subscribe({
      next: (data) => {
        this.Moons = data;
        this.loading = false;
      },
      error: (err: any) => {
        const errorMessage = err?.error?.message || err?.message || 'Failed to load Moons. Please check if the API is running.';
        this.error = `Error loading Moons: ${errorMessage}`;
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
    !this.formData.moon_Name
  ) {
    this.error = 'Please fill all required fields';
    return;
  }
    this.loading = true;
    this.MoonService.create(this.formData).subscribe({
      next: (newProduct) => {
        this.Moons = [...this.Moons, newProduct];
        this.resetForm();
        this.showCreateForm = false;
        this.loading = false;
      },
      error: (err) => {
        console.error('Validation error:', err.error);
        this.error = 'Failed to create Moons';
        this.loading = false;
      }
    });
  }
  
  
      // UPDATE
    startEdit(Moon: Moon): void {
      this.editingId = Moon.id || null;
      this.formData = { ...Moon };
      this.showCreateForm = false;
    }
  
    updateProduct(): void {
      if (!this.editingId) return;
      if (!this.formData.moon_Name) {
        this.error = 'Please fill in all required fields (Name and Price > 0)';
        return;
      }
  
      this.loading = true;
      this.error = null;
  
      this.MoonService.update(this.editingId, this.formData).subscribe({
        next: (data) => {
          this.Moons.findIndex(p => p.id === this.editingId)
          
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
          let errorMessage = 'Failed to update Moons';
          if (err?.error?.message) {
            errorMessage = err.error.message;
          } else if (err?.error?.detail) {
            errorMessage = err.error.detail;
          } else if (typeof err?.error === 'string') {
            errorMessage = err.error;
          } else if (err?.message) {
            errorMessage = err.message;
          }
          
          this.error = `Error updating Moons (Status ${err?.status}): ${errorMessage}`;
          this.loading = false;
          console.error('Error updating Moons:', err);
        }
      });
    }
  
     deleteMoon(id: number): void {
    if (!confirm('Are you sure you want to delete this Moon?')) {
      return;
    }

    this.MoonService.delete(id).subscribe({
      next: () => {
        this.Moons = this.Moons.filter(p => p.id !== id);
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
      moon_Name: '',
      spaceRoleId: 9
      };
      this.editingId = null;
    }
  
    cancelEdit(): void {
      this.resetForm();
    }



}
