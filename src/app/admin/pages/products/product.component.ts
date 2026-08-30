import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService } from '../../../shared/services/shop.service';
import { Shop } from '../../../shared/models/shop.model';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../shared/models/category.model';
import { CategoryService } from '../../../shared/services/category.service';
import { CreateProduct } from '../../../shared/models/create-products.model';
 
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html', 
})
export class AdminProductListComponent implements OnInit {
selectedFile : File | null = null;
   products: Shop[] = [];
   categories: Category[]= [];
  loading = false;
  error: string | null = null;
  // Form state
  showCreateForm = false;
  editingId: number | null = null;
  // Form model
 formData : CreateProduct ={
  name: '',
  price: 0,
  categoryId: 0, 
  // imageUrl: '',
  description: '',
  stock: 0
};

 currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  constructor(private productService: ShopService, private categoryService: CategoryService) {}

  ngOnInit(): void {
// 1. Load categories first (as you do now)
  this.categoryService.getAll().subscribe({
    next: (data) => this.categories = data,
  });

  // 2. Use loadPage to fetch the first 10 items
  this.loadPage(1);

}

    onFileSelected(event: any): void {
  this.selectedFile = event.target.files[0];
}


  loadProducts(): void {
    this.loading = true;
    this.error = null;
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
      },
    })
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err: any) => {
        const errorMessage = err?.error?.message || err?.message || 'Failed to load products. Please check if the API is running.';
        this.error = `Error loading products: ${errorMessage}`;
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
    this.formData.price <= 0 ||
    !this.formData.categoryId ||
    !this.formData.description
  ) {
    this.error = 'Please fill all required fields';
    return;
  }

  const formData = new FormData();
  formData.append('name', this.formData.name);
  formData.append('price', this.formData.price.toString());
  formData.append('categoryId', this.formData.categoryId.toString());
  formData.append('description', this.formData.description);
  formData.append('stock', this.formData.stock.toString());

  if (this.selectedFile) {
    formData.append('ImageUrl', this.selectedFile);
  }

  this.productService.create(formData).subscribe({
    next: (product) => {
      this.products.push(product);
      this.resetForm();
      this.showCreateForm = false;
    },
    error: () => {
      this.error = 'Image upload failed';
    }
  });
}



    // UPDATE
  startEdit(product: Shop): void {
    this.editingId = product.id || null;
  this.formData = {
    name: product.name,
    price: product.price,
    categoryId: product.categoryId,
    description: product.description || '',
    stock: product.stock
  };
    this.showCreateForm = false;
  }

updateProduct(): void {
  if (!this.editingId) return;

  const formData = new FormData();
  formData.append('name', this.formData.name);
  formData.append('price', this.formData.price.toString());
  formData.append('categoryId', this.formData.categoryId.toString());
  formData.append('description', this.formData.description);
  formData.append('stock', this.formData.stock.toString());

  if (this.selectedFile) {
    formData.append('ImageUrl', this.selectedFile);
  }

  this.productService.update(this.editingId, formData).subscribe({
    next: () => {
      this.resetForm();
    }
  });
}

  deleteProduct(id: number): void {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    this.productService.delete(id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== id);
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
    price: 0,
  //  id: 0,
    categoryId: 0,
    stock: 0,
    description: '',
    //categoryName: ''
    };
    this.editingId = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }

// product.component.ts
loadPage(page: number) {
  this.loading = true;
  
  // Pass empty strings for the parameters you don't need, 
  // so that 'page' lands in the correct argument slot
  this.productService.getAll('', '', undefined, undefined, page, this.pageSize).subscribe({
    next: (res: any) => {
      // If your API returns a direct array, use res; 
      // If your API returns { data: [], totalRecords: 0 }, use res.data
      this.products = res.data || res; 
      this.totalItems = res.totalRecords || res.length; 
      this.currentPage = page;
      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
    }
  });
}

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.loadPage(this.currentPage - 1);
    }
  }

}
