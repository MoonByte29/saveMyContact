# ContactScan (saveMyContact)

ContactScan is a full-stack web application designed to help users digitize their business cards and physical contact lists. By simply uploading images of business cards or documents, the system uses optical character recognition (OCR) to extract phone numbers, automatically format them, and generate a readily downloadable CSV file that can be easily imported into any CRM or phone contact list.

## 🚀 Features

- **Automated OCR Extraction:** Uses Tesseract.js to scan uploaded images and accurately extract phone numbers.
- **Smart Contact Numbering:** Give your batch a prefix (e.g., "Student") and the system will intelligently name them ("Student", "Student 1", "Student 2"). The system queries the database to continue this numbering seamlessly across multiple future uploads!
- **Downloadable CSVs:** Extracted contacts are instantly converted into a downloadable CSV format.
- **Secure Image Hosting:** Uploaded images are streamed securely and stored on Cloudinary.
- **Role-Based Access Control:** 
  - **Users:** Can register, login, upload images, and manage their own extraction history.
  - **Admins:** Have access to an Admin Panel to monitor total uploads, view system-wide statistics, manage all users, and perform global deletions.
- **Robust Data Management:** Implementing full cascading deletes—deleting a user or an upload securely wipes the associated records from the database, removes the images from Cloudinary, and deletes the CSVs from local storage.
- **Modern UI:** A clean, responsive dashboard built with React and TailwindCSS.

## 🏗️ Project Architecture

The application follows a standard Client-Server model with a Model-View-Controller (MVC) pattern on the backend to maintain a clean separation of concerns.

### 1. Frontend (Client-Side)
- **Component-Based UI:** Built with React, featuring standalone pages (`Dashboard`, `AdminPanel`, `UploadPage`, `UserImages`, `Login`, `Register`).
- **State & Routing:** Utilizes React Router for client-side navigation. Authentication state (JWT) is managed via `localStorage`.
- **API Communication:** All requests to the backend are centralized through an Axios service layer (`services/api.js`), handling authorization headers automatically.

### 2. Backend (Server-Side - MVC Pattern)
- **Routes (`/routes`):** Define the API endpoints (`authRoutes`, `uploadRoutes`, `adminRoutes`) and bind them to specific controllers.
- **Middlewares (`/middleware`):** Handle route protection (JWT verification, Admin checks) and intercept file uploads using `multer-storage-cloudinary` to stream images directly to Cloudinary.
- **Controllers (`/controllers`):** House the core business logic. For example, `uploadController.js` coordinates the entire pipeline from file reception, OCR triggering, duplicate numbering logic, and DB record creation.
- **Services (`/services`):** Modular, reusable utility files to keep controllers clean:
  - `ocrServices.js`: Interfaces with Tesseract.js for text extraction.
  - `phoneParser.js`: Uses regular expressions to parse valid phone numbers from raw text.
  - `csvServices.js`: Converts the parsed JSON data into CSV format and writes it to the server's local disk.
- **Models (`/models`):** Mongoose schemas defining the structure of `User` and `Upload` documents in MongoDB.

### 3. The OCR & Data Pipeline (Core Workflow)
1. **Upload:** User submits images via the React Dashboard.
2. **Storage:** The Express `uploadMiddleware` securely streams the images directly to Cloudinary and returns their secure URLs.
3. **Fetch & Buffer:** The backend controller fetches the images from Cloudinary into a memory Buffer.
4. **OCR Extraction:** The buffer is passed to Tesseract.js, which analyzes the image and returns raw string text.
5. **Parsing:** The raw text is fed through Regex parsers to identify phone numbers.
6. **Smart Numbering:** The database is queried for previous uploads to determine the next sequential number for the given prefix.
7. **CSV Generation & DB Save:** The formatted contacts are saved as a CSV file to the local disk, and an `Upload` record is created in MongoDB.
8. **Response:** The client receives the generated CSV file for immediate download.

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- TailwindCSS for styling
- React Router DOM for navigation
- Axios for API requests

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (Database)
- Tesseract.js (Optical Character Recognition)
- Cloudinary & Multer-Storage-Cloudinary (Image Hosting)
- json2csv (CSV generation)
- JSON Web Tokens (JWT) & bcryptjs (Authentication)

## ⚙️ Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB URI (local or MongoDB Atlas)
- Cloudinary Account (Cloud Name, API Key, API Secret)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd saveMyContact
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add your credentials:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Usage
- Open your browser and navigate to the frontend URL (typically `http://localhost:5173`).
- Register a new account.
- To make an account an Admin, you can manually change the role in the database or select the admin role during registration (if enabled).
- Navigate to the Dashboard, enter a prefix, upload your images, and download your CSV!
