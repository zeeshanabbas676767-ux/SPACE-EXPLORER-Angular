import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OnInit } from "@angular/core";
import { OrderService } from "../../../shared/services/order.service";
import { DetailOrderDto } from "../../../shared/models/order-models/order-Detail";
import { OrderStatus } from "../../../shared/models/order-status.enum";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../../shared/services/auth.service";
import { FormsModule } from "@angular/forms";
import { Users } from "../../../shared/models/users.model";

@Component({
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, FormsModule],
  templateUrl: './order.component.html'
})
export class AdminOrderListComponent implements OnInit {
 
  orders: DetailOrderDto[] = [];

  // ✅ Expose enum to template
  OrderStatus = OrderStatus;

  isLoading = false;
  errorMessage = '';
  error: string | null = null;
   user: Users | null = null;
      isLoggedIn = false;

  constructor(private orderService: OrderService, private auth: AuthService) {
    this.auth.user$.subscribe(u => this.user = u);
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  /* ============================
     LOAD ORDERS
  ============================ */
  loadOrders(): void {
    this.isLoading = true;
    this.error = null;

    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.errorMessage = 'Failed to load orders';
        this.isLoading = false;
      }
    });
  }

  /* ============================
     PAY ORDER
  ============================ */
  payNow(orderId: number): void {
    this.orderService.payOrder(orderId).subscribe({
      next: (updatedOrder) => {
        // Update the order locally
        const index = this.orders.findIndex(o => o.id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
        }
      },
      error: (err) => {
        console.error('Payment failed:', err);
        alert(err.error ?? 'Payment failed');
      }
    });
  }

  /* ============================
     CANCEL ORDER
  ============================ */
  cancelOrder(orderId: number): void {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    this.orderService.cancelOrder(orderId).subscribe({
      next: () => {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
          order.status = OrderStatus.Cancelled
        }
      },
      error: (err) => {
        console.error('Cancel failed:', err);
        alert(err.error ?? 'Cancel failed');
      }
    });
  }
 updateOrderStatus(orderId: number, status: number): void{
  if (!confirm('Are you sure you want to update the order status?')) {
    return;
  }
  this.orderService.updateOrderStatus(orderId, status).subscribe({
    next: () => {
      const order = this.orders.find(o => o.id === orderId);
      if(order){
    order.status = status;
      }
    },
    error: (err) => {
      console.error('Status update failed:', err);
      alert(err.error ?? 'Status update failed');
    }
  })
 }
  /* ============================
     STATUS TEXT HELPER (OPTIONAL)
  ============================ */
  // getStatusText(status: OrderStatus): string {
  //   return OrderStatus[status];
  // }

  get totalOrders(): number {
  return this.orders.length;
} 

get paidCount(): number {
  return this.orders.filter(o => o.status === OrderStatus.Paid).length;
}

get pendingCount(): number {
  return this.orders.filter(o => o.status === OrderStatus.Pending).length;
}

get cancelledCount(): number {
  return this.orders.filter(o => o.status === OrderStatus.Cancelled).length;
}

get paymentFailedCount(): number {
  return this.orders.filter(o => o.status === OrderStatus.PaymentFailed).length;
}

get shippedCount(): number {
  return this.orders.filter(o => o.status === OrderStatus.Shipped).length;
}

getStatusLabel(status: OrderStatus): string {
  return OrderStatus[status];
}

// getStatusClass(status: OrderStatus): string {
//   switch (status) {
//     case OrderStatus.Pending:
//       return 'btn-primary';
//     case OrderStatus.Paid:
//       return 'btn-success';
//     case OrderStatus.PaymentFailed:
//       return 'btn-danger';
//     case OrderStatus.Shipped:
//       return 'btn-info';
//     case OrderStatus.Cancelled:
//       return 'btn-secondary';
//     default:
//       return 'btn-light';
//   }
// }

}
