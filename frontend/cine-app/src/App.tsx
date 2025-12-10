import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import "./Globals.css";
import MovieDetail from "./components/MovieDetail/MovieDetail";
import About from "./components/About/About";
import PersonDetail from "./components/PersonDetail/PersonDetail";
import Loader from "./components/Loader/Loader";
import ScrollToTop from "./ScrollToTop";
import SeriesDetail from "./components/WebSeries/SeriesDetail";
import SearchResult from "./components/SearchResult/SearchResult";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col bg-bg-primary text-text-primary">
        <Navbar />
        <main className="flex-auto overflow-y-auto hide-scrollbar">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id/:slug" element={<MovieDetail />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/movie/:movieId/person/:personId/:slug"
              element={<PersonDetail />}
            />
            <Route
              path="/webseries/:seriesId/person/:personId/:slug"
              element={<PersonDetail />}
            />
            <Route path="/person/:personId/:slug" element={<PersonDetail />} />
            <Route path="/webseries/:id/:slug" element={<SeriesDetail />} />
            <Route path="/results/:slug" element={<SearchResult />} />
            <Route path="/results/:slug/:slug" element={<SearchResult />} />
            <Route path="/results" element={<SearchResult />} />
          </Routes>
          <Loader />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
