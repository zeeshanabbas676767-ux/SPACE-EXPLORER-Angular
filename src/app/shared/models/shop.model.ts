export interface Shop {
id: number;
name: string;
 description?: string;
price: number;
categoryId: number;
 categoryName: string;
 imageUrl?: string;
stock: number;
createdAt: string;
}