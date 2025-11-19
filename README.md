# iReporter

iReporter is a web application for reporting, tracking, and managing issues such as red-flags and interventions. It allows users to submit reports, attach media, and view the status of their complaints. Admins can manage users, resolve reports, and generate analytics.

---

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Installation](#installation)
5. [Usage](#usage)
6. [API Endpoints](#api-endpoints)
7. [Contributing](#contributing)
8. [License](#license)

---

## Features

- User Authentication & Authorization
- Report Management (Create, Read, Update, Delete)
- Admin Management & User Role Control
- File Uploads (Images, Videos)
- Status Tracking (Pending, Resolved, Rejected)
- Dashboard & Analytics for Admins
- Secure Data Handling & Validation
- Responsive Design

---

## Technologies Used

**Frontend:**  
- React.js  
- Tailwind CSS  
- React Router  
- Axios  

**Backend:**  
- Node.js  
- Express.js  
- MySQL (Database)  
- Multer (File uploads)  
- JWT (Authentication)  

**Tools & Others:**  
- Git & GitHub  
- Postman (API testing)  
- Vite (Frontend build tool)

---

## Project Structure

iReporter/
│
├── backend/ # Node.js backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── node_modules/
│ ├── .gitignore
│ └── server.js
│
├── corruption/ # Example folder for corruption reports
│ ├── node_modules/
│ └── ...
│
├── frontend/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── contexts/
│ │ └── App.jsx
│ ├── node_modules/
│ └── package.json
│
├── .gitignore
├── README.md
└── package.json



## Installation

### Backend

1. Navigate to the backend folder:

cd backend

2. Install dependencies:

npm install

3. Create a .env file and configure:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=ireporter
JWT_SECRET=yourSecretKey
PORT=5000

4. Start the backend server:

npm run dev

### Frontend

1. Navigate to the frontend folder:

cd corruption

2. Install dependencies:

npm install


### Usage

Register or login as a user

Submit a report (red-flag or intervention) with optional file uploads

Track the status of your reports

Admins can view all reports, resolve or reject them, and manage users


###  API Endpoints

Method    	Endpoint    	               Description
POST	      /api/auth/register	        Register new user
POST	      /api/auth/login	             Login user
GET	       /api/reports	                 Get all reports
POST	     /api/reports	                Create new report
PUT	       /api/reports/:id	             Update report status
DELETE	   /api/reports/:id	            Delete a report


###   Contributing

Fork the repository

Create your branch: git checkout -b feature/my-feature

Commit your changes: git commit -m 'Add feature'

Push to the branch: git push origin feature/my-feature

Create a Pull Request


###   License


This version:

- Fixes all **broken code blocks**  
- Uses **proper Markdown headers**  
- Wraps the **project structure** and **code snippets** in triple backticks  
- Formats **API endpoints** as a GitHub-renderable table  

