# Internship Finder Web

This is the frontend application for the Internship Manager project. It is built with Vue.js and Vite.

## Related Backend API
The related backend API application can be found here: [https://github.com/YehorSk/internship-manager-api](https://github.com/YehorSk/internship-manager-api)

---

## Setup Instructions

### Requirements
- **Node.js** 22+
- **npm**
- **Git**
- **Server API**: Before starting the frontend, you must run the server API (Laravel, see the backend repository). Important: your web server (e.g., Apache/XAMPP) must be configured so that the DocumentRoot points to the `public` folder of your Laravel application, not the project root. By default, the frontend expects the API to be available at `http://localhost/api/`.

### Local Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/YehorSk/internship-manager-web.git
   cd internship-manager-web
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Copy the example environment file to `.env`:**
   - On **Linux/macOS**:
     ```sh
     cp .env.example .env
     ```
   - On **Windows (PowerShell)**:
     ```sh
     cp .env.example .env
     ```
   - On **Windows (cmd.exe)**:
     ```cmd
     copy .env.example .env
     ```
4. **Run the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:3000/](http://localhost:3000/).

---

## How to Run the App
1. Start the backend API (see backend repository for instructions).
2. Start the frontend as described above.
3. Open [http://localhost:3000/](http://localhost:3000/) in your browser.
