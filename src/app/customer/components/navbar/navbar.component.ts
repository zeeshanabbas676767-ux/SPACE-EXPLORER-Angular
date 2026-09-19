import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 import { CartService } from '../../../shared/services/cart.service';
import { CartItem } from '../../../shared/models/cart.model';
import { AuthService } from '../../../shared/services/auth.service';
import { OrderService } from '../../../shared/services/order.service';
import { Users } from '../../../shared/models/users.model';
import { Role } from '../../../shared/models/role.model';
import { AuthResponse } from '../../../shared/models/auth-Responce';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  cartItems: CartItem[]= []
cartCount = 0;
isFixed = false; 
  total = 0;
  isLoggedIn = false;
isAdminLoggedIn = false;
   role: Role | null = null;
    currentUser: AuthResponse | null = null;

constructor (private auth: AuthService,
  private cartService: CartService,
   private router: Router, private orderService: OrderService){
    // this.auth.user$.subscribe(u => this.user = u);
    // this.auth.user$.subscribe(u => u?.roleId == 4);
   }

ngOnInit(): void {
   const user = localStorage.getItem('user');
    this.isLoggedIn = !!user; // Convert to boolean
    
     this.auth.user$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      this.isAdminLoggedIn = user?.role === 'Admin';
    });

       this.cartService.cart$.subscribe(items => {
        this.cartItems = items;
         this.total = this.cartService.getTotal();
     this.cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    });
        
}

  get isCustomerLoggedIn(): boolean {
    
    return this.currentUser?.role === 'Customer';
  }



logout() {
  this.auth.logout();
  this.router.navigate(['/login']);
}

  createOrder() {
  const orderDto = {
    items: this.cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity
    }))
  };

  this.orderService.createOrder(orderDto).subscribe({
    next: (response) => {
      alert('Order created successfully');
      console.log('Order response:', response);
    },
    error: (err) => {
      console.error(err);
      alert(err.error || 'Order creation failed');
    }
  });
}

}
