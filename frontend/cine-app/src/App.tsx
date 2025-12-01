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

function App() {
  return (
    <Router>
      <ScrollToTop/>
      <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
        <Navbar />
        <main className="flex-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id/:slug" element={<MovieDetail />} />
            <Route path="/About" element={<About/>}/>
            <Route path="/movie/:movieId/person/:personId/:slug" element={<PersonDetail/>} />
            <Route path="/webseries/:seriesId/person/:personId/:slug" element={<PersonDetail/>} />
            <Route path="/webseries/:id/:slug" element={<SeriesDetail/>} />
          </Routes>
          <Loader/>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;