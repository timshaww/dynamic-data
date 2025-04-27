# Task Manager

A Trello-style task management application built with Express, Handlebars, and Tailwind CSS.

## Features

- Create and manage multiple to-do lists
- Add tasks to lists with descriptions and due dates
- Mark tasks as complete
- Clean and modern UI with Tailwind CSS
- SQLite database with Sequelize ORM

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
task-manager/
├── models/           # Database models
├── routes/           # Express routes
├── views/            # Handlebars templates
│   ├── layouts/      # Layout templates
│   └── partials/     # Reusable components
├── public/           # Static assets
├── app.js            # Main application file
└── package.json      # Project dependencies
```

## Usage

1. Visit the home page to see the latest lists and app information
2. Navigate to the Lists page to view all lists
3. Use the Admin page to:
   - Create new lists
   - Delete existing lists
   - Add tasks to lists
   - Delete tasks

## License

MIT 