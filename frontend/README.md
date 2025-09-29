# HawkerSG Frontend Setup

### 1. Prerequisites

* Node.js (v16 or higher)
* npm or yarn

### 2. Setup and Installation

1.  **Navigate to the Frontend Directory:**
    Assuming your project structure has a separate directory for the frontend (e.g., `/frontend`):
    ```bash
    cd ../frontend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the Development Server:**
    Navigate to **`http://localhost:5173`**.

    ```bash
    npm run dev
    # or
    yarn start
    ```

### 3. Backend Integration

The frontend is configured to communicate with the backend API running at **`http://localhost:8001`**.

***

## 🌐 Project Structure
```
/src
├── /components
│   └── ... (Reusable UI components)
├── /contexts
├── /pages
├── App.tsx
└── index.tsx
```