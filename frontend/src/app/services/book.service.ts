import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:5000/api/books';
  private cartUrl = 'http://localhost:5000/api/cart';
  private checkoutUrl = 'http://localhost:5000/api/checkout';
  private ordersUrl = 'http://localhost:5000/api/orders';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getBooks(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addBook(book: any): Observable<any> {
    return this.http.post(this.apiUrl, book);
  }

  deleteBook(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addToCart(bookId: string): Observable<any> {
    return this.http.post(this.cartUrl, { bookId }, { headers: this.getHeaders() });
  }

  getCart(): Observable<any> {
    return this.http.get(this.cartUrl, { headers: this.getHeaders() });
  }

  removeFromCart(bookId: string): Observable<any> {
    return this.http.delete(`${this.cartUrl}/${bookId}`, { headers: this.getHeaders() });
  }

  checkout(): Observable<any> {
    return this.http.post(this.checkoutUrl, {}, { headers: this.getHeaders() });
  }

  getOrders(): Observable<any> {
    return this.http.get(this.ordersUrl, { headers: this.getHeaders() });
  }

  getBookById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addToWishlist(bookId: string): Observable<any> {
    return this.http.post('http://localhost:5000/api/wishlist', { bookId }, { headers: this.getHeaders() });
  }

  getWishlist(): Observable<any> {
    return this.http.get('http://localhost:5000/api/wishlist', { headers: this.getHeaders() });
  }

  removeFromWishlist(bookId: string): Observable<any> {
    return this.http.delete(`http://localhost:5000/api/wishlist/${bookId}`, { headers: this.getHeaders() });
  }

  addReview(bookId: string, review: { rating: number, comment: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${bookId}/reviews`, review, { headers: this.getHeaders() });
  }

  getReviews(bookId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${bookId}/reviews`);
  }

  getUser(): Observable<{ email: string }> {
    return this.http.get<{ email: string }>('http://localhost:5000/api/user', { headers: this.getHeaders() });
  }
}