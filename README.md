AI Customer Support Chat Platform
This is a full-stack, AI-powered customer support chat application built with the MERN (MongoDB, Express, React, Node.js) stack and the Gemini API. It provides a chat interface for users to interact with an AI assistant and an admin panel for uploading and managing company FAQs.

🚀 Live Demo
You can access a live version of the application here:

Live URL: https://ai-customer-support-chatplatform.onrender.com


<img width="1366" height="643" alt="Screenshot 2025-08-29 at 16-48-07 AI Support Chat" src="https://github.com/user-attachments/assets/fa1436e1-97c5-4601-a134-a6882ed9d159" />


✨ Features
User Authentication: Secure JWT-based login and registration.

AI-Powered Chat: Users can chat with a virtual assistant powered by the Gemini API.

Chat History: Conversations are saved to the database, allowing users to continue where they left off.

FAQ Integration: The AI assistant uses a pre-uploaded FAQ knowledge base to provide specific, accurate answers.

Admin Panel: An exclusive admin-only area for managing the FAQ knowledge base.

Upload company documents (.txt or .pdf) to create FAQs.

View, edit, and delete stored FAQ entries.

Chat Export: Users can download their chat history as a .txt or .pdf file.

Responsive UI: A clean, modern chat interface that looks great on both desktop and mobile devices.

<img width="1349" height="11415" alt="Screenshot 2025-08-29 at 16-51-03 AI Support Chat" src="https://github.com/user-attachments/assets/adcdbd1d-5d0a-4c6f-9a69-6d366b301af6" />



💻 Tech Stack
Frontend:

React: The core JavaScript library for building the user interface.

React Router: For handling navigation between different pages (Login, Chat, Admin Panel).

Bootstrap: For responsive styling and UI components.

React Toastify: For displaying clean, informative pop-up messages.

Font Awesome: For icons used throughout the application.

jsPDF: To enable PDF chat export functionality.

Backend:

Node.js & Express: The runtime and web framework for building the REST API.

MongoDB & Mongoose: A NoSQL database for storing user data, conversations, and FAQs.

Gemini API: The AI model used to generate bot responses.

JSON Web Tokens (JWT): For secure, stateless user authentication.

bcrypt.js: For hashing and securing user passwords.

express-fileupload & pdf-parse: For handling file uploads and extracting text from PDFs.

📦 Getting Started
Follow these steps to set up and run the project on your local machine.

1. Clone the repository
git clone [https://github.com/manikantha-asam/AI_Customer_Support_Chat_Platform.git](https://github.com/manikantha-asam/AI_Customer_Support_Chat_Platform.git)
cd AI_Customer_Support_Chat_Platform

2. Backend Setup
Navigate to the backend directory, install dependencies, and start the server.

cd backend
npm install
npm run dev

3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and start the development server.

cd frontend
npm install
npm start

⚙️ Configuration
Create .env files in both your backend and frontend directories using the examples below.

Backend .env
PORT=5000
MONGO_URI=mongodb+srv://manikantha:<password>@cluster0.kf0vqvv.mongodb.net/ai_support_chat?retryWrites=true&w=majority
LLM_PROVIDER=gemini
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
JWT_SECRET=YOUR_RANDOM_SECRET_KEY

Frontend .env
REACT_APP_API_URL=http://localhost:5000

Note:
For production deployment, you must replace http://localhost:5000 with your live backend URL (e.g., https://my-backend.onrender.com).

🤖 How to Use the App
Run the app: Follow the setup steps above to start the backend and frontend servers.

Initialize Admin User (One-Time Step): The first time you run the app, you need to create the admin user. Open your browser's developer console (F12) and run the following fetch command to create the user:

fetch('http://localhost:5000/api/auth/admin-init', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: '1234' })
})
.then(res => res.json())
.then(data => console.log(data));

Login: Go to the app's login page and use the admin credentials (username: admin, password: 1234) or register a new user.

Upload FAQs: Log in as an admin and use the admin panel to upload a .txt or .pdf file.

Start Chatting: Navigate to the chat interface and start interacting with the AI assistant!
