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
import { API_BASE_URL } from '../config';
import { FaUser, FaBook, FaCommentDots, FaTags } from "react-icons/fa";

const AdminDashboard = () => {
  const [genreList, setGenreList] = useState([]);
  const [colors, setColors] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [reviewTimeline, setReviewTimeline] = useState([]); // <-- new state

  // Fetch genres/categories
  const getGenres = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/book/categories`);
      const data = await response.json();
      let structuredGenre = data.data.map((gen) => {
        return { name: gen.name, count: gen._count.books };
      });
      setColors(createRandomColors(structuredGenre.length));
      setGenreList(structuredGenre);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch stats
  const getStats = async () => {
    try {
      const booksRes = await fetch(`${API_BASE_URL}/api/book`);
      const booksData = await booksRes.json();
      setTotalBooks(booksData.pagination.totalBooks);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch review timeline for line graph
  const getReviewTimeline = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/review/timeline`);
      const data = await res.json();
      setReviewTimeline(data.data || []);
    } catch (error) {
      setReviewTimeline([]);
      console.error("Error fetching review timeline:", error);
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
    getReviewTimeline(); // <-- fetch real review timeline
  }, []);

  // Generate unlimited distinct colors
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
      <div style={{
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "6px",
  marginBottom: "24px"
}}>
  <h3 style={{
    fontSize: "2.4rem",
    fontWeight: 600,
    color: "#C9AA71",
    margin: 0
  }}>
    Dashboard
  </h3>
  <p style={{
    color: "#aaa",
    fontSize: "1.15rem",
    margin: 0
  }}>
    Here is today's report and performances
  </p>
</div>
      <div className="admin-totals">
        <div className="admin-total-box">
          <p>
            <FaUser style={{ marginRight: 8, verticalAlign: "middle" }} />
            Total Users
          </p>
          <h2>{totalUsers}</h2>
        </div>
        <div className="admin-total-box">
          <p>
            <FaBook style={{ marginRight: 8, verticalAlign: "middle" }} />
            Total Books
          </p>
          <h2>{totalBooks}</h2>
        </div>
        <div className="admin-total-box">
          <p>
            <FaCommentDots style={{ marginRight: 8, verticalAlign: "middle" }} />
            Total Reviews
          </p>
          <h2>{totalReviews}</h2>
        </div>
        <div className="admin-total-box">
          <p>
            <FaTags style={{ marginRight: 8, verticalAlign: "middle" }} />
            Total Genres
          </p>
          <h2>{genreList.length}</h2>
        </div>
      </div>

      {/* Admin Charts */}
      <div className="admin-charts">
        {/* <div className="admin-chart-box">
          <h3>Genre Distribution</h3>
          <div className="GenresPichart" style={{ width: "80%", height: 250 }}>
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
        </div> */}
        <div className="admin-chart-box">
          <h3>Review Timeline</h3>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "10px"
          }}>
            
          </div>
          <div className="ReviewsGraph" style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <LineChart
                data={reviewTimeline}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    background: "#C9AA71",
                    color: "#222",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}
                  labelStyle={{ color: "#C9AA71", fontWeight: 600 }}
                  formatter={(value, name) => [`${value} reviews`, "Done"]}
                />
                <Legend verticalAlign="top" iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#C9AA71"
                  strokeWidth={3}
                  dot={{ r: 5, stroke: "#C9AA71", strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 8, fill: "#C9AA71" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          </div>
        
        <div className="admin-chart-box">
          <h3>Genre Distribution</h3>
          <div className="GenresPichart" style={{ width: "100%", height: 250 }}>
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
                <Tooltip
                  formatter={(value, entry) => [`${value} books`, entry.name]}
                  contentStyle={{
                    background: "#fff",
                    color: "#222",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}
                  labelStyle={{ color: "#C9AA71", fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
