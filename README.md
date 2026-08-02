# ResumeIQ 🧠

An AI-powered resume analyzer that evaluates your resume for ATS (Applicant Tracking System) compatibility using Google Gemini AI — providing instant scores, strengths, weaknesses, missing skills, and actionable improvement suggestions.

**Live Demo:** [resume-iq-rho-five.vercel.app](https://resume-iq-rho-five.vercel.app)

---

## ✨ Features

- 🔐 **Authentication** — Secure signup & login with JWT tokens and bcrypt password hashing
- 📄 **PDF Upload** — Upload your resume in PDF format (up to 5MB)
- 🎯 **Job Role Based Analysis** — Select a target job role for role-specific AI feedback
- 🤖 **AI-Powered Analysis** — Google Gemini AI analyzes your resume for ATS compatibility
- 📊 **ATS Score** — Instant compatibility score with visual breakdown (Overall, Readability, Keyword Match)
- ✅ **Strengths** — What your resume does well
- ⚠️ **Weaknesses** — Gaps and areas that need improvement
- 🎯 **Missing Skills** — Skills you should add for your target role
- 💡 **Suggestions** — Actionable steps to improve your resume
- 🔄 **Smart Fallback** — Content-based analysis when Gemini API quota is exceeded
- 📱 **Responsive UI** — Works seamlessly on mobile and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite) + Custom CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas |
| AI Integration | Google Gemini AI API |
| Authentication | JWT + bcrypt |
| File Handling | Multer + pdf-parse |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## 📁 Project Structure

```
ResumeIQ/
├── frontend/                   # React.js (Vite) frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx          # Navigation bar
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Login page
│   │   │   ├── Register.jsx        # Register page
│   │   │   └── Dashboard.jsx       # Resume upload & results
│   │   ├── services/
│   │   │   └── api.js              # Axios instance
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
│
└── backend/                    # Node.js + Express API
    ├── controllers/
    │   ├── authController.js       # Signup, Login
    │   └── resumeController.js     # Upload, Analyze, History
    ├── middleware/
    │   └── auth.js                 # JWT protect middleware
    ├── models/
    │   ├── User.js                 # Users collection
    │   └── Resume.js               # Resumes collection
    ├── routes/
    │   ├── auth.js
    │   └── resume.js
    ├── utils/
    │   └── aiService.js            # Gemini AI integration + fallback
    ├── .env.example
    └── server.js
```

---

## 🗄️ Database Design

### `users`
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed with bcrypt)",
  "createdAt": "Date"
}
```

### `resumes`
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref: User)",
  "filePath": "string",
  "extractedText": "string",
  "analysis": {
    "score": "number (0-100)",
    "jobRole": "string",
    "strengths": ["string"],
    "weaknesses": ["string"],
    "missingSkills": ["string"],
    "suggestions": ["string"]
  },
  "createdAt": "Date"
}
```

---

## ⚙️ API Endpoints

### Auth Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |

### Resume Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/resume/upload` | Upload & analyze resume | Private |
| GET | `/api/resume/history` | Get past analyses | Private |

---

## 🔧 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### 1. Clone the repository
```bash
git clone https://github.com/AnkitThainuan/ResumeIQ.git
cd ResumeIQ
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

**Backend `.env` variables:**
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/resumeiq
JWT_SECRET=your_long_random_secret_key
JWT_EXPIRE=7d
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | [resume-iq-rho-five.vercel.app](https://resume-iq-rho-five.vercel.app) |
| Backend | Render | [resumeiq-8z1b.onrender.com](https://resumeiq-8z1b.onrender.com) |
| Database | MongoDB Atlas | Cloud hosted |

### Deploy Backend (Render)
1. Connect GitHub repo → select `backend/` as root directory
2. Build command: `npm install`
3. Start command: `npm start`
4. Add all environment variables

### Deploy Frontend (Vercel)
1. Connect GitHub repo → select `frontend/` as root directory
2. Framework: Vite
3. Add environment variable: `VITE_API_URL=https://resumeiq-8z1b.onrender.com/api`

---

## 🔑 Key Implementation Highlights

- **Passwords** hashed with bcrypt (12 rounds) before storage
- **JWT tokens** expire in 7 days, stored in localStorage
- **PDF text extraction** using Multer (file upload) + pdf-parse (text extraction)
- **Job Role Analysis** — Gemini AI prompt customized based on selected job role
- **Smart Fallback** — Content-based analysis when Gemini API quota exceeded, no service interruption
- **Animated loading steps** — "Reading resume → Extracting skills → Matching role → Generating feedback"
- **Register → Login flow** — Users register then login with credentials (standard auth UX)

---

## 🎯 Supported Job Roles for Analysis

Full Stack Developer, Frontend Developer, Backend Developer, MERN Stack Developer, React Developer, Node.js Developer, Software Engineer, DevOps Engineer, Data Scientist, Machine Learning Engineer, Python Developer, Java Developer, Android Developer, iOS Developer, UI/UX Designer, Data Analyst, Cloud Engineer, Cybersecurity Analyst, Product Manager, QA Engineer

---

## 📸 Screenshots

> Add screenshots here

---

## 👨‍💻 Author

**Ankit Singh**
- GitHub: [@AnkitThainuan](https://github.com/AnkitThainuan)
- LinkedIn: [ankit-singh-877130328](https://www.linkedin.com/in/ankit-singh-877130328/)
- Email: ankitsinghthainuan@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
