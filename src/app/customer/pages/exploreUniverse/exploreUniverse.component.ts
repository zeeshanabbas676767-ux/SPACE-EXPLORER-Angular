import { Component, OnInit } from '@angular/core';
import { UniverseData } from '../../../shared/models/universeData.models';
import { UniverseDataService } from '../../../shared/services/universeData.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpaceRolesService } from '../../../shared/services/spaceRoles.service';

@Component({
  selector: 'app-explore-universe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exploreUniverse.component.html',
})
export class exploreUniverseComponent implements OnInit {
  products: UniverseData[] = [];
  filteredProducts: UniverseData[] = [];

  roles: string[] = [];
  activeroles = 'All';
  selectedSort: string = '';
  searchTerm: string = '';
  minPrice?: number;
  maxPrice?: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  totalRecords: number = 0;

  constructor(
    private universeDataService: UniverseDataService, 
    private spaceRoleService: SpaceRolesService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.universeDataService.getAll(1, 1000, this.selectedSort)
      .subscribe((response: any) => {
        console.log('API Response:', response);
        this.products = response.data;
        this.filteredProducts = [...this.products];
        this.totalRecords = response.total;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

        // Extract unique space role names (e.g., "Planet", "Moon", "Galaxy") for filter category buttons
        this.roles = [...new Set(this.products
          .map((p: any) => p.spaceRole?.name)
          .filter((roleName: any): roleName is string => !!roleName))];

        this.applyFilters();
      });
  }

  filterByroles(role: string): void {
    this.activeroles = role;
    this.applyFilters();
  }

  applyFilters(): void {
    let results = [...this.products];

    // Filter by selected Space Role category
    if (this.activeroles !== 'All') {
      results = results.filter((p: any) => p.spaceRole?.name === this.activeroles);
    }

    // Filter by search term
    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      results = results.filter((p: any) => {
        const searchableValues = [
          p.name,
          p.spaceRole?.name
        ]
          .filter((value): value is string => !!value)
          .map(value => value.toString().toLowerCase());

        return searchableValues.some(value => value.includes(term));
      });
    }

    // Filter by distance range
    if (this.minPrice != null && this.maxPrice != null) {
      results = results.filter(p => p.distanceFromEarth >= this.minPrice! && p.distanceFromEarth <= this.maxPrice!);
    }

    this.filteredProducts = results;

    if (this.selectedSort) {
      this.applySort(this.selectedSort);
    } else {
      this.filteredProducts.sort((a, b) => a.id - b.id);
    }
  }

  applyPriceFilter(min: number, max: number): void {
    this.pageNumber = 1;
    this.minPrice = min;
    this.maxPrice = max;
    this.applyFilters();
  }

  applySort(sortBy: string): void {
    if (sortBy === 'priceAsc') {
      this.filteredProducts.sort((a, b) => a.distanceFromEarth - b.distanceFromEarth);
    } else if (sortBy === 'priceDesc') {
      this.filteredProducts.sort((a, b) => b.distanceFromEarth - a.distanceFromEarth);
    } else if (sortBy === 'newest') {
      this.filteredProducts.sort((a, b) => b.id - a.id);
    } else {
      this.filteredProducts.sort((a, b) => a.id - b.id);
    }
  }

  onSortChange(sortValue: string): void {
    this.pageNumber = 1;
    this.selectedSort = sortValue;
    this.applyFilters();
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  resetFilters(): void {
    this.pageNumber = 1;
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.selectedSort = '';
    this.searchTerm = '';
    this.activeroles = 'All';
    this.loadProducts();
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.loadProducts();
    }
  }

  previousPage(): void {
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

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageNumber = page;
      this.loadProducts();
    }
  }
}