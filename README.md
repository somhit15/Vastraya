# Vastraya - Modern Indian Clothing Store

Vastraya is a production-ready, mobile-first e-commerce platform designed for the semi-urban Indian market. It features a curated collection of ethnic wear with a seamless WhatsApp-based checkout system.

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand (State Management), TanStack Query (Caching).
- **Backend:** FastAPI (Python 3.11+), Appwrite Server SDK.
- **Database & Storage:** Appwrite (Database, Storage, and Auth).
- **Checkout:** WhatsApp Business API integration for order confirmation.

## ✨ Features

- **Mobile-First Design:** Optimized for a smooth shopping experience on all devices.
- **Dynamic Catalog:** Real-time product listing and category filtering.
- **Persistent Cart:** Client-side cart with size selection and automatic persistence.
- **WhatsApp Checkout:** Pre-filled order summaries sent directly to the seller for confirmation.
- **Admin Dashboard:** Secure portal for managing inventory, categories, and image uploads.
- **Performance Optimized:** Advanced caching via TanStack Query and image optimization with Next.js.

## 🛠️ Project Structure

```text
vastraya/
├── frontend/                 # Next.js Application
│   ├── src/app/              # Routes and Layouts
│   ├── src/components/       # UI and Business Logic Components
│   ├── src/hooks/            # Custom React Hooks
│   ├── src/lib/              # API Clients and Utilities
│   └── src/store/            # Zustand State Management
├── backend/                  # FastAPI Application
│   ├── routers/              # API Route Handlers
│   ├── services/             # Business Logic and Appwrite Integration
│   ├── main.py               # Application Entry Point
│   └── config.py             # Configuration Management
└── README.md
```

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Appwrite Cloud Account

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env` based on `.env.example`.
5. Run the initialization and seed scripts:
   ```bash
   python init_appwrite.py
   python seed_data.py
   ```
6. Start the server:
   ```bash
   python main.py
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env.local` based on `.env.example`.
4. Start the development server:
   ```bash
   npm run dev
   ```

## 📄 License

This project is private and for internal use by Vastraya.
