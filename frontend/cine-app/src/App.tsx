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
import SignUp from "./components/SignUp/SignUp";
import Login from "./components/LogIn/LogIn";
import { PrivacyPolicy, TermsAndConditions } from "./components/PolicyPages/Policy";
// import LogoutButton from "./components/Logout/Logout";

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
              path="/tv/:seriesId/person/:personId/:slug"
              element={<PersonDetail />}
            />
            <Route path="/person/:personId/:slug" element={<PersonDetail />} />
            <Route path="/tv/:id/:slug" element={<SeriesDetail />} />
            <Route path="/results/:slug" element={<SearchResult />} />
            <Route path="/results/:slug/:slug" element={<SearchResult />} />
            <Route path="/results" element={<SearchResult />} />
            <Route path="/sign-up" element={<SignUp/>}/>
            <Route path="/log-in" element={<Login/>}/>
            <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
            <Route path="/terms" element={<TermsAndConditions/>}/>
            {/* <Route path="/log-out" element={<LogoutButton/>}/> */}
          </Routes>
          <Loader />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
