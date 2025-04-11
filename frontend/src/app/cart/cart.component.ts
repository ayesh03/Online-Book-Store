import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any[] = [];
  total: number = 0;

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.bookService.getCart().subscribe({
      next: (data) => {
        this.cart = data;
        this.total = this.cart.reduce((sum, book) => sum + book.price, 0);
      },
      error: (err) => console.error('Failed to load cart:', err)
    });
  }

  removeFromCart(bookId: string) {
    this.bookService.removeFromCart(bookId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Failed to remove from cart:', err)
    });
  }

  checkout() {
    this.bookService.checkout().subscribe({
      next: () => {
        alert('Checkout successful!');
        this.loadCart();
      },
      error: (err) => console.error('Checkout failed:', err)
    });
  }
}