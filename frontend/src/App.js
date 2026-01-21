import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlayerJoin from "./pages/PlayerJoin";
import PlayerGame from "./pages/PlayerGame";
import TVDisplay from "./pages/TVDisplay";
import HostDashboard from "./pages/HostDashboard";
import DirectorPanel from "./pages/DirectorPanel";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PlayerJoin />} />
          <Route path="/player/:gameCode" element={<PlayerGame />} />
          <Route path="/tv/:gameCode" element={<TVDisplay />} />
          <Route path="/host" element={<HostDashboard />} />
          <Route path="/director/:gameCode" element={<DirectorPanel />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
