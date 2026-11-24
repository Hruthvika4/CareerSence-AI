# CareerSense AI - Local Setup Guide

CareerSense AI is an intelligent career guidance platform that uses Gemini 3 models to analyze resumes, identify skill gaps, and provide personalized technical assessments.

## 📋 Prerequisites

Before starting, ensure you have the following installed:
- **Python 3.9+**
- **Node.js 18+** & **npm**
- **MongoDB** (running locally on `localhost:27017`)

---

## 🔑 Step 1: Environment Configuration

Create a file named `.env` in the root directory of the project and add your Gemini API key:

```env
API_KEY=AIzaSyAtLkHXolTlPc_A1eZzQyOacU2biExXpyk
MONGODB_URL=mongodb://localhost:27017/career_sense
```

---

## ⚙️ Step 2: Backend Setup (Python)

Open your terminal or command prompt in the project root directory.

### **Windows (Command Prompt)**
```cmd
# 1. Create a virtual environment
python -m venv venv

# 2. Activate the virtual environment
venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the backend server
python main.py
```

### **macOS / Linux (Terminal)**
```bash
# 1. Create a virtual environment
python3 -m venv venv

# 2. Activate the virtual environment
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the backend server
python3 main.py
```

The backend will be live at: `http://localhost:8000`

---

## 💻 Step 3: Frontend Setup (React/Vite)

Open a **new** terminal/command prompt window (do not close the backend one).

### **All Operating Systems**
```bash
# 1. Install frontend dependencies
npm install

# 2. Start the development server
npm run dev
```

The frontend will be live at: `http://localhost:3000`

---

## 🚀 Step 4: Using the Application

1.  Open your browser to `http://localhost:3000`.
2.  **Login**: Use the "Use Test Account" button or enter `test@careersense.ai` with password `password123`.
3.  **Analyze**: Paste a resume and a job description to see the matching score.
4.  **Assessment**: After analysis, click "Take Skill Quiz" to generate a custom 10-question assessment based on the JD.

## 📁 Project Structure

- `main.py`: FastAPI entry point.
- `gemini_logic.py`: Backend Gemini 3 integration logic.
- `analysis_engine.py`: Local TF-IDF scoring and gap detection.
- `geminiService.ts`: Frontend API client and Gemini 3 fallback service.
- `pages/`: React application pages (Dashboard, Assessment, Learning).
- `components/`: Reusable UI components.
- `vite.config.ts`: Environment variable mapping for frontend.

---

## 🛠 Troubleshooting

- **MongoDB Connection**: If the backend fails to start, ensure your MongoDB service is running.
- **Port Conflicts**: If port 3000 or 8000 is taken, you can modify `vite.config.ts` (for 3000) or `main.py` (for 8000).
- **API Key**: If you see "API Key not found", ensure your `.env` file is in the root and named correctly.
