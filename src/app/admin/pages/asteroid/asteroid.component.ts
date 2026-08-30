import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { AsteroidService } from "../../../shared/services/Asteroid.service";
import { Asteroid } from "../../../shared/models/asteroid.model";
import { FormsModule } from '@angular/forms';
import { AsteroidService } from "../../../shared/services/asteriod.service";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asteroid.component.html'
})
export class AdminAsteroidComponent implements OnInit {
    Asteroids: Asteroid[]= [];
  loading = false;
  error: string | null = null;
  // Form state
  showCreateForm = false;
  editingId: number | null = null;
  // Form model   
 formData: Asteroid={
  id: 0,
  asteroid_Name: '',
  spaceRoleId: 10
  
 }

  constructor(private AsteroidService: AsteroidService) {}

  ngOnInit(): void {
    this.loadAsteroid();
  }

  loadAsteroid(): void {
    this.loading = true;
    this.error = null;

    this.AsteroidService.getAll().subscribe({
      next: (data) => {
        this.Asteroids = data;
        this.loading = false;
      },
      error: (err: any) => {
        const errorMessage = err?.error?.message || err?.message || 'Failed to load Asteroids. Please check if the API is running.';
        this.error = `Error loading Asteroids: ${errorMessage}`;
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
    !this.formData.asteroid_Name
  ) {
    this.error = 'Please fill all required fields';
    return;
  }
    this.loading = true;
    this.AsteroidService.create(this.formData).subscribe({
      next: (newProduct) => {
        this.Asteroids = [...this.Asteroids, newProduct];
        this.resetForm();
        this.showCreateForm = false;
        this.loading = false;
      },
      error: (err) => {
        console.error('Validation error:', err.error);
        this.error = 'Failed to create Asteroids';
        this.loading = false;
      }
    });
  }
  
  
      // UPDATE
    startEdit(Asteroid: Asteroid): void {
      this.editingId = Asteroid.id || null;
      this.formData = { ...Asteroid };
      this.showCreateForm = false;
    }
  
    updateProduct(): void {
      if (!this.editingId) return;
      if (!this.formData.asteroid_Name) {
        this.error = 'Please fill in all required fields (Name and Price > 0)';
        return;
      }
  
      this.loading = true;
      this.error = null;
  
      this.AsteroidService.update(this.editingId, this.formData).subscribe({
        next: (data) => {
          this.Asteroids.findIndex(p => p.id === this.editingId)
          
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
          let errorMessage = 'Failed to update Asteroids';
          if (err?.error?.message) {
            errorMessage = err.error.message;
          } else if (err?.error?.detail) {
            errorMessage = err.error.detail;
          } else if (typeof err?.error === 'string') {
            errorMessage = err.error;
          } else if (err?.message) {
            errorMessage = err.message;
          }
          
          this.error = `Error updating Asteroids (Status ${err?.status}): ${errorMessage}`;
          this.loading = false;
          console.error('Error updating Asteroids:', err);
        }
      });
    }
  
     deleteAsteroid(id: number): void {
    if (!confirm('Are you sure you want to delete this Asteroid?')) {
      return;
    }

    this.AsteroidService.delete(id).subscribe({
      next: () => {
        this.Asteroids = this.Asteroids.filter(p => p.id !== id);
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
      asteroid_Name: '',
      spaceRoleId: 10
      };
      this.editingId = null;
    }
  
    cancelEdit(): void {
      this.resetForm();
    }



}
