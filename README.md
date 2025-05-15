# ReadIt - tool to track your books

ReadIt is a minimalist web application that allows users to register physical books they've read by entering an ISBN. It fetches metadata from the LIBRIS API and provides visual statistics to help users reflect on their reading habits.

## Features
- Register an account and/or log in
- View all registered books on the main page
- Add a book by entering its ISBN (metadata is fetched automatically)
- Add reading **month**, **year**, **rating**, and **comments**
- View reading statistics:
    - In total
    - By year
    - By month (of the current year)
- Remove books from your personal library

## Important !
- **Local development happens in the `dev` branch**
- `main` branch contains the production version (**may be unstable**): https://read-it-mu.vercel.app/

## Getting started

### 1. Clone the repo

```bash
git clone [https://github.com/polyalyameow/ReadItCatalog](https://github.com/polyalyameow/ReadItCatalog.git)
cd ReadItCatalog
git checkout dev
```

### 2. Set up environment variables

```bash
DB_HOST=your_host
DB_PORT=your_port
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_db
JWT_SECRET=your_jwt_secret
```

### 3. Install dependencies and built the project

```bash
npm install
cd client
npm install
cd ..
npm run build
```

### 4. Run the project locally

### Run server
```bash
npm run start
```

### Run client
```bash
npm run dev
```

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Chakra UI
- **Backend**: Node.js, Express, Drizzle ORM, MySQL
- **APIs**: Libris API
- **Auth**: JWT
