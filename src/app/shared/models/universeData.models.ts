
import { Asteroid } from "./asteroid.model";
import { Category } from "./category.model";
import { ExoPlanet } from "./exoPlanet.model";
import { Galaxy } from "./galaxy.model";
import { Moon } from "./moon.model";
import { Planet } from "./planet.model";
import { SpaceRoles } from "./spaceRoles.model";

export interface UniverseData {
   id: 0;
   planetId?: 0;
   planet?: Planet;
   galaxyId?: 0;
   galaxy?: Galaxy;
   asteroidId?: 0;
   asteroid?: Asteroid;
   moonId?: 0;
   moon?: Moon;
   exoPlanetId?: 0; 
   exoPlanet?: ExoPlanet;
   spaceRoleId?: number;
   spaceRole?: SpaceRoles;

   name: string;
   description: string; 
   distanceFromEarth: number;
   radius: number;
   mass: number;
   isVisibleToNakedEye: boolean;
   imageUrl: string;
   isActive: boolean; 
   createdAt: Date
}