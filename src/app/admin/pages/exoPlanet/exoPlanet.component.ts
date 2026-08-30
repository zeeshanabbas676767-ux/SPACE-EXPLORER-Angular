import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
// import { ExoPlanetService } from "../../../shared/services/ExoPlanet.service";
import { ExoPlanet } from "../../../shared/models/exoPlanet.model";
import { FormsModule } from '@angular/forms';
import { ExoPlanetService } from "../../../shared/services/exoPlanet.service";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exoPlanet.component.html'
})
export class AdminExoPlanetComponent implements OnInit {
    ExoPlanets: ExoPlanet[]= [];
  loading = false;
  error: string | null = null;
  // Form state
  showCreateForm = false;
  editingId: number | null = null;
  // Form model   
 formData: ExoPlanet={
  id: 0,
  exoPlanet_Name: '',
  spaceRoleId: 11
 }

  constructor(private ExoPlanetService: ExoPlanetService) {}

  ngOnInit(): void {
    this.loadExoPlanet();
  }

  loadExoPlanet(): void {
    this.loading = true;
    this.error = null;

    this.ExoPlanetService.getAll().subscribe({
      next: (data) => {
        this.ExoPlanets = data;
        this.loading = false;
      },
      error: (err: any) => {
        const errorMessage = err?.error?.message || err?.message || 'Failed to load ExoPlanets. Please check if the API is running.';
        this.error = `Error loading ExoPlanets: ${errorMessage}`;
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
    !this.formData.exoPlanet_Name
  ) {
    this.error = 'Please fill all required fields';
    return;
  }
    this.loading = true;
    this.ExoPlanetService.create(this.formData).subscribe({
      next: (newProduct) => {
        this.ExoPlanets = [...this.ExoPlanets, newProduct];
        this.resetForm();
        this.showCreateForm = false;
        this.loading = false;
      },
      error: (err) => {
        console.error('Validation error:', err.error);
        this.error = 'Failed to create ExoPlanets';
        this.loading = false;
      }
    });
  }
  
  
      // UPDATE
    startEdit(ExoPlanet: ExoPlanet): void {
      this.editingId = ExoPlanet.id || null;
      this.formData = { ...ExoPlanet };
      this.showCreateForm = false;
    }
  
    updateProduct(): void {
      if (!this.editingId) return;
      if (!this.formData.exoPlanet_Name) {
        this.error = 'Please fill in all required fields (Name and Price > 0)';
        return;
      }
  
      this.loading = true;
      this.error = null;
  
      this.ExoPlanetService.update(this.editingId, this.formData).subscribe({
        next: (data) => {
          this.ExoPlanets.findIndex(p => p.id === this.editingId)
          
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
          let errorMessage = 'Failed to update ExoPlanets';
          if (err?.error?.message) {
            errorMessage = err.error.message;
          } else if (err?.error?.detail) {
            errorMessage = err.error.detail;
          } else if (typeof err?.error === 'string') {
            errorMessage = err.error;
          } else if (err?.message) {
            errorMessage = err.message;
          }
          
          this.error = `Error updating ExoPlanets (Status ${err?.status}): ${errorMessage}`;
          this.loading = false;
          console.error('Error updating ExoPlanets:', err);
        }
      });
    }
  
     deleteExoPlanet(id: number): void {
    if (!confirm('Are you sure you want to delete this ExoPlanet?')) {
      return;
    }

    this.ExoPlanetService.delete(id).subscribe({
      next: () => {
        this.ExoPlanets = this.ExoPlanets.filter(p => p.id !== id);
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
      exoPlanet_Name: '',
      spaceRoleId: 11
      };
      this.editingId = null;
    }
  
    cancelEdit(): void {
      this.resetForm();
    }



}
