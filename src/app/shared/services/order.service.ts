import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetailOrderDto } from '../models/order-models/order-Detail';
import { CreateOrderDto } from '../models/order-models/order-Create';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = '${environment.apiUrl}/orders';

  constructor(private http: HttpClient) {}

  /* ============================
     GET ALL ORDERS
     GET: api/orders
  ============================ */
  getOrders(): Observable<DetailOrderDto[]> {
    return this.http.get<DetailOrderDto[]>(this.apiUrl, {   withCredentials: true   });
  }

  /* ============================
     GET SINGLE ORDER
     GET: api/orders/{id}
  ============================ */
  getOrderById(id: number): Observable<DetailOrderDto> {
    return this.http.get<DetailOrderDto>(`${this.apiUrl}/${id}`, {   withCredentials: true   });
  }

  /* ============================
     CREATE ORDER
     POST: api/orders
     Body: CreateOrderDto  
  ============================ */
  createOrder(orderDto: CreateOrderDto): Observable<CreateOrderDto> {
    return this.http.post<CreateOrderDto>(this.apiUrl, orderDto, { withCredentials: true });
    
  }
   
  /* ============================
     UPDATE ORDER STATUS (ADMIN / SYSTEM)
     PATCH: api/orders/{orderId}/status
     Body: OrderStatus enum value
  ============================ */
  updateOrderStatus(orderId: number, status: number): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${orderId}/status`, status, { withCredentials: true });
  }

  /* ============================
     CANCEL ORDER
     PUT: api/orders/{id}/cancel
  ============================ */
  cancelOrder(orderId: number): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${orderId}/cancel`,{  withCredentials: true}
    );
  }

  /* ============================
     PAY ORDER
     PUT: api/orders/{id}/pay
  ============================ */
  payOrder(orderId: number): Observable<DetailOrderDto> {
    return this.http.put<DetailOrderDto>(
      `${this.apiUrl}/${orderId}/pay`, { withCredentials: true }
    );
  }
}
