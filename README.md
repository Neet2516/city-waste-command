

# 🚀 AI-Driven Circular Waste Intelligence System

A **full-stack smart waste management platform** built during **India Innovates Hackathon 2026**, designed to transform municipal waste systems using **AI, Machine Learning, and real-time data analytics**.

---

## 🌍 Problem We’re Solving

Traditional waste management systems suffer from:

* ❌ No waste segregation at source
* ❌ Fixed, inefficient collection routes
* ❌ No real-time monitoring
* ❌ Lack of data-driven decision making

---

## 💡 Our Solution

We built an **AI-powered smart waste management system** that:

* 🤖 Uses **Machine Learning** to classify waste
* 📡 Tracks bins in real-time
* 🗺️ Optimizes collection routes
* 📊 Provides a **municipal dashboard** for monitoring

---

## 🧠 Machine Learning Integration

Our system includes a **deployed ML model** that:

* Classifies waste into categories (biodegradable, recyclable, hazardous)
* Works in real-time via API
* Returns instant detection results
* Is scalable for smart city infrastructure

📡 **Live ML API:**
👉 [https://waste-management-cmup.onrender.com/classify](https://waste-management-cmup.onrender.com/classify)

---

## 🌐 Live Demo

🔗 **Frontend Application:**
👉 [https://wastemanagementmc.netlify.app/](https://wastemanagementmc.netlify.app/)

🔗 **Backend / ML API:**
👉 [https://waste-management-cmup.onrender.com/classify](https://waste-management-cmup.onrender.com/classify)

---

## 🖥️ Features

### 📊 Admin Dashboard

* Real-time statistics (bins, drivers, system status)
* Interactive charts & analytics
* Auto-refresh system (live updates)

### 🗑️ Waste Bin Management

* Track all bins with status
* Filter by ward/location
* Update bin status in real-time

### 🗺️ Smart Map View

* Interactive city-wide bin visualization
* Color-coded status (Full / Filling / Empty)
* Ward-based filtering

### 🤖 AI + ML Features

* Waste classification using ML model
* Real-time detection API
* Scalable inference system

### 🔄 Real-Time System

* Live updates every few seconds
* Optimistic UI updates
* Error handling & smooth loading states

---

## 🛠️ Tech Stack

### Frontend

* React.js (with hooks)
* Tailwind CSS
* Shadcn UI
* Recharts (data visualization)
* React Leaflet (maps)

### Backend

* Node.js / Express (API layer)
* REST APIs

### AI / ML

* ML Model for waste classification
* API-based inference system

### Tools & Deployment

* Vite
* Netlify (Frontend)
* Render (Backend API)

---

## 📁 Project Structure

```
src/
├── components/        # UI components
├── pages/             # Main pages (Dashboard, Map, Bins)
├── services/          # API integration layer
├── context/           # Global state management
├── hooks/             # Custom hooks
├── data/              # Mock / static data
├── lib/               # Utility functions
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repo

```bash
git clone <your-repo-url>
cd city-waste-command
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create `.env` file:

```env
VITE_BACKEND_URL=https://waste-management-cmup.onrender.com
```

### 4️⃣ Run locally

```bash
npm run dev
```

---

## 📡 API Endpoints

### ML Classification

```
POST /classify
```

**Response:**

```json
{
  "status": "success",
  "detected": true
}
```

---

## 📊 Impact

* ♻️ Improved waste segregation
* 🚛 Reduced fuel consumption via optimized routes
* 📊 Real-time municipal insights
* 🌱 Supports sustainable smart cities

---

## 🏆 Hackathon Achievement

🏁 Participated in **India Innovates Hackathon 2026**
📍 Bharat Mandapam, New Delhi
🔥 Selected in **Top 1000 out of 10,000+ teams**

---

## 👨‍💻 My Contribution

* 🎨 Designed & developed **complete frontend**
* 🖥️ Built **admin dashboard**
* 🔗 Integrated ML APIs with UI
* ⚡ Implemented real-time data updates
* 🏗️ Structured scalable project architecture

---

## 🚀 Future Scope

* 📦 IoT-based smart bins integration
* 📈 Advanced ML models for prediction
* 🌐 City-wide deployment
* 💰 Incentive system for citizens
* 🌍 Carbon tracking & analytics

---

## 🤝 Contributors

* Navneet Sinha
* Naman Srivastava
* Vinay Papnoi
* Chinmoy Senapoti
* Priyanshu Uttam
* Shivansh Kumar

---

## ⭐ Show Your Support

If you like this project:

* ⭐ Star this repo
* 🍴 Fork it
* 📢 Share it

---
