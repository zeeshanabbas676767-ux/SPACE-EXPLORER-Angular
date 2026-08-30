import { Component } from '@angular/core';
import { OrderStatus } from '../../../shared/models/order-status.enum';
import { DetailOrderDto } from '../../../shared/models/order-models/order-Detail';
import { OrderService } from '../../../shared/services/order.service';
import { exploreUniverseService } from '../../../shared/services/exploreUniverse.service';
import { exploreUniverse } from '../../../shared/models/exploreUniverse.model';
// import { CategoryService } from '../../../shared/services/category.service';
import { Category } from '../../../shared/models/category.model';
import { NgFor, NgIf, NgForOf } from '@angular/common';
import { UniverseData } from '../../../shared/models/universeData.models';
import { Galaxy } from '../../../shared/models/galaxy.model';
import { Planet } from '../../../shared/models/planet.model';
import { ExoPlanet } from '../../../shared/models/exoPlanet.model';
import { Asteroid } from '../../../shared/models/asteroid.model';
import { Moon } from '../../../shared/models/moon.model';
import { UniverseDataService } from '../../../shared/services/universeData.service';
import { ExoPlanetService } from '../../../shared/services/exoPlanet.service';
import { AsteroidService } from '../../../shared/services/asteriod.service';
import { MoonService } from '../../../shared/services/moon.service';
import { GalaxyService } from '../../../shared/services/galaxy.service';
import { PlanetService } from '../../../shared/services/planet.service';
import { SpaceRoles } from '../../../shared/models/spaceRoles.model';
import { SpaceRolesService } from '../../../shared/services/spaceRoles.service';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [NgForOf]
})
export class AdminDashboardComponent {
 UD: UniverseData[] = [];
 spaceRole: SpaceRoles[] = [];

 planet: Planet[] = [];
 galactic: Galaxy[] = []
 moon: Moon[] = [];
 asteroid: Asteroid[] = [];
 exoPlanet: ExoPlanet[] = [];

  isLoading = false;
  errorMessage = '';

   constructor(private universeDataService: UniverseDataService,
    private planetService: PlanetService,
    private galaxyService: GalaxyService,
    private moonService: MoonService,
    private asteroidService: AsteroidService,
    private exoPlanetService: ExoPlanetService,
    private spaceRoleService: SpaceRolesService
   ) {}

     ngOnInit(): void {
    this.loadUniverseData();
    this.loadPlanet();
    this.loadGalactic();
    this.loadMoon();
    this.loadAsteroid();
    this.loadExoPlanet();
    this.loadSpaceRoles();
  }
 

//  get Count(): number {
//     return this.products.filter(o => o.spaceRoleId ===  o.spaceRoleId).length;
//   }

loadSpaceRoles(){
  this.spaceRoleService.getAll().subscribe((data: SpaceRoles[]) => {
      this.spaceRole = data;
    });
  }
  
//  loadUniverseData() {
//   this.isLoading = true;
//   this.universeDataService.getAll().subscribe({
//     next: (data: UniverseData[]) => {
//       this.UD = data;
//       this.isLoading = false;
//      console.log('UniverseData loaded:', this.UD);
//     },
//     error: (err) => {
//       console.error('UniverseData load failed:', err);
//       this.errorMessage = 'Failed to load universe data.';
//       this.isLoading = false;
//     }
//   });
// }
loadUniverseData() {
  this.isLoading = true;
  this.universeDataService.getAll(1, 1000).subscribe({   // <-- pageNumber=1, pageSize=1000
    next: (res: any) => {
      this.UD = res.data;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('UniverseData load failed:', err);
      this.errorMessage = 'Failed to load universe data.';
      this.isLoading = false;
    }
  });
}

  loadPlanet() {
    this.planetService.getAll().subscribe((data: Planet[]) => {
      this.planet = data;
    });
  }
  loadGalactic() {
    this.galaxyService.getAll().subscribe((data: Galaxy[]) => {
      this.galactic = data;
    });
  }
  loadMoon() {
    this.moonService.getAll().subscribe((data: Moon[]) => {
      this.moon = data;
    });
  }
  loadAsteroid() {
    this.asteroidService.getAll().subscribe((data: Asteroid[]) => {
      this.asteroid = data;
    });
  }
  loadExoPlanet() {
    this.exoPlanetService.getAll().subscribe((data: ExoPlanet[]) => {
      this.exoPlanet = data;
    });
  }

  get totalCount(): number {
    return this.UD.length;
  }
get planetCount(): number {
    return this.UD.filter(o => o.spaceRoleId === 7).length;
  }
  get galacticCount(): number {
    return this.UD.filter(o => o.spaceRoleId === 8).length;
  }
  get moonCount(): number {
    return this.UD.filter(o => o.spaceRoleId === 9).length;
  }
  get asteroidCount(): number {
    return this.UD.filter(o => o.spaceRoleId === 10).length;
  }
  get exoPlanetCount(): number {
    return this.UD.filter(o => o.spaceRoleId === 11).length;
  }
   
  get roleSummary(): { name: string; count: number }[] {
  const map = new Map<number, { name: string; count: number }>();

  for (const item of this.UD) {
    if (!item.spaceRoleId) continue; // skip malformed rows like item 8 you saw earlier

    if (!map.has(item.spaceRoleId)) {
      map.set(item.spaceRoleId, { name: item.name, count: 0 });
    }
    map.get(item.spaceRoleId)!.count++;
  }

  return Array.from(map.values());
}
}
