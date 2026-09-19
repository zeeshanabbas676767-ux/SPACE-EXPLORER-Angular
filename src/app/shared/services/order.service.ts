import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetailOrderDto } from '../models/order-models/order-Detail';
import { CreateOrderDto } from '../models/order-models/order-Create';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
class OrderService {

  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getOrders(): Observable<DetailOrderDto[]> {
    return this.http.get<DetailOrderDto[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<DetailOrderDto> {
    return this.http.get<DetailOrderDto>(`${this.apiUrl}/${id}`);
  }

  createOrder(orderDto: CreateOrderDto): Observable<any> {
    // 👈 Passing orderDto as the body correctly, interceptor handles the header
    return this.http.post<any>(this.apiUrl, orderDto);
  }

  updateOrderStatus(orderId: number, status: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${orderId}/status`, status);
  }

  cancelOrder(orderId: number): Observable<void> {
    // 👈 Fixed: No more passing options object into the body parameter slot
    return this.http.put<void>(`${this.apiUrl}/${orderId}/cancel`, {});
  }

  payOrder(orderId: number): Observable<DetailOrderDto> {
    return this.http.put<DetailOrderDto>(`${this.apiUrl}/${orderId}/pay`, {});
  }
}
export { OrderService };