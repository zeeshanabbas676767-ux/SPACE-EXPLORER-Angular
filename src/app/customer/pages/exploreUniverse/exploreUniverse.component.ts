import { Component, OnInit } from '@angular/core';
import { UniverseData } from '../../../shared/models/universeData.models';
import { UniverseDataService } from '../../../shared/services/universeData.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpaceRoles } from '../../../shared/models/spaceRoles.model';
import { SpaceRolesService } from '../../../shared/services/spaceRoles.service';
import { Asteroid } from '../../../shared/models/asteroid.model';
import { Galaxy } from '../../../shared/models/galaxy.model';
import { Planet } from '../../../shared/models/planet.model';
import { ExoPlanet } from '../../../shared/models/exoPlanet.model';
import { PlanetService } from '../../../shared/services/planet.service';
import { GalaxyService } from '../../../shared/services/galaxy.service';
import { AsteroidService } from '../../../shared/services/asteriod.service';
import { ExoPlanetService } from '../../../shared/services/exoPlanet.service';

@Component({
  selector: 'app-explore-universe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exploreUniverse.component.html',
})
export class exploreUniverseComponent implements OnInit {
  products: UniverseData[] = [];
  filteredProducts: UniverseData[] = [];
  planet: Planet[] = [];
  galactic: Galaxy[] = [];
  asteroids: Asteroid[] = []
  exoPlnaet: ExoPlanet[] = [];

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

  constructor(private universeDataService: UniverseDataService, 
    private planetSrevice: PlanetService,
    private GalaxyService: GalaxyService,
    private AsteroidService: AsteroidService,
    private ExoPlanetService: ExoPlanetService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadPlanets();
    this.loadGalaxies();
    this.loadAsteroids();
    this.loadExoPlanets();
  }

  loadPlanets() {
    this.planetSrevice.getAll().subscribe((response: Planet[]) => {
      this.planet = response;
    });
  }

  loadGalaxies() {
    this.GalaxyService.getAll().subscribe((response: Galaxy[]) => {
      this.galactic = response;
    });
  }
  loadAsteroids() {
    this.AsteroidService.getAll().subscribe((response: Asteroid[]) => {
      this.asteroids = response;
    });
  }

  loadExoPlanets() {
    this.ExoPlanetService.getAll().subscribe((response: ExoPlanet[]) => {
      this.exoPlnaet = response;
    });
  }

  loadProducts() {
    this.universeDataService.getAll(1, 1000, this.selectedSort)
      .subscribe((response: any) => {
        console.log('API Response:', response);
        this.products = response.data;
        this.filteredProducts = [...this.products];
        this.totalRecords = response.total;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

        // Extract unique space role names for filter buttons
        this.roles = [...new Set(this.products
          .map((p: any) => p.name)
          .filter((name: any): name is string => !!name))];

        this.applyFilters();
      });
  }

  filterByroles(roles: string): void {
    this.activeroles = roles;
    this.applyFilters();
  }

  applyFilters(): void {
    let results = [...this.products];

    if (this.activeroles !== 'All') {
      results = results.filter((p: any) => p.name === this.activeroles);
    }

    const term = this.searchTerm.trim().toLowerCase();
    if (term) {
      results = results.filter((p: any) => {
        const searchableValues = [
          p.name,
          p.planet?.planet_Name,
          p.galaxy?.galaxy_Name,
          p.moon?.moon_Name,
          p.asteroid?.asteroid_Name,
          p.exoPlanet?.exoPlanet_Name,
          p.spaceRole?.name
        ]
          .filter((value): value is string => !!value)
          .map(value => value.toString().toLowerCase());

        return searchableValues.some(value => value.includes(term));
      });
    }

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

  applyPriceFilter(min: number, max: number) {
    this.pageNumber = 1;
    this.minPrice = min;
    this.maxPrice = max;
    this.applyFilters();
  }

  applySort(sortBy: string) {
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

  onSortChange(sortValue: string) {
    this.pageNumber = 1;
    this.selectedSort = sortValue;
    this.applyFilters();
  }

  onSearchChange(term: string) {
    this.searchTerm = term;
    this.applyFilters();
  }

  resetFilters() {
    this.pageNumber = 1;
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.selectedSort = '';
    this.searchTerm = '';
    this.activeroles = 'All';
    this.loadProducts();
  }
}


// import { Component, OnInit } from '@angular/core';
// import { Shop } from '../../../shared/models/shop.model';
// import { ShopService } from '../../../shared/services/shop.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { CartService } from '../../../shared/services/cart.service';
// import { RouterLink } from "@angular/router";

// @Component({
//    selector: 'app-shop',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './shop.component.html',
// })
// export class ShopComponent implements OnInit {
//   products: Shop[] = [];          // All products from API
//   filteredProducts: Shop[] = [];  // Copy of Products shown on UI.
//   roles: string[] = [];      // roles buttons
//   activeroles = 'All'; // For All Products button
//   selectedSort: string = ''; 
//   minPrice?: number;
// maxPrice?: number;
// pageNumber: number = 1;
// pageSize: number = 10;
// totalPages: number = 0;
// totalRecords: number = 0;
  
//   constructor(private shopService: ShopService, private cartService: CartService) {}

//   ngOnInit(): void {
//     this.loadProducts();
//   }

// loadProducts() {
//   this.shopService.getAll(this.selectedSort, this.activeroles,
//     this.minPrice, this.maxPrice, this.pageNumber, this.pageSize)
//     .subscribe((response: any) => {
//       console.log('API Response:', response);
//       this.products = response.data;           // unwrap the array
//       this.filteredProducts = [...this.products];
//       this.totalRecords = response.total;      // note: lowercase, check your actual key
//       this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

//       this.roles = [...new Set(this.products
//         .map((p: any) => p.spaceRole?.name)
//         .filter((name: any): name is string => name !== undefined))];
//     });
// }
//   // Filter products by roles
//   filterByroles(roles: string): void {
//     this.pageNumber = 1; // Reset to first page on roles change
//     if (roles === 'All') {
//       this.filteredProducts = [...this.products];
//     } else {
//       this.filteredProducts = this.products.filter(
//         p => p.spaceRole?.name === roles
//       );
//     }
//      this.activeroles = roles;

//     if (this.selectedSort) {
//     this.applySort(this.selectedSort);
//     }
     
//      if (this.minPrice != null && this.maxPrice != null) {
//       // option A – do client‑side again:
//       this.filteredProducts = this.filteredProducts
//           .filter(p => p.distanceFromEarth >= this.minPrice! && p.distanceFromEarth <= this.maxPrice!);
//       if (this.selectedSort) this.applySort(this.selectedSort);

//       // option B – or call the server if you prefer:
//       // this.applyPriceFilter(this.minPrice!, this.maxPrice!);
//     }
    
//     // if(this.minPrice && this.maxPrice) {
//     //   this.applyPriceFilter(this.minPrice, this.maxPrice);
//     // }
//   }
//   addToCart(product: Shop): void {
//   this.cartService.addToCart(product);
// }

// applyPriceFilter(min: number, max: number) {
//   this.pageNumber = 1; // Reset to first page on roles change
//   // if(min <= 0) { min = 0; }

//   // if (min < max){
//   //   this.filteredProducts = this.products.filter(p => p.price >= min && p.price <= max);
//   // }
//   this.minPrice = min; 
//   this.maxPrice = max;
//   this.filterByroles(this.activeroles);
//    if (this.selectedSort) {
//     this.applySort(this.selectedSort);
//   }
// }

// applySort(sortBy: string) {
//   if (sortBy === 'priceAsc') {
//     this.filteredProducts.sort((a, b) => a.distanceFromEarth - b.distanceFromEarth);
//   } else if (sortBy === 'priceDesc') {
//     this.filteredProducts.sort((a, b) => b.distanceFromEarth - a.distanceFromEarth);
//   }
//   else if (sortBy === 'newest') {
//     this.filteredProducts.sort((a, b) => b.id - a.id);
//   }
//   else if(sortBy === '') {
//     this.filteredProducts.sort((a, b) => a.id - b.id);
//   }
// //   else if (sortBy === 'newest') {
// //   this.filteredProducts.sort((a, b) => {
// //     const dateA = new Date(a.createdAt).getTime() || 0;
// //     const dateB = new Date(b.createdAt).getTime() || 0;
// //     return dateB - dateA;
// //   });
// // }
// }
// onSortChange(sortValue: string) {
//   this.pageNumber = 1; // Reset to first page on roles change
//   this.selectedSort = sortValue;
//   this.applySort(sortValue);
//  // this.loadProducts();
// }
// sortProducts(sortBy: string) {
//   this.shopService.getAll(sortBy)
//     .subscribe(data => {
//       this.filteredProducts = data;
//     });
// }
// resetFilters() {
//   this.pageNumber = 1; // Reset to first page on roles change
//   this.minPrice = undefined;
//   this.maxPrice = undefined; 
//   this.selectedSort = '';
//   this.activeroles = 'All';
// }

// // nextPage() {
// //   if (this.pageNumber < this.totalPages) {
// //     this.pageNumber++;
// //     this.loadProducts();
// //   }
// // }

// // previousPage() {
// //   if (this.pageNumber > 1) {
// //     this.pageNumber--;
// //     this.loadProducts();
// //   }
  
// // }
// // getVisiblePages(): number[] {
// //   const maxButtons = 1;
// //   const visibleCount = Math.min(maxButtons, this.totalPages);
// //   return Array(visibleCount).fill(0).map((x, i) => i + 1);
// // }

// // goToPage(page: number) {
// //   this.pageNumber = page;
// //   this.loadProducts();
// // }




// // onSortChange(event: any) {
// //   const value = event.target.value;

// //   let sortBy: string | undefined;
// //   let minPrice: number | undefined;
// //   let maxPrice: number | undefined;

// //   if (value === 'priceAsc') sortBy = 'priceAsc';
// //   else if (value === 'priceDesc') sortBy = 'priceDesc';
// //   else if (value === 'newest') sortBy = 'newest';
// //   else if (value === 'filter100-600') { minPrice = 100; maxPrice = 600; }
// //   else if (value === 'filter600-1200') { minPrice = 600; maxPrice = 1200; }

// //   this.shopService.getAll(sortBy, minPrice, maxPrice)
// //     .subscribe(data => {
// //       this.filteredProducts = data;
// //     });
// // }
// }   