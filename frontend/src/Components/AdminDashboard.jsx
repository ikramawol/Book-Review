import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const AdminDashboard = () => {
  const [genreList, setGenreList] = useState([]);
  const [colors, setColors] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const sampleData = {
    reviews: [
      { date: "Oct W1", no: 25 },
      { date: "Oct W2", no: 55 },
      { date: "Oct W3", no: 40 },
      { date: "Oct W4", no: 88 },
      { date: "Nov W1", no: 15 },
    ],
  };

  // ✅ Fetch genres/categories
  const getGenres = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/book/categories`);
      const data = await response.json();

      // Assuming your API returns categories like:
      // [{ name: "Romance", _count: { books: 5 } }]
      let structuredGenre = data.data.map((gen) => {
        return { name: gen.name, count: gen._count.books };
      });

      setColors(createRandomColors(structuredGenre.length));
      setGenreList(structuredGenre);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // ✅ Fetch stats
  const getStats = async () => {
    try {
      const booksRes = await fetch(`${API_BASE_URL}/api/book`);
      const booksData = await booksRes.json();
      setTotalBooks(booksData.pagination.totalBooks);

      // Example if you add later:
      // const reviewsRes = await fetch("/api/review");
      // const reviewsData = await reviewsRes.json();
      // setTotalReviews(reviewsData.data?.length || 0);

      // const usersRes = await fetch("/api/user");
      // const usersData = await usersRes.json();
      // setTotalUsers(usersData.data?.length || 0);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    getStats();
    getGenres();

    // Fetch total reviews directly from DB
    const fetchReviewsCount = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/review/count`);
        const data = await res.json();
        setTotalReviews(data.totalReviews || 0);
      } catch (error) {
        setTotalReviews(0);
      }
    };

    // Fetch total users
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user`);
        const data = await res.json();
        setTotalUsers(data.pagination?.totalUsers || data.data?.length || 0);
      } catch (error) {
        setTotalUsers(0);
      }
    };

    fetchReviewsCount();
    fetchUsers();
  }, []);

  // ✅ Generate unlimited distinct colors
  function createRandomColors(numColors) {
    let newColors = [];
    for (let i = 0; i < numColors; i++) {
      const randomColor =
        "#" +
        Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0");
      newColors.push(randomColor);
    }
    return newColors;
  }

  return (
    <div className="dashboard">
     

      {/* Admin Totals */}
      <div className="admin-totals">
        <div className="admin-total-box">
          <p>Total Users</p>
          <h2>{totalUsers}</h2>
        </div>
        <div className="admin-total-box">
          <p>Total Books</p>
          <h2>{totalBooks}</h2>
        </div>
        <div className="admin-total-box">
          <p>Total Reviews</p>
          <h2>{totalReviews}</h2>
        </div>
        <div className="admin-total-box">
          <p>Total Genres</p>
          <h2>{genreList.length}</h2>
        </div>
      </div>

      {/* Admin Charts */}
      <div className="admin-charts">
        <div className="admin-chart-box">
          <h3>Genre Distribution</h3>
          <div className="GenresPichart" style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={genreList}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  labelLine={false}
                  // Custom label in the center
                  label={() => (
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={48}
                      fontWeight={600}
                      fill="#C9AA71"
                    >
                      {genreList.length}
                    </text>
                  )}
                >
                  {genreList.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="admin-chart-box">
          <h3>Reviews Over Time</h3>
          <div className="ReviewsGraph" style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <LineChart
                data={sampleData.reviews}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    background: "#222",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#C9AA71" }}
                />
                <Legend
                  verticalAlign="top"
                  iconType="circle"
                  wrapperStyle={{ top: 0, left: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="no"
                  stroke="#C9AA71"
                  strokeWidth={3}
                  dot={{ r: 5, stroke: "#C9AA71", strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 8, fill: "#C9AA71" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
