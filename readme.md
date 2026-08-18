# AI-Powered Asset Management System

A full-stack asset management application built with **React.js, Node.js, Express.js, PostgreSQL, and a voice-based AI assistant**.

The system helps organizations manage employees, assets, categories, asset issues, returns, and scrap records through a web-based interface. It also includes an AI voice assistant that allows users to navigate and interact with the application using natural-language voice commands.

---

## 🚀 Features

### 📊 Dashboard

- Overview of the asset management system
- Employee statistics
- Asset statistics
- Asset status information
- Issue and return information

### 👨‍💼 Employee Management

- Add employees
- Edit employee details
- Activate / deactivate employees
- Search employees
- Check duplicate employee email addresses
- Search employees by name

### 💻 Asset Management

- Add assets
- Edit asset details
- Track asset status
- Maintain asset serial numbers
- Record manufacturer and model information
- Track purchase date and purchase price
- Track warranty information
- Manage asset categories

### 🗂️ Category Management

- Create asset categories
- Edit categories
- Search categories
- Prevent duplicate category names

### 📦 Asset Issue Management

- Issue assets to employees
- Track issued assets
- Maintain issue history
- Record issue and return information
- Track asset status

### 🔄 Asset Return Management

- Return issued assets
- Maintain return history
- Update asset availability after return

### ♻️ Scrap Management

- Track scrapped assets
- Maintain scrap records
- Manage asset lifecycle

### 🤖 AI Voice Assistant

The application includes a voice-based AI assistant that allows users to interact with the system using natural-language commands.

Example commands:

```text
"Open employees"

"Show assets"

"Go to categories"

"Show issue history"

"Find employee Rahul"

"Show issued assets"
```

The AI agent processes commands through multiple stages:

```text
Voice Input
     ↓
Speech Recognition
     ↓
Text Correction
     ↓
Intent Detection
     ↓
Entity Extraction
     ↓
Normalization
     ↓
Validation
     ↓
Action / Navigation
```

The AI assistant is designed to understand user intent and convert natural-language commands into structured operations.

---

## 🏗️ System Architecture

```text
                    User
                     │
                     ▼
             ┌───────────────┐
             │ React Frontend│
             └───────┬───────┘
                     │
                     │ HTTP / API
                     ▼
             ┌───────────────┐
             │ Node.js       │
             │ Express.js    │
             └───────┬───────┘
                     │
             ┌───────┴────────┐
             │                │
             ▼                ▼
      ┌─────────────┐   ┌──────────────┐
      │ PostgreSQL  │   │ AI Assistant │
      │  Database   │   │   Service    │
      └─────────────┘   └──────────────┘
                              │
                              ▼
                       Voice / AI Pipeline
```

---

## 🧠 AI Agent Architecture

The AI assistant is implemented as a separate Python-based service.

```text
                    Voice Command
                          │
                          ▼
                  Speech Recognition
                          │
                          ▼
                  Correction Service
                          │
                          ▼
                   Intent Service
                          │
                          ▼
                 Extraction Service
                          │
                          ▼
                Normalization Service
                          │
                          ▼
                 Validation Service
                          │
                          ▼
                  Execution / Action
```

### AI Agent Services

| Service | Responsibility |
|---|---|
| `correction_service` | Corrects speech recognition errors |
| `intent_service` | Determines the user's intended operation |
| `extraction_service` | Extracts entities and parameters |
| `normalizer_service` | Normalizes extracted values |
| `validation_service` | Validates the generated operation |
| `execution_service` | Executes the validated operation |
| `workflow_service` | Handles multi-step workflows |
| `pipeline_service` | Coordinates the complete AI pipeline |

---

## 🛠️ Technology Stack

### Frontend

- React.js
- JavaScript
- HTML
- CSS
- Vite
- Axios
- React Router

### Backend

- Node.js
- Express.js
- Sequelize ORM
- Jade
- REST APIs
- Multer

### Database

- PostgreSQL

### AI / Voice

- Python
- Speech recognition
- Natural-language intent detection
- Entity extraction
- Text normalization
- Command validation
- Voice processing

### Development Tools

- Git
- GitHub
- VS Code
- Postman

---

## 📁 Project Structure

```text
asset_management/
│
├── config/
│   └── database.js
│
├── controllers/
│   ├── aiController.js
│   ├── assetController.js
│   ├── categoryController.js
│   ├── dashboardController.js
│   ├── employeeController.js
│   ├── issueController.js
│   ├── scrapeController.js
│   └── voiceController.js
│
├── database/
│   └── config.js
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── migrations/
│
├── models/
│   ├── asset.js
│   ├── category.js
│   ├── employee.js
│   ├── issue.js
│   ├── scrape.js
│   └── index.js
│
├── public/
│   └── js/
│
├── routes/
│   ├── ai.js
│   ├── asset.js
│   ├── category.js
│   ├── dashboard.js
│   ├── dashboardapi.js
│   ├── employee.js
│   ├── issue.js
│   ├── scrape.js
│   └── voice.js
│
├── services/
│   ├── assetService.js
│   ├── baseService.js
│   ├── categoryService.js
│   ├── employeeService.js
│   ├── issueService.js
│   ├── scrapeService.js
│   └── ...
│
├── views/
│   ├── asset/
│   ├── category/
│   ├── employee/
│   ├── issue/
│   └── scrape/
│
├── uploads/
│
├── app.js
├── package.json
├── package-lock.json
├── query.sql
├── .sequelizerc
└── readme.md
```

The AI agent is maintained as a separate Python service/repository.

---

## 🗄️ Database

The application uses PostgreSQL with Sequelize ORM.

Main entities include:

```text
Employee
   │
   │
   └──── Asset Issue
            │
            ▼
          Asset
            │
            ▼
        Category
```

### Main Tables

- `employee_table`
- `asset_table`
- `category_table`
- Issue-related tables
- Scrape-related tables

The database layer is handled through Sequelize models and migrations.

---

## ⚙️ Environment Variables

Create a `.env` file in the backend project:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=asset_management
DB_USER=postgres
DB_PASSWORD=your_password
```

The `.env` file should never be committed to GitHub.

---

## ▶️ Running the Backend

Clone the repository:

```bash
git clone https://github.com/Abishekrz/asset_management.git
```

Move into the project:

```bash
cd asset_management
```

Install dependencies:

```bash
npm install
```

Configure the PostgreSQL database and `.env` file.

Start the application:

```bash
npm start
```

---

## ▶️ Running the React Frontend

Move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server will provide the frontend URL in the terminal.

---

## 🔊 Voice Assistant Workflow

The voice assistant follows a structured pipeline instead of directly executing commands from speech.

For example:

```text
User:
"Open the employee page"
          │
          ▼
Speech-to-Text
          │
          ▼
"open the employee page"
          │
          ▼
Correction
          │
          ▼
Intent Detection
          │
          ▼
navigate_page
          │
          ▼
Entity / Parameter Extraction
          │
          ▼
Validation
          │
          ▼
/employee
```

This separation makes the AI assistant easier to test, debug, and extend.

---

## 🔐 Validation and Error Handling

The application performs validation before executing AI-generated operations.

The pipeline checks:

- Whether an intent is recognized
- Whether required parameters are present
- Whether extracted entities are valid
- Whether the requested operation is supported
- Whether duplicate records exist
- Whether referenced employees/assets exist

Invalid operations are rejected before reaching the execution layer.

---

## 🔄 Asset Lifecycle

The system supports the following asset lifecycle:

```text
                 ┌───────────┐
                 │ IN STOCK  │
                 └─────┬─────┘
                       │
                       ▼
                 ┌───────────┐
                 │  ISSUED   │
                 └─────┬─────┘
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
        ┌──────────┐       ┌──────────┐
        │ RETURNED │       │  SCRAP   │
        └────┬─────┘       └──────────┘
             │
             ▼
        ┌───────────┐
        │ IN STOCK  │
        └───────────┘
```

Additional asset states such as repair and other lifecycle states can be managed through the asset status system.

---

## 🎯 Project Goals

The main goals of the project are:

1. Simplify organizational asset management.
2. Centralize employee and asset information.
3. Track the complete lifecycle of assets.
4. Reduce manual navigation through voice commands.
5. Provide a structured AI command-processing pipeline.
6. Maintain a scalable separation between frontend, backend, database, and AI services.

---

## 🔮 Future Improvements

Potential future improvements include:

- Cloud deployment
- Object/file storage
- Authentication and role-based access control
- Real-time notifications
- Background job processing
- Caching
- Advanced search
- Analytics and reporting
- Containerized deployment
- Monitoring and logging
- Improved natural-language command understanding

---

## 👨‍💻 Author

**Abishek R S**

B.Tech – Information Technology

GitHub: https://github.com/Abishekrz

---

## 📌 Repository

https://github.com/Abishekrz/asset_management
