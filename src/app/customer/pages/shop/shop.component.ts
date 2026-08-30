import { Component, OnInit } from '@angular/core';
import { Shop } from '../../../shared/models/shop.model';
import { ShopService } from '../../../shared/services/shop.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../shared/services/cart.service';
import { RouterLink } from "@angular/router";

@Component({
   selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './shop.component.html',
})
export class ShopComponent implements OnInit {
  products: Shop[] = [];          // All products from API
  filteredProducts: Shop[] = [];  // Copy of Products shown on UI.
  categories: string[] = [];      // Category buttons
  activeCategory = 'All'; // For All Products button
  selectedSort: string = ''; 
  minPrice?: number;
maxPrice?: number;
pageNumber: number = 1;
pageSize: number = 10;
totalPages: number = 0;
totalRecords: number = 0;
  
  constructor(private shopService: ShopService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

loadProducts() {
  this.shopService.getAll(this.selectedSort, this.activeCategory,
    this.minPrice, this.maxPrice, this.pageNumber, this.pageSize)
    .subscribe(response => {
  console.log('API Response:', response);
  this.products = response.data;
  this.filteredProducts = [...this.products];
  this.totalRecords = response.totalRecords;
  this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  this.categories = [...new Set(this.products.map(p => p.categoryName))];
});
}
  // Filter products by category
  filterByCategory(category: string): void {
    this.pageNumber = 1; // Reset to first page on category change
    if (category === 'All') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(
        p => p.categoryName === category
      );
    }
     this.activeCategory = category;

    if (this.selectedSort) {
    this.applySort(this.selectedSort);
    }
     
     if (this.minPrice != null && this.maxPrice != null) {
      // option A – do client‑side again:
      this.filteredProducts = this.filteredProducts
          .filter(p => p.price >= this.minPrice! && p.price <= this.maxPrice!);
      if (this.selectedSort) this.applySort(this.selectedSort);

      // option B – or call the server if you prefer:
      // this.applyPriceFilter(this.minPrice!, this.maxPrice!);
    }
    
    // if(this.minPrice && this.maxPrice) {
    //   this.applyPriceFilter(this.minPrice, this.maxPrice);
    // }
  }
  addToCart(product: Shop): void {
  this.cartService.addToCart(product);
}

applyPriceFilter(min: number, max: number) {
  this.pageNumber = 1; // Reset to first page on category change
  // if(min <= 0) { min = 0; }

  // if (min < max){
  //   this.filteredProducts = this.products.filter(p => p.price >= min && p.price <= max);
  // }
  this.minPrice = min; 
  this.maxPrice = max;
  this.filterByCategory(this.activeCategory);
   if (this.selectedSort) {
    this.applySort(this.selectedSort);
  }
}

applySort(sortBy: string) {
  if (sortBy === 'priceAsc') {
    this.filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'priceDesc') {
    this.filteredProducts.sort((a, b) => b.price - a.price);
  }
  else if (sortBy === 'newest') {
    this.filteredProducts.sort((a, b) => b.id - a.id);
  }
  else if(sortBy === '') {
    this.filteredProducts.sort((a, b) => a.id - b.id);
  }
//   else if (sortBy === 'newest') {
//   this.filteredProducts.sort((a, b) => {
//     const dateA = new Date(a.createdAt).getTime() || 0;
//     const dateB = new Date(b.createdAt).getTime() || 0;
//     return dateB - dateA;
//   });
// }
}
onSortChange(sortValue: string) {
  this.pageNumber = 1; // Reset to first page on category change
  this.selectedSort = sortValue;
  this.applySort(sortValue);
 // this.loadProducts();
}
sortProducts(sortBy: string) {
  this.shopService.getAll(sortBy)
    .subscribe(data => {
      this.filteredProducts = data;
    });
}
resetFilters() {
  this.pageNumber = 1; // Reset to first page on category change
  this.minPrice = undefined;
  this.maxPrice = undefined; 
  this.selectedSort = '';
  this.activeCategory = 'All';
}

nextPage() {
  if (this.pageNumber < this.totalPages) {
    this.pageNumber++;
    this.loadProducts();
  }
}

previousPage() {
  if (this.pageNumber > 1) {
    this.pageNumber--;
    this.loadProducts();
  }
}

getVisiblePages(): number[] {
  const pages: number[] = [];
  for (let i = 1; i <= this.totalPages; i++) {
    pages.push(i);
  }
  return pages;
}

goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.pageNumber = page;
    this.loadProducts();
  }
}

// onSortChange(event: any) {
//   const value = event.target.value;

//   let sortBy: string | undefined;
//   let minPrice: number | undefined;
//   let maxPrice: number | undefined;

//   if (value === 'priceAsc') sortBy = 'priceAsc';
//   else if (value === 'priceDesc') sortBy = 'priceDesc';
//   else if (value === 'newest') sortBy = 'newest';
//   else if (value === 'filter100-600') { minPrice = 100; maxPrice = 600; }
//   else if (value === 'filter600-1200') { minPrice = 600; maxPrice = 1200; }

//   this.shopService.getAll(sortBy, minPrice, maxPrice)
//     .subscribe(data => {
//       this.filteredProducts = data;
//     });
// }
}   