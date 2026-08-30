import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../shared/services/cart.service';
import { CartItem } from '../../../shared/models/cart.model';
import { Shop } from '../../../shared/models/shop.model';
import { ShopService } from '../../../shared/services/shop.service';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../shared/services/order.service';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { routes } from '../../../app.routes';
import { AuthService } from '../../../shared/services/auth.service';
 
@Component({
  standalone: true,
   selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl:'./cart.component.html',
})
export class CartComponent implements OnInit {

  cartItems: CartItem[] = [];
  products: Shop[] = [];
  total = 0;
cartCount = 0;
 
  constructor(private cartService: CartService, private orderService: OrderService, private authService: AuthService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(items => {
       this.cartItems = items;
       this.total = this.cartService.getTotal();
    });
  }

  increase(id: number) {
    this.cartService.increaseQuantity(id);
  }

  decrease(id: number) {
    this.cartService.decreaseQuantity(id);
  }

  remove(id: number) {
    this.cartService.removeItem(id);
  }

createOrder() {
  const orderDto = {
    items: this.cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }))
  };
    if (!this.authService.isLoggedIn()) {
    alert('🙏 Please login or register before creating order');
    return;
  } 
  this.orderService.createOrder(orderDto).subscribe({
    next: (response) => {
      alert('🎉 Order created successfully');
      console.log('Order response:', response);
    },
  error: (err) => {
  console.error(err);

  const backendError =
    err.error ? JSON.stringify(err.error) : 'No error body from server';

  alert(`Error: ${backendError}\nMessage: ${err.message}`);
}

    // error: (err) => {
    //   console.error(err);
    //   alert("Error:"+ err.error + "--------- Error message:"+ err.message);

    // }
  });
}

updateQuantity(productId: number, quantity: number) {
  this.cartService.setQuantity(productId, quantity);
}

}
