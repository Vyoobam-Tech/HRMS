// App.jsx
import React, { useState } from "react";
// import Reports from "./pages/Reports";
import TimeTracker from "./TimeTracker";
import Attendance from "./TimeTracker";

const employeesData = [
  { id: 12345, name: "John Doe" },
  { id: 12346, name: "Jane Smith" },
];

function App() {
  const [employees, setEmployees] = useState(employeesData);

  return (
    <div
      style={{
        height: 450,
        width: 820,
        marginRight: "60px",
        paddingTop: "140px",
        marginLeft: "30px",
      }}
    >
      <h1>Attendance Tracker</h1>
      <Attendance employees={employees} setEmployees={setEmployees} />
      {/* <Reports employees={employees} /> */}
    </div>
  );
}

export default App;
