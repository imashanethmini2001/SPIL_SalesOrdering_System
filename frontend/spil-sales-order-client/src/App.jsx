import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SalesOrder from "./pages/SalesOrder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sales-order" element={<SalesOrder />} />
        <Route path="/sales-order/:id" element={<SalesOrder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;