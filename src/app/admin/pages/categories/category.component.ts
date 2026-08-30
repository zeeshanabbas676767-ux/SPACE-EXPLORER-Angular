import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoryService } from "../../../shared/services/category.service";
import { Category } from "../../../shared/models/category.model";
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.component.html'
})
export class AdminCategoryComponent implements OnInit {
    categories: Category[]= [];
  loading = false;
  error: string | null = null;
  // Form state
  showCreateForm = false;
  editingId: number | null = null;
  // Form model   
 formData: Category={
  categoryId: 0,
  category_Name: ''
 }

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategory();
  }

  loadCategory(): void {
    this.loading = true;
    this.error = null;

    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err: any) => {
        const errorMessage = err?.error?.message || err?.message || 'Failed to load categories. Please check if the API is running.';
        this.error = `Error loading categories: ${errorMessage}`;
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
    !this.formData.category_Name
  ) {
    this.error = 'Please fill all required fields';
    return;
  }
    this.loading = true;
    this.categoryService.create(this.formData).subscribe({
      next: (newProduct) => {
        this.categories = [...this.categories, newProduct];
        this.resetForm();
        this.showCreateForm = false;
        this.loading = false;
      },
      error: (err) => {
        console.error('Validation error:', err.error);
        this.error = 'Failed to create categories';
        this.loading = false;
      }
    });
  }
  
  
      // UPDATE
    startEdit(category: Category): void {
      this.editingId = category.categoryId || null;
      this.formData = { ...category };
      this.showCreateForm = false;
    }
  
    updateProduct(): void {
      if (!this.editingId) return;
      if (!this.formData.category_Name) {
        this.error = 'Please fill in all required fields (Name and Price > 0)';
        return;
      }
  
      this.loading = true;
      this.error = null;
  
      this.categoryService.update(this.editingId, this.formData).subscribe({
        next: (data) => {
          this.categories.findIndex(p => p.categoryId === this.editingId)
          
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
          let errorMessage = 'Failed to update categories';
          if (err?.error?.message) {
            errorMessage = err.error.message;
          } else if (err?.error?.detail) {
            errorMessage = err.error.detail;
          } else if (typeof err?.error === 'string') {
            errorMessage = err.error;
          } else if (err?.message) {
            errorMessage = err.message;
          }
          
          this.error = `Error updating categories (Status ${err?.status}): ${errorMessage}`;
          this.loading = false;
          console.error('Error updating categories:', err);
        }
      });
    }
  
     deleteCategory(id: number): void {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    this.categoryService.delete(id).subscribe({
      next: () => {
        this.categories = this.categories.filter(p => p.categoryId !== id);
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
        categoryId: 0,
      category_Name: ''
      };
      this.editingId = null;
    }
  
    cancelEdit(): void {
      this.resetForm();
    }



}
