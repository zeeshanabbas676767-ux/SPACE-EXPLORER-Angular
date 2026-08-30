import { SpaceRoles } from "./spaceRoles.model";

export interface CreateUD {
  name: string;
  distanceFromEarth: number;
radius: number;
mass: number;
isVisibleToNakedEye: boolean;
  spaceRoleId: number;
  description: string;
   imageUrl: string;
}
