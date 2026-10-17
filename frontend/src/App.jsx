import { BrowserRouter, Routes, Route } from "react-router-dom";
import Marketplace from "./pages/Marketplace";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Marketplace />} />
        {/*<Route path="/admin/login" element={<AdminLogin />} />*/}
      </Routes>
    </BrowserRouter>
  );
}
