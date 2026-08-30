import { OrderStatus } from "../order-status.enum";

export interface DetailOrderItemDto {
  imageUrl: string;
  productName: string;
  price: number;
  quantity: number;
}
 
export interface DetailOrderDto {
  id: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string; // ISO date string
  userFullName: string;
  userEmail: string;
  
  items: DetailOrderItemDto[];
}

