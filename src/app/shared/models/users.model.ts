import { Role } from "./role.model";

export interface Users{
    id: number,
    fullName: string,
    email: string,
    totalOrders: number;
    roleId: number;
    role: Role
}