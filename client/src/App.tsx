import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/home";
import ChatDashboard from "./pages/chats";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route index path="/chats" element={<ChatDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
