# 📝 Notes App

A modern full-stack Notes application built with React, TypeScript, Supabase, and Tailwind CSS. Users can securely create, organize, and manage their notes with authentication and cloud synchronization.

---

## ✨ Features

### Authentication
- User Registration
- User Login
- Logout
- Forgot Password
- Reset Password
- Secure Authentication using Supabase Auth

### Notes
- Create Notes
- Edit Notes
- Delete Notes
- Pin / Unpin Notes
- Archive / Restore Notes
- Move Notes to Trash
- Restore from Trash
- Permanently Delete Notes
- Empty Trash

### Dashboard
- Welcome Card
- Quick New Note
- Notes Statistics
- Pinned Notes
- Recent Notes
- Recent Activity

### Search & Organization
- Search Notes
- Responsive Sidebar
- Grid/List Layout
- Recent Activity Tracking

### Profile
- View Profile
- Upload Profile Picture
- Replace Profile Picture
- Remove Profile Picture
- Avatar stored in Supabase Storage

### Settings
- Dark / Light Theme
- Account Settings
- Password Management

### Other
- Responsive Design
- Mobile Friendly
- Modern UI
- Toast Notifications
- Loading States
- Error Handling

---

## 🛠 Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React

**Backend**
- Supabase
- Supabase Auth
- Supabase Database
- Supabase Storage

**Deployment**
- Vercel
- Supabase

---

## 📂 Project Structure

```text
frontend/
└── src/
    ├── components/
    ├── pages/
    ├── hooks/
    ├── context/
    ├── services/
    ├── types/
    └── utils/

backend/

supabase/
```

---

## 🚀 Installation

1. Clone the repository

```bash
git clone <repository-url>
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file

Add:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

4. Start development server

```bash
npm run dev
```

---

## 🗄 Database

Backend powered by Supabase.

**Main tables:**
- `profiles`
- `notes`

**Storage Bucket:**
- `avatars`

**Authentication:**
- Email & Password

---

## 📱 Responsive

Supports:
- Desktop
- Tablet
- Mobile

---

## 📸 Screenshots

Add screenshots here after deployment.

- Login
- Register
- Dashboard
- All Notes
- Trash
- Profile
- Settings

---

## 🔮 Future Improvements

- Rich Text Editor
- Labels & Tags
- Note Sharing
- Collaborators
- Markdown Support
- Offline Mode
- Export Notes
- Reminder Notifications

---

## 👨‍💻 Author

**Vinay Yadav**  
Computer Science Engineering Student

---

## ⭐ If you like this project, consider giving it a star.
