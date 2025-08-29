
# 🤖 AI Customer Support Chat Platform  

[![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://react.dev/)  
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)](https://nodejs.org/)  
[![Express](https://img.shields.io/badge/Framework-Express-black?logo=express)](https://expressjs.com/)  
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen?logo=mongodb)](https://www.mongodb.com/)  
[![Gemini](https://img.shields.io/badge/AI-Gemini-purple?logo=google)](https://deepmind.google/technologies/gemini/)  

A **full-stack AI-powered customer support chat application** built with the **MERN stack** and **Gemini API**.  
It features a **modern chat interface** for users to interact with an AI assistant and an **admin panel** for managing company FAQs.  

---

## 🚀 Live Demo  

🔗 [AI Customer Support Chat Platform](https://ai-customer-support-chatplatform.onrender.com)  

![Screenshot](https://github.com/user-attachments/assets/fa1436e1-97c5-4601-a134-a6882ed9d159)  

---

## ✨ Features  

- 🔐 **User Authentication** – Secure JWT-based login & registration.  
- 🤖 **AI-Powered Chat** – Virtual assistant powered by the Gemini API.  
- 💬 **Chat History** – Stored in MongoDB, continue where you left off.  
- 📚 **FAQ Integration** – Upload `.txt` / `.pdf` files to build a knowledge base.  
- 🛠️ **Admin Panel** – Manage FAQs (create, view, edit, delete).  
- 📂 **Chat Export** – Download chats as `.txt` or `.pdf`.  
- 📱 **Responsive UI** – Modern design optimized for desktop & mobile.  

![Screenshot](https://github.com/user-attachments/assets/adcdbd1d-5d0a-4c6f-9a69-6d366b301af6)  

---

## 💻 Tech Stack  

### Frontend  
- ⚛️ **React** – UI framework  
- 🛤️ **React Router** – Navigation  
- 🎨 **Bootstrap** – Responsive styling  
- 🔔 **React Toastify** – Toast notifications  
- ⭐ **Font Awesome** – Icons  
- 📝 **jsPDF** – Chat export to PDF  

### Backend  
- 🟢 **Node.js & Express** – REST API  
- 🍃 **MongoDB & Mongoose** – Database  
- 🤖 **Gemini API** – AI responses  
- 🔑 **JWT** – Authentication  
- 🔒 **bcrypt.js** – Password hashing  
- 📂 **express-fileupload & pdf-parse** – File upload & parsing  

---

## 📦 Getting Started  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/manikantha-asam/AI_Customer_Support_Chat_Platform.git
cd AI_Customer_Support_Chat_Platform
````

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## ⚙️ Configuration

Create **`.env` files** in both backend and frontend.

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://manikantha:<password>@cluster0.kf0vqvv.mongodb.net/ai_support_chat?retryWrites=true&w=majority
LLM_PROVIDER=gemini
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
JWT_SECRET=YOUR_RANDOM_SECRET_KEY
```

### Frontend `.env`

```env
REACT_APP_API_URL=http://localhost:5000
```

⚠️ For production, replace `http://localhost:5000` with your live backend URL.

---

## 🤖 How to Use

1. **Run the app** – Start backend & frontend servers.
2. **Initialize Admin User (one-time setup):**
   Run in browser console:

   ```js
   fetch('http://localhost:5000/api/auth/admin-init', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ username: 'admin', password: '1234' })
   })
   .then(res => res.json())
   .then(data => console.log(data));
   ```
3. **Login** – Use `admin / 1234` or register as a new user.
4. **Upload FAQs** – As admin, upload `.txt` / `.pdf` files.
5. **Start Chatting** – Chat with the AI assistant.

---

## 🏗️ Future Enhancements

* 📊 Chat analytics for admins
* 🌍 Multi-language support
* 🎨 Dark mode UI
* 🔔 Email notifications

---

## 📜 License

This project is licensed under the **MIT License**.

---

💡 *Built with MERN & ❤️ for smarter customer support.*

```

