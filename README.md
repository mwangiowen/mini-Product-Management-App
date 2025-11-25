# Mini Product Management App

**Responsive Vue 3 Product Management Application**

A modern, fully responsive product management app with mobile drawer sidebar, user authentication, and CRUD operations.

## 🚀 Quick Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Login with test credentials**
   - **Username**: `emilys`
   - **Password**: `emilyspass`

## 📱 Responsive Features

- **Mobile Drawer Sidebar**: Hamburger menu in navbar toggles sidebar on mobile
- **Responsive Layout**: Adapts to all screen sizes (mobile, tablet, desktop)
- **Touch-Friendly**: Optimized for mobile interactions
- **Notifications**: Hidden on mobile for cleaner interface

## 🛠 Tech Stack

- Vue 3 + Vite
- Tailwind CSS
- Pinia (State Management)
- Vue Router
- DummyJSON API

## 📁 Structure

```
src/
├── components/     # Navbar, Sidebar, Toast
├── views/         # Login, Products, Dashboard
├── stores/        # Auth, Products, Sidebar state
└── router/        # Route configuration
```

## 🔧 Configuration

**No environment setup needed** - uses DummyJSON public API and localStorage for session persistence.

## 🎯 Key Assumptions

- Modern browser with JavaScript enabled
- Internet connection for API calls
- DummyJSON mock data (products added/edited are simulated)
- JWT tokens expire in 30 minutes (DummyJSON default)
