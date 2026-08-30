import { Category } from "./category.model";
import { SpaceRoles } from "./spaceRoles.model";

export interface exploreUniverse {
id: number;
name: string;
 description?: string;
distanceFromEarth: number;
radius: number;
mass: number;
isVisibleToNakedEye: boolean;
 spaceRole?: SpaceRoles; 
 spaceRoleId: number;
 imageUrl: string;
createdAt: string;
}