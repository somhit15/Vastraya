# Vastraya Architecture & Technical Specification

## 1. Monorepo Folder Structure
```text
vastraya/
├── frontend/                 # Next.js 14 (App Router)
│   ├── public/               # Static assets (logos, icons)
│   ├── src/
│   │   ├── app/              # Routes & Layouts
│   │   │   ├── (shop)/       # Customer-facing routes
│   │   │   ├── admin/        # Admin panel routes
│   │   │   └── layout.tsx
│   │   ├── components/       # UI & Business components
│   │   ├── lib/              # Appwrite Client SDK
│   │   ├── store/            # Zustand (Cart state)
│   │   └── types/            # TypeScript definitions
│   ├── next.config.js
│   └── package.json
├── backend/                  # FastAPI App
│   ├── app/
│   │   ├── api/              # API Route handlers
│   │   ├── core/             # Config, Security
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Appwrite Server SDK logic
│   │   └── main.py           # Entry point
│   ├── requirements.txt
│   └── .env
├── shared/                   # Shared types
└── README.md
```

## 2. Appwrite Schema (Collections)
Instead of SQL, we use Appwrite Databases.

### Collection: categories
- **name**: string
- **slug**: string (unique)
- **image_url**: string (optional)

### Collection: products
- **name**: string
- **slug**: string (unique)
- **description**: string (large)
- **price**: double
- **sale_price**: double (optional)
- **sizes**: string array
- **category_id**: string (relationship or string ID)
- **images**: string array
- **stock_status**: string
- **is_featured**: boolean

## 3. API Endpoint Map
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service health check |
| `GET` | `/api/v1/products` | List products (via Appwrite SDK) |
| `GET` | `/api/v1/categories` | List all categories |
| `POST` | `/api/v1/admin/login` | Session creation via Appwrite |
| `POST` | `/api/v1/admin/products`| Create product (Protected) |
| `POST` | `/api/v1/admin/upload` | Upload to Appwrite Storage |

## 5. Environment Variables List

### Frontend (`frontend/.env.example`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```

### Backend (`backend/.env.example`)
```env
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_API_KEY=your-secret-api-key
APPWRITE_DATABASE_ID=vastraya
APPWRITE_PRODUCTS_COLLECTION_ID=products
APPWRITE_CATEGORIES_COLLECTION_ID=categories
APPWRITE_BUCKET_ID=product-images
```
