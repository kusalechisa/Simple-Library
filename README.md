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

---

## **How to Fix**

1. **Install Frappe Bench CLI:**
   Open a terminal and run:
   ```sh
   pip install frappe-bench
   ```

2. **Restart your terminal** (or ensure your Python/Scripts directory is in your PATH).

3. **Then, re-run:**
   ```sh
   bench init my-bench --frappe-branch version-15
   ```

---

Would you like me to run the `pip install frappe-bench` command for you now? If so, please confirm that you have Python and pip installed on your system. 

---

## **Step-by-Step: Frappe Setup in WSL**

### 1. **Open your WSL terminal**
- You can do this by searching for “Ubuntu” (or your chosen distro) in the Start menu, or by running `wsl` in Command Prompt.

---

### 2. **Update your Linux packages**
```sh
sudo apt update && sudo apt upgrade -y
```

---

### 3. **Install Required Dependencies**
Follow the [Frappe official guide](https://frappeframework.com/docs/v15/user/en/installation), or use these commands:

```sh
<code_block_to_apply_changes_from>
```

---

### 4. **Install Frappe Bench**
```sh
pip3 install frappe-bench
```

---

### 5. **Set Up Your Bench and Site**
```sh
# Create a new bench (folder)
bench init my-bench --frappe-branch version-15
cd my-bench

# Create a new site
bench new-site library.local
```

---

### 6. **Get and Install Your Custom App**
```sh
# Clone your project repo (replace with your actual repo URL)
git clone <your-repo-url>
bench get-app library_management ./library_management

# Install the app on your site
bench --site library.local install-app library_management
```

---

### 7. **Start the Frappe Server**
```sh
bench start
```
- The backend will be available at: http://localhost:8000

---

### 8. **Frontend Setup (in a new terminal tab/window)**
```sh
cd /path/to/your/project/frontend
npm install
npm run dev
```
- The frontend will be available at: http://localhost:5173

---

## **Let me know when you’re ready for the next step, or if you hit any issues!**
If you want, I can walk you through each command one by one. 