# Online Bookstore

A full-stack web application built with Angular (frontend) and Node.js/Express (backend) to manage an online bookstore. Users can browse books, add them to a cart or wishlist, manage their profile, and toggle between Dark and Light modes for a personalized experience.

## Features

- **User Authentication**:
  - Register and log in with email and password.
  - Redirects to `/login` on app start and after logout.
  - Redirects to `/books` (home page) after successful login.
  
- **Book Management**:
  - Add new books with title, author, price, and genre.
  - Filter books by genre using a dropdown.
  - Search books by title or author with autocomplete suggestions.
  - View book details by clicking titles.
  - Delete books from the list.

- **Cart & Wishlist**:
  - Add books to cart or wishlist.
  - View and manage cart items with a checkout option.
  - View wishlist items.

- **Profile**:
  - Display user email and order history.

- **Dark/Light Mode Toggle**:
  - Toggle between Light (default) and Dark modes via a button in the navigation bar.
  - Dark mode uses a dark blue theme (`#1e2a44`) for the background, container, form inputs, and book list items.
  - Preference persists across sessions using `localStorage`.

- **Responsive Design**:
  - Glassmorphism UI with backdrop blur.
  - Mobile-friendly layout with media queries.

## Tech Stack

- **Frontend**: Angular 17 (standalone components), TypeScript, HTML, CSS
- **Backend**: Node.js, Express.js, MongoDB (via Mongoose)
- **Styling**: Custom CSS with variables for theming
- **Tools**: Angular CLI, npm

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local or cloud instance, e.g., MongoDB Atlas)
- Angular CLI (`npm install -g @angular/cli`)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/online-bookstore.git
cd online-bookstore
