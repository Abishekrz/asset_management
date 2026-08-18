import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Categories from "./pages/Categories";
import Assets from "./pages/Assets";
import Issues from "./pages/Issues";
import ScrapedAssets from "./pages/ScrapedAssets";
import AIAssistant from "./pages/AIAssistant";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/scraped-assets" element={<ScrapedAssets />} />
          <Route path="/ai" element={<AIAssistant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;