# Internship Finder Web

This is the frontend application for the Internship Manager project. It is built with Vue.js and Vite.

## Related Backend API
The related backend API application can be found here: [https://github.com/YehorSk/internship-manager-api](https://github.com/YehorSk/internship-manager-api)

## Setup Instructions

### Requirements
- **Node.js** 22+
- **npm**

### Local installation on the host OS

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

### Local installation with Docker

See the README.md of the backend repository for Docker-based local installation instructions, as both frontend and backend need to be set up together.
