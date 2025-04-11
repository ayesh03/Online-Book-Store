import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Add this
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: any = null;
  reviews: any[] = [];
  newReview = { rating: 0, comment: '' };

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.getBookById(id).subscribe({
        next: (data) => this.book = data,
        error: (err) => console.error('Failed to load book:', err)
      });
      this.loadReviews(id);
    }
  }

  loadReviews(bookId: string) {
    this.bookService.getReviews(bookId).subscribe({
      next: (data) => this.reviews = data,
      error: (err) => console.error('Failed to load reviews:', err)
    });
  }

  addReview() {
    if (this.newReview.rating < 1 || this.newReview.rating > 5 || !this.newReview.comment) {
      alert('Rating must be 1-5 and comment is required');
      return;
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.addReview(id, this.newReview).subscribe({
        next: () => {
          this.loadReviews(id);
          this.newReview = { rating: 0, comment: '' };
        },
        error: (err) => console.error('Failed to add review:', err)
      });
    }
  }
}