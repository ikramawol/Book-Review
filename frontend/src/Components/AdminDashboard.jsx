import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

const AdminDashboard = () => {
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

  const COLORS = ["#C9AA71", "#8E6C3A", "#F5D49C", "#A07C4A", "#D3B88C", "#7C5A30"];

  return (
    <div className="dashboard">
      <div className="highlights">
        <p>Books</p>
        <p>{sampleData.books.toLocaleString()}</p>
      </div>
      <div className="highlights">
        <p>Users</p>
        <p>{sampleData.users}</p>
      </div>
      <div className="highlights">
        <p>Genres</p>
        <div className="GenresPichart" style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={sampleData.genres}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {sampleData.genres.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
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
