# 📚 Book Review Platform

A modern full-stack web application for discovering, reviewing, and sharing opinions about books.

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Running the App](#running-the-app)
- [Usage](#usage)
- [Contributing](#contributing)
- [Team](#team)
- [Known Issues](#known-issues)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Overview
Demo Video: https://drive.google.com/file/d/1QQDrb3kZvHHkubjlH_i6Sft1q-X1Wp_e/view?usp=drive_link
The **Book Review Platform** allows users to:
- Browse books and read community reviews.
- Submit their own reviews and ratings.
- Search and filter books for easy discovery.
- View feedback from other readers.

**Project Objectives:**
- Build an intuitive interface for discovering and reviewing books.
- Connect readers and foster literary discussion.
- Practice deploying a modern full-stack application.

---

## Features

- 🔍 **Book Search & Filtering:** Quickly find books by title, author, or genre.
- ⭐ **Ratings & Reviews:** Add and read book reviews with ratings.
- 🛡️ **Authentication:** Secure login and registration (OAuth & JWT).
- 🖼️ **Image Uploads:** Add book covers using Cloudinary.
- ⏳ **Rate Limiting:** Protect API endpoints from abuse.
- 🛠️ **Role-Based Access Control:** Admin/moderator features.
- 🧩 **Responsive Design:** Works across devices (planned).
- 🌐 **Internationalization:** Multi-language support (planned).

---

## Tech Stack

**Front-end:**
- React
- Next.js
- Figma (Design)
- VS Code (Editor)

**Back-end:**
- Node.js
- Prisma ORM
- PostgreSQL (Neon database)
- Cloudinary (image upload)
- OAuth (Google)
- JWT Authentication
- Bcrypt (password hashing)
- Zod (validation/error handling)
- Rate Limiter

**DevOps & Other Tools:**
- Git & GitHub (version control)

---

## Getting Started

### Prerequisites

- **Node.js** (v16+)
- **npm** or **yarn**
- **Database**: PostgreSQL (Neon or local)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ikramawol/Book-Review.git
   cd Book-Review
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

### Environment Setup

1. **Create a `.env` file in the root directory:**
   ```
   DATABASE_URL=your_database_connection_string
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```

### Running the App

1. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Open your browser at:**
   ```
   http://localhost:3000
   ```

---

## Usage

- Register or log in using Google OAuth or email/password.
- Browse the book catalog.
- Add reviews and ratings.
- Search/filter books.
- (Admins) Moderate content (planned).

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

1. Fork the repo & create your branch (`git checkout -b feature/fooBar`)
2. Commit your changes (`git commit -am 'Add some fooBar'`)
3. Push to the branch (`git push origin feature/fooBar`)
4. Open a Pull Request

---

## Team

- **Samuel Tadesse** – Frontend Developer (UI design, React components)
- **Ikram Awol** – Backend Developer (API design, authentication, database integration)
- **Ashenafi Tesfaye** – Documentation, Frontend & Testing (README, test cases)

---

## Known Issues

- Search may return limited results.
- Review moderation not yet implemented.

---

## Future Enhancements

- Social features (likes, comments, sharing)
- Recommendation system for personalized book suggestions
- Improved mobile responsiveness and accessibility
- Multi-language support

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
