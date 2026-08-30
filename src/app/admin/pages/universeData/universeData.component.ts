import { Component, OnInit } from '@angular/core';
import { UniverseData } from '../../../shared/models/universeData.models';
import { UniverseDataService } from '../../../shared/services/universeData.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Planet } from '../../../shared/models/planet.model';
import { Moon } from '../../../shared/models/moon.model';
import { Galaxy } from '../../../shared/models/galaxy.model';
import { Asteroid } from '../../../shared/models/asteroid.model';
import { ExoPlanet } from '../../../shared/models/exoPlanet.model';

import { PlanetService } from '../../../shared/services/planet.service';
import { MoonService } from '../../../shared/services/moon.service';
import { GalaxyService } from '../../../shared/services/galaxy.service';
import { AsteroidService } from '../../../shared/services/asteriod.service';
import { ExoPlanetService } from '../../../shared/services/exoPlanet.service';
import { SpaceRolesService } from '../../../shared/services/spaceRoles.service';
import { AuthService } from '../../../shared/services/auth.service';
import { SpaceRoles } from '../../../shared/models/spaceRoles.model';

@Component({
  selector: 'admin-UniverseData',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './universeData.component.html'
})
export class AdminUniverseDataComponent implements OnInit {

  UData: UniverseData[] = [];
  inputData: any = {
    description: '',
    distanceFromEarth: null,
    radius: null,
    mass: null,
    isVisibleToNakedEye: false
  };

selectedFile: File | null = null;
  fileName: string = '';
  previewUrl: string | null = null;
  private objectUrl: string | null = null;

  // Track selected IDs
  selectedSpaceRolesId: number | null = null;
  selectedObjectId: number = 0;

  // Master lists loaded from database
  roles: SpaceRoles[] = [];
  planet: Planet[] = [];
  galaxy: Galaxy[] = [];
  moon: Moon[] = [];
  asteroid: Asteroid[] = [];
  exoPlanet: ExoPlanet[] = [];

    loading = false;
isEditMode = false;
editingId: number | null = null; 

   currentPage = 1;
  pageSize = 10;
  totalItems = 0;

get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  constructor(
    private UniverseDataService: UniverseDataService,
    private spaceRoleService: SpaceRolesService,
    private planetservice: PlanetService, 
    private moonservice: MoonService,
    private galaxyservice: GalaxyService,
    private asteroidservice: AsteroidService,
    private exoplanetservice: ExoPlanetService
  ) {}

  ngOnInit(): void {
    this.loadUniverseData();
    this.loadSpaceRoles();
    this.loadPlanets();
    this.loadMoon();
    this.loadGalaxies();
    this.loadAsteroids();
    this.loadExoPlanets();
    this.loadPage(1);
  }

loadSpaceRoles() {
  this.spaceRoleService.getAll().subscribe({
    next: (data: any) => {
      console.log('Roles received from API:', data);
      this.roles = data;
    },
    error: (err) => {
      console.error('Error fetching roles:', err);
    }
  });
}

  loadPlanets() {
    this.planetservice.getAll().subscribe((data: any) => {
      this.planet = data; // Fixed: Removed the hardcoded u.id === 1 filter
    });
  }

  loadMoon() {
    this.moonservice.getAll().subscribe((data: any) => {
      this.moon = data; // Fixed: Removed the hardcoded u.id === 3 filter
    });
  }

  loadGalaxies() {
    this.galaxyservice.getAll().subscribe((data: any) => {
      this.galaxy = data;
    });
  }

  loadAsteroids() {
    this.asteroidservice.getAll().subscribe((data: any) => {
      this.asteroid = data;
    });
  }

  loadExoPlanets() {
    this.exoplanetservice.getAll().subscribe((data: any) => {
      this.exoPlanet = data;
    });
  }

  // loadUniverseDatas() {
  //   this.UniverseDataService.getAll().subscribe(data => {
  //     this.UData = data;
  //   });
  // }

  
  loadUniverseData() {
  this.UniverseDataService.getAll().subscribe((response: any) => {
    this.UData = response.data;   // unwrap the array
    // this.totalRecords = response.Total; // optional, if you add pagination UI later
  });
}
onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.fileName = file.name;

      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
      }

      this.objectUrl = URL.createObjectURL(file);
      this.previewUrl = this.objectUrl;
    }
  }


  // Reset the secondary object dropdown value whenever the main role changes
  onRoleChange() {
    this.selectedObjectId = 0;
  }
saveUniverseData() {

  if (this.isEditMode) {
    this.updateUniverseData();
  } else {
    this.createUniverseData();
  }

}

createUniverseData() {

  this.loading = true;
  console.log('selectedSpaceRolesId:', this.selectedSpaceRolesId);
  console.log('type:', typeof this.selectedSpaceRolesId);
  console.log('selectedObjectId:', this.selectedObjectId);

  // guard in enrollStudent
if (!this.selectedSpaceRolesId || !this.selectedObjectId) {
  alert('Please select a space role and object.');
  return;
}

  const formData = new FormData();
  formData.append('Description', this.inputData.description ?? '');
formData.append('DistanceFromEarth', (this.inputData.distanceFromEarth ?? 0).toString());
formData.append('Radius', (this.inputData.radius ?? 0).toString());
formData.append('Mass', (this.inputData.mass ?? 0).toString());
formData.append('IsVisibleToNakedEye', String(this.inputData.isVisibleToNakedEye));
const roleId = Number(this.selectedSpaceRolesId);

formData.append('SpaceRoleId', roleId.toString());

if (roleId === 7) formData.append('PlanetId', this.selectedObjectId.toString());
if (roleId === 8) formData.append('GalaxyId', this.selectedObjectId.toString());
if (roleId === 9) formData.append('MoonId', this.selectedObjectId.toString());
if (roleId === 10) formData.append('AsteroidId', this.selectedObjectId.toString());
if (roleId === 11) formData.append('ExoPlanetId', this.selectedObjectId.toString());

formData.append('ImageFile', this.selectedFile!);

for (const pair of (formData as any).entries()) {
  console.log(pair[0], pair[1]);
}

  this.UniverseDataService.create(formData).subscribe({
    next: () => {
      this.loadUniverseData();
      this.inputData = { description: '', distanceFromEarth: null, radius: null, mass: null, isVisibleToNakedEye: false };
      this.selectedSpaceRolesId = 0;
      this.selectedObjectId = 0;
      this.selectedFile = null;
      this.fileName = '';
      this.previewUrl = null;
      if (this.objectUrl) {
        URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = null;
      }
    },
    error: (err) => {
      console.error('Validation errors:', err.error.errors);
      this.loading = false;
    }
  });
}


updateUniverseData() {

  const formData = new FormData();

  formData.append('Id', this.editingId!.toString());

  formData.append('Description', this.inputData.description ?? '');

  formData.append(
    'DistanceFromEarth',
    (this.inputData.distanceFromEarth ?? 0).toString()
  );

  formData.append(
    'Radius',
    (this.inputData.radius ?? 0).toString()
  );

  formData.append(
    'Mass',
    (this.inputData.mass ?? 0).toString()
  );

  formData.append(
    'IsVisibleToNakedEye',
    String(this.inputData.isVisibleToNakedEye)
  );

  formData.append(
    'SpaceRoleId',
    this.selectedSpaceRolesId!.toString()
  );

  const roleId = Number(this.selectedSpaceRolesId);

  if (roleId === 7)
    formData.append('PlanetId', this.selectedObjectId.toString());

  if (roleId === 8)
    formData.append('GalaxyId', this.selectedObjectId.toString());

  if (roleId === 9)
    formData.append('MoonId', this.selectedObjectId.toString());

  if (roleId === 10)
    formData.append('AsteroidId', this.selectedObjectId.toString());

  if (roleId === 11)
    formData.append('ExoPlanetId', this.selectedObjectId.toString());

  // Upload new image only if selected
  if (this.selectedFile) {
    formData.append('ImageFile', this.selectedFile);
  }

  this.UniverseDataService.update(this.editingId!, formData)
    .subscribe({

      next: () => {

        this.loadUniverseData();

        this.resetForm();

        this.isEditMode = false;
        this.editingId = null;
      },

      error: err => {
        console.error(err);
      }

    });

}
editUniverseData(data: UniverseData) {

  this.isEditMode = true;
  this.editingId = data.id;

  this.inputData = {
    description: data.description,
    distanceFromEarth: data.distanceFromEarth,
    radius: data.radius,
    mass: data.mass,
    isVisibleToNakedEye: data.isVisibleToNakedEye
  };

  this.selectedSpaceRolesId = data.spaceRoleId!;

  if (data.planetId)
    this.selectedObjectId = data.planetId;

  if (data.galaxyId)
    this.selectedObjectId = data.galaxyId;

  if (data.moonId)
    this.selectedObjectId = data.moonId;

  if (data.asteroidId)
    this.selectedObjectId = data.asteroidId;

  if (data.exoPlanetId)
    this.selectedObjectId = data.exoPlanetId;

  this.previewUrl = data.imageUrl;
}

  removeUData(UniverseDataId: number) {
    if (confirm('Are you sure you want to delete this UniverseData?')) {
      this.UniverseDataService.delete(UniverseDataId).subscribe({
        next: () => this.loadUniverseData(),
        error: (err) => console.error('Error removing UniverseData:', err)
      });
    }
  }


  loadPage(page: number) {
    this.UniverseDataService.getAll(page, this.pageSize).subscribe({
      next: (res: any) => {
        this.UData = res.data;
        this.totalItems = res.total;
        this.currentPage = page;
      },
      error: (err) => console.error('Failed to load page:', err)
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


  resetForm() {
   this.isEditMode = false;
this.editingId = null;
    this.inputData = {
      description: '',
      distanceFromEarth: null,
      radius: null,
      mass: null,
      isVisibleToNakedEye: false
    };
    this.selectedSpaceRolesId = null;
    this.selectedObjectId = 0;
    this.selectedFile = null;
    this.fileName = '';
    this.previewUrl = null;
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}

