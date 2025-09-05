import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

const AdminDashboard = () => {

  // FIX THIS LATER
  // fix the ui for users and books numbers and get them from the backend


  let sampleData = {
    users: 300,
    books: 1200,
    genres: [
      { name: "Romance", count: 120 },
      { name: "Horror", count: 80 },
      { name: "Action", count: 200 },
      { name: "Mystery", count: 95 },
      { name: "History", count: 50 },
      { name: "Fantasy", count: 150 } // You can add more or remove
    ],
    reviews: [
      { date: "Oct W1", no: 25 },
      { date: "Oct W2", no: 55 },
      { date: "Oct W3", no: 32 },
      { date: "Oct W4", no: 88 },
      { date: "Nov W1", no: 15 }
    ]
  };
  let COLORS = ["#C9AA71", "#8E6C3A", "#F5D49C", "#A07C4A", "#D3B88C", "#7C5A30"];

  const [genreList, setGenreList] = useState([
    { name: "Romance", count: 120 },
      { name: "Horror", count: 80 },
      { name: "Action", count: 200 },
      { name: "Mystery", count: 95 },
      { name: "History", count: 50 },
      { name: "Fantasy", count: 150 } 
  ]);
  const [colors, setColors] = useState([]);

  const getGenres = async  () => {
    try {
      // const response = await fetch(`http://localhost:3000/api/book/categories`)
      const response = await fetch(`/api/book/categories`)
      response.json().then(data=>{
        let structuredGenre = data.data.map(gen =>{ return{name: gen.name, count: gen._count.books + 1}})
        console.log(structuredGenre)
        setColors(createRandomColors(structuredGenre.length))
        setGenreList(structuredGenre)
      })
    } catch (error) {
      
    }
  }

  const [totalBooks, setTotalBooks] = useState(0);
const [totalReviews, setTotalReviews] = useState(0);
const [totalUsers, setTotalUsers] = useState(0);

const getStats = async () => {
  try {

    // const response = await fetch(`/api/book`)
    //   response.json().then(data => {
    //     console.log(data.data)
    //     setBooks(data.data)
    //   })

    const booksRes = await fetch("/api/book");
    const booksData = await booksRes.json();
    setTotalBooks(booksData.pagination.totalBooks)
    // setTotalBooks(booksData.data?.length || 0);

    // const reviewsRes = await fetch("/api/review");
    // const reviewsData = await reviewsRes.json();
    // console.log(reviewsData)
    // setTotalReviews(reviewsData.data?.length || 0);

    // const usersRes = await fetch("/api/user");
    // const usersData = await usersRes.json();
    // console.log(usersData)
    // setTotalUsers(usersData.data?.length || 0);
  } catch (error) {
    console.error("Error fetching stats:", error);
  }
};

  useEffect(() => {
    getStats();
    getGenres();
  }, []);

  function createRandomColors(numColors) {
    let newColors = [];
    for (let i = 0; i < numColors; i++) {
      const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      newColors.push(randomColor);
    }
    return newColors;
  }

  

  return (
    <div className="dashboard">
      <div className="highlights">
        <p>Books</p>
        <p>{totalBooks}</p>
      </div>
      {/* <div className="highlights">
        <p>Users</p>
        <p>{sampleData.users}</p>
      </div> */}
      <div className="highlights">
        <p>Genres</p>
        <div className="GenresPichart" style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={genreList}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="70%"
                label
              >
                {genreList.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % COLORS.length]} />
                ))}
              </Pie>
              {/* <Tooltip /> */}
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="highlights">
        <p>Reviews</p>
        <div className="ReviewsGraph" style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <LineChart data={sampleData.reviews}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="no" stroke="#C9AA71" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
