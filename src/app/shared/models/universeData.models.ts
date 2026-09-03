

import { SpaceRoles } from "./spaceRoles.model";

export interface UniverseData {
   id: number;
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