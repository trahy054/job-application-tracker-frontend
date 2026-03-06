# Job Tracker - Frontend

Frontend of the **Job Tracker** project, built with **React**.  
Allows users to view, add, update, and delete jobs, with filtering, statistics, and toast notifications.

## Features
- View job list
- Add new job
- Update / Delete job
- Filter jobs by status
- Display job statistics
- Toast notifications for success/error

## Requirements
- Node.js >= 16 
- npm >= 8
- Backend API running at `http://localhost:5000`

## Installation & Run
1. Clone the repo:
```bash
git clone https://github.com/trahy054/job-application-tracker-frontend.git
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`.

## Backend API
- Make sure the backend server is running at `http://localhost:5000`
- The frontend communicates with the backend for:
  - Fetching jobs
  - Adding new jobs
  - Updating existing jobs
  - Deleting jobs
    
## Notes
- Tested with Node.js v24.7.0 and npm v11.5.1
- Ensure your backend is running before using the frontend

## Project Structure
```
frontend/
├─ src/
│  ├─ pages/
│  ├─ services/
│  ├─ App.css
│  └─ App.js
│  └─ index.js
├─ package.json
└─ README.md
```

## Author
**Son Hoang Tran**
