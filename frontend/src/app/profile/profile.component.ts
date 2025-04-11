import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: { email: string } | null = null;
  orders: any[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.bookService.getUser().subscribe({
      next: (data: { email: string }) => this.user = data,
      error: (err: any) => console.error('Failed to load user:', err)
    });
    this.bookService.getOrders().subscribe({
      next: (data: any[]) => this.orders = data,
      error: (err: any) => console.error('Failed to load orders:', err)
    });
  }
}