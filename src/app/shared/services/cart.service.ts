import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart.model';
import { Shop } from '../models/shop.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly STORAGE_KEY = 'cart_items';

  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadFromStorage();
  }

  // 🔹 Load cart from localStorage
  private loadFromStorage(): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      this.cartItems = JSON.parse(data);
      this.cartSubject.next(this.cartItems);
    }
  }

  // 🔹 Save cart to localStorage
  private saveToStorage(): void {
    localStorage.setItem(  
      this.STORAGE_KEY,   
      JSON.stringify(this.cartItems)
    );
  }
      
  // 🔹 Add to cart
  addToCart(product: Shop): void {
    const item = this.cartItems.find(i => i.product.id === product.id);

    if (item) {
      item.quantity++;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }

    this.updateCart();
  }

  increaseQuantity(productId: number): void {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (item) {
      item.quantity++;
      this.updateCart();
    }
  }

  decreaseQuantity(productId: number): void {
    const item = this.cartItems.find(i => i.product.id === productId);
    if (!item) return;

    item.quantity--;

    if (item.quantity === 0) {
      this.cartItems = this.cartItems.filter(
        i => i.product.id !== productId
      );
    }

    this.updateCart();
  }

  removeItem(productId: number): void {
    this.cartItems = this.cartItems.filter(
      i => i.product.id !== productId
    );
    this.updateCart();
  }

  getTotal(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  // 🔹 Central update method
  private updateCart(): void {
    this.cartSubject.next([...this.cartItems]);
    this.saveToStorage();
  }

  setQuantity(productId: number, quantity: number): void {
  const item = this.cartItems.find(i => i.product.id === productId);
  if (!item) return;
  if (quantity <= 0) {
    this.removeItem(productId);
    return;
  }
  item.quantity = quantity;
  this.updateCart(); // emits & saves
}


}
