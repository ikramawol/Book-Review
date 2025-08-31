# 📚 Book Review Platform  

## 📖 Project Overview and Objectives  
The **Book Review Platform** is a full-stack web application that allows users to:  
- Browse books and read reviews.  
- Add their own book reviews and ratings.  
- View community feedback on different books.  
- Search and filter books for easy discovery.  

**Objectives:**  
- Provide a user-friendly interface for discovering and reviewing books.  
- Encourage readers to share opinions and connect over literature.  
- Practice building and deploying a full-stack application using modern technologies.  



## 🚀 Instructions for Running  

### Prerequisites  
Make sure you have installed:  
- **Node.js** (v16 or above)  
- **npm** or **yarn**  
- **Database** (e.g., MongoDB/MySQL/PostgreSQL depending on what you used)  

### Steps to Run Locally  
1. **Clone the repository:**  
   ```bash
   git clone https://github.com/your-username/book-review-platform.git
   cd book-review-platform
2.**Install dependencies:**
   npm install

3.**Set up enviroment variables:**
Create a .env file in the root directory and add:
DATABASE_URL=your_database_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
4.**Run the development server:**
npm run dev
5.**Open your browser at:**
http://localhost:3000

🛠Technologies and Tools Used
**Front-end:**
React for framework
VS-code :for editor
Figma:for design
**Back-end:**
Postgress database on Neon database
Next.js 
Cloudinary for image upload
OAuth( google) 
Role-based access control
Zod for error handling
Bcrypt for password hashing
Rate limiter
**other tools:**
JWT authentication
Git & GitHub for version control
Prisma ORM

**👥 Team Members and Contributions**
[Samuel Tadesse] – Frontend Developer (UI design, React components)
[Ikram Awol ] – Backend Developer (API design, authentication, database integration)
[Ashenafi Tesfaye] – Documentation,Frontend  & Testing (README, test cases)

**📝 Additional Notes**
Known Issues:
Search may return limited results for some queries.
Review moderation is not yet implemented.

Future Enhancements:
Add social features (likes, comments, sharing).
Implement recommendation system for personalized book suggestions.
Improve mobile responsiveness and accessibility.
Add support for multiple languages.





