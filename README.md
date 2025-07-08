# Simple Library Management System

## Overview
A web application for managing books, members, and loans in a library. Built with Frappe Framework 15 (backend) and React 18 + TypeScript (frontend). All CRUD and business logic are handled via a custom REST API and a standalone UI (no Frappe Desk).

## Features
- Book, Member, Loan, and Reservation management
- REST API for all entities
- Role-based authentication (admin, librarian, member)
- Overdue notifications via email
- Reservation queue for unavailable books
- Custom front-end UI (React)

## Setup Instructions

### Backend (Frappe)
1. Install Frappe Framework 15 (see https://frappeframework.com/docs/v15/user/en/installation).
2. Create a new site (if you don't have one):
   ```
   bench new-site library.local
   ```
3. Get this app:
   ```
   bench get-app library_management [repo-url]
   bench --site library.local install-app library_management
   ```
4. Start the server:
   ```
   bench start
   ```

### Frontend (React)
1. Go to the `frontend` folder:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Folder Structure
- `library_management/` - Frappe app (backend)
- `frontend/` - React app (frontend)

## Notes
- All CRUD and business logic are handled via REST API, not Frappe Desk.
- See code comments and this README for architectural decisions and trade-offs. 