import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { PlanetService } from "../../../shared/services/Planet.service";
import { Planet } from "../../../shared/models/planet.model";
import { FormsModule } from '@angular/forms';
import { PlanetService } from "../../../shared/services/planet.service";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planets.component.html'
})
export class AdminPlanetComponent implements OnInit {
    planets: Planet[]= [];
  loading = false;
  error: string | null = null;
  // Form state
  showCreateForm = false;
  editingId: number | null = null;
  // Form model   
 formData: Planet={
  id: 0,
  planet_Name: '',
  spaceRoleId: 7
 }
 
  constructor(private PlanetService: PlanetService) {}

  ngOnInit(): void {
    this.loadPlanet();
  }

  loadPlanet(): void {
    this.loading = true;
    this.error = null;

    this.PlanetService.getAll().subscribe({
      next: (data) => {
        this.planets = data;
        this.loading = false;
      },
      error: (err: any) => {
        const errorMessage = err?.error?.message || err?.message || 'Failed to load planets. Please check if the API is running.';
        this.error = `Error loading planets: ${errorMessage}`;
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
    !this.formData.planet_Name
  ) {
    this.error = 'Please fill all required fields';
    return;
  }
    this.loading = true;
    this.PlanetService.create(this.formData).subscribe({
      next: (newProduct) => {
        this.planets = this.planets, newProduct;
        this.resetForm();
        this.showCreateForm = false;
        this.loading = false;
      },
      error: (err) => {
        console.error('Validation error:', err.error);
        this.error = 'Failed to create planets';
        this.loading = false; 
      }
    });
  }
  
  
      // UPDATE
    startEdit(Planet: Planet): void {
      this.editingId = Planet.id || null;
      this.formData = { ...Planet };
      this.showCreateForm = false;
    }
  
    updateProduct(): void {
      if (!this.editingId) return;
      if (!this.formData.planet_Name) {
        this.error = 'Please fill in all required fields (Name and Price > 0)';
        return;
      }
  
      this.loading = true;
      this.error = null;
  
      this.PlanetService.update(this.editingId, this.formData).subscribe({
        next: (data) => {
          this.planets.findIndex(p => p.id === this.editingId)
          
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
          let errorMessage = 'Failed to update planets';
          if (err?.error?.message) {
            errorMessage = err.error.message;
          } else if (err?.error?.detail) {
            errorMessage = err.error.detail;
          } else if (typeof err?.error === 'string') {
            errorMessage = err.error;
          } else if (err?.message) {
            errorMessage = err.message;
          }
          
          this.error = `Error updating planets (Status ${err?.status}): ${errorMessage}`;
          this.loading = false;
          console.error('Error updating planets:', err);
        }
      });
    }
  
     deletePlanet(id: number): void {
    if (!confirm('Are you sure you want to delete this Planet?')) {
      return;
    }

    this.PlanetService.delete(id).subscribe({
      next: () => {
        this.planets = this.planets.filter(p => p.id !== id);
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
      planet_Name: '',
      spaceRoleId: 7
      };
      this.editingId = null;
    }
  
    cancelEdit(): void {
      this.resetForm();
    }



}
