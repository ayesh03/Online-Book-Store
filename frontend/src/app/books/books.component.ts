import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: any[] = [];
  filteredBooks: any[] = [];
  newBook = { title: '', author: '', price: 0, genre: '' };
  selectedGenre: string = '';
  searchQuery: string = '';
  suggestions: string[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.filterBooks();
      },
      error: (err) => console.error('Failed to load books:', err)
    });
  }

  addBook() {
    this.bookService.addBook(this.newBook).subscribe({
      next: () => {
        this.loadBooks();
        this.newBook = { title: '', author: '', price: 0, genre: '' };
      },
      error: (err) => console.error('Failed to add book:', err)
    });
  }

  deleteBook(id: string) {
    this.bookService.deleteBook(id).subscribe({
      next: () => this.loadBooks(),
      error: (err) => console.error('Failed to delete book:', err)
    });
  }

  addToCart(bookId: string) {
    this.bookService.addToCart(bookId).subscribe({
      next: () => alert('Added to cart!'),
      error: (err) => console.error('Failed to add to cart:', err)
    });
  }

  addToWishlist(bookId: string) {
    this.bookService.addToWishlist(bookId).subscribe({
      next: () => alert('Added to wishlist!'),
      error: (err) => console.error('Failed to add to wishlist:', err)
    });
  }

  filterBooks() {
    this.filteredBooks = this.books.filter(book => 
      (!this.selectedGenre || book.genre === this.selectedGenre) &&
      (!this.searchQuery || 
        book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );
    this.updateSuggestions();
  }

  updateSuggestions() {
    if (this.searchQuery.length > 0) {
      this.suggestions = this.books
        .filter(book => 
          book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
        .map(book => `${book.title} by ${book.author}`)
        .slice(0, 5);
    } else {
      this.suggestions = [];
    }
  }

  selectSuggestion(suggestion: string) {
    const [title] = suggestion.split(' by ');
    this.searchQuery = title;
    this.filterBooks();
    this.suggestions = [];
  }
}