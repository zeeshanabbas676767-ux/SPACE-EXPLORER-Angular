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
  totalPages: number = 1;
  totalRecords: number = 0;

  constructor(
    private universeDataService: UniverseDataService, 
    private spaceRoleService: SpaceRolesService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadPage(1);
  }

  // 1. Load permanent role buttons directly from SpaceRoles table
  loadRoles(): void {
    this.spaceRoleService.getAll().subscribe({
      next: (data) => {
        this.roles = data.map(r => r.spaceRoleName);
      },
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  // 2. Fetch paginated space objects from API
  loadPage(page: number): void {
    this.universeDataService.getAll(page, this.pageSize).subscribe({
      next: (res: any) => {
        const allData: UniverseData[] = res.data || res;

        // Filter out incomplete test records
        this.products = allData.filter(item => 
          item.description && 
          item.description !== 'N/A' && 
          (item.distanceFromEarth > 0 || item.radius > 0 || item.mass > 0)
        );

        this.totalRecords = res.total || this.products.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize) || 1;
        this.pageNumber = page;

        this.applyFilters();
      },
      error: (err) => console.error('Failed to load page:', err)
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
      results = results.filter((p: any) => p.spaceRole?.spaceRole_Name === this.activeroles);
    }

    // Filter by search term
    const term = this.searchTerm?.trim().toLowerCase(); 
    if (term) {
      results = results.filter((p: any) => {
        const searchableValues = [p.name, p.spaceRole?.spaceRoleName]
          .filter((value): value is string => !!value)
          .map(value => value.toString().toLowerCase());

        return searchableValues.some(value => value.includes(term));
      });
    }

    // Independent Distance Range Filtering
    if (this.minPrice != null && this.minPrice > 0) {
      results = results.filter(p => p.distanceFromEarth >= this.minPrice!);
    }
    if (this.maxPrice != null && this.maxPrice > 0) {
      results = results.filter(p => p.distanceFromEarth <= this.maxPrice!);
    }

    this.filteredProducts = results;

    // Apply Sorting
    if (this.selectedSort) {
      this.applySort(this.selectedSort);
    } else {
      this.filteredProducts.sort((a, b) => a.id - b.id);
    }
  }

  applyPriceFilter(min: number, max: number): void {
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
    this.selectedSort = sortValue;
    this.applyFilters();
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  resetFilters(): void {
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.selectedSort = '';
    this.searchTerm = '';
    this.activeroles = 'All';
    this.loadPage(1);
  }

  // 3. Proper Pagination Navigation Triggers
  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.loadPage(this.pageNumber + 1);
    }
  }

  previousPage(): void {
    if (this.pageNumber > 1) {
      this.loadPage(this.pageNumber - 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadPage(page);
    }
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}