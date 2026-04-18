import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Plans from "./pages/Plans";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/plans" element={<Plans />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
