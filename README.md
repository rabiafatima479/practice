# 📋 Advanced Task Management Dashboard

A fully responsive, feature-rich Task Management Dashboard built with **HTML5**, **CSS3**, and **Vanilla JavaScript**. It helps users organize, search, filter, and track their daily tasks efficiently with persistent storage.

---

## 🚀 Features

- **Add & Edit Tasks**: Create tasks with a Title, optional Description, Priority (Low, Medium, High), and Due Date. Edit existing tasks without creating duplicates.
- **Robust Validation**: 
  - Prevents empty titles or blank spaces.
  - Ensures priority is selected.
  - Restricts due dates from being set in the past.
- **Task Status Tracking**: Toggle between `Pending` and `Completed` statuses with visual indicators.
- **Real-Time Statistics**: Automatically updates counts for Total Tasks, Pending Tasks, Completed Tasks, and High Priority Tasks.
- **Search, Filter & Sort**:
  - **Search**: Real-time search by task title.
  - **Filters**: Filter tasks by Status (All / Pending / Completed) and Priority (All / Low / Medium / High). Simultaneous search and filter support.
  - **Sorting**: Sort tasks by Newest, Oldest, Due Date, or Priority.
- **LocalStorage Integration**: Data persists across browser page refreshes.
- **Dynamic Empty States**: Contextual messages when no tasks exist or when search/filter queries yield no results.
- **Responsive Design**: Optimized layout for both desktop and mobile screens.

---

## 🛠️ Built With

- **HTML5**: Semantic markup structure.
- **CSS3**: Modern styling using CSS Grid and Flexbox.
- **JavaScript (ES6+)**: DOM manipulation, event handling, and state management.
- **LocalStorage API**: For client-side data persistence.

---

## 📁 Project Structure

```text
WTQ/
│
├── index.html       # Main application layout
├── style.css        # Dashboard styles and responsive design
├── script.js        # Core logic, validation, search, filter, and storage
└── README.md        # Project documentation
