export interface CreateOrderItem {
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  items: CreateOrderItem[];
}