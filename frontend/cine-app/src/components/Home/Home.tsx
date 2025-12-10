import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  storeData,
  type MovieType,
} from "../../Redux/MoviesSlice/PopularMovies";
import type { RootState } from "../../Redux/Store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { hideLoader, showLoader } from "../../Redux/LoaderSlice/LoaderSlice";
import {
  storeSeries,
  type SeriesDataType,
} from "../../Redux/SeriesSlice/PopularSeriesSlice";
import HomeTop from "../HomeTop/HomeTop";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w1280";

function Home() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchedData = useSelector(
    (state: RootState) => state.popularMovies.data
  );
  const fetchedSeriesData = useSelector(
    (state: RootState) => state.seriesData.seriesData
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSeriesIndex, setCurrentSeriesIndex] = useState(0);

  useEffect(() => {
    async function getTopMovies() {
      if (fetchedData.length > 0) return;

      try {
        dispatch(showLoader());
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
        );
        if (!res.ok) throw new Error("Failed to fetch movies");

        const data = await res.json();
        dispatch(storeData(data.results));
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        dispatch(hideLoader());
      }
    }

    getTopMovies();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function getTopSeries() {
      if (fetchedSeriesData.length > 0) return;

      try {
        fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            const topSeries = data.results;
            dispatch(storeSeries(topSeries));
          })
          .then((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    }

    getTopSeries();
  }, []);

  // console.log(seriesList)

  const goToPrevious = () => {
    if (fetchedData.length === 0) return;
    setCurrentIndex((prev) =>
      prev === 0 ? Math.floor(fetchedData.length / 5) - 1 : prev - 1
    );
  };

  const goToNext = () => {
    if (fetchedData.length === 0) return;
    setCurrentIndex((prev) =>
      prev === Math.floor(fetchedData.length / 5) - 1 ? 0 : prev + 1
    );
  };

  const goToPreviousSeries = () => {
    if (fetchedSeriesData.length === 0) return;
    setCurrentSeriesIndex((prev) =>
      prev === 0 ? Math.ceil(fetchedSeriesData.length / 5) - 1 : prev - 1
    );
  };

  const goToNextSeries = () => {
    if (fetchedSeriesData.length === 0) return;
    setCurrentSeriesIndex((prev) =>
      prev === Math.ceil(fetchedSeriesData.length / 5) - 1 ? 0 : prev + 1
    );
  };

  const handleMovieClick = (movie: MovieType) => {
    const slug = movie.title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/movie/${movie.id}/${slug}`);
  };

  const handleSeriesClick = (series: SeriesDataType) => {
    const slug = series.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/webseries/${series.id}/${slug}`);
  };

  return (
    <>
    <HomeTop/>
      {/* Top Movies */}
      <div className="relative w-full mt-5 lg:mt-0 overflow-hidden flex justify-center p-2">
        <div className="relative overflow-hidden w-full max-w-7xl">
          <div className="flex items-center justify-between mb-2 lg:mb-6">
            <h1 className="text-lg md:text-2xl lg:text-4xl ml-2 font-bold">Top Movies</h1>
            {/* MOBILE NAVIGATION (below slider) */}
            <div className="flex lg:hidden gap-2">
              <button
                onClick={goToPrevious}
                className="text-text-primary cursor-pointer p-3 rounded-full"
              >
                <ChevronLeft />
              </button>

              <button
                onClick={goToNext}
                className="text-text-primary p-3 cursor-pointer rounded-full"
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {fetchedData.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => handleMovieClick(movie)}
                  className="
                  px-2 shrink-0
                  w-1/5  
                "
                >
                  <div className="relative cursor-pointer overflow-hidden shadow-lg">
                    <img
                      src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-contain"
                    />
                    {/* <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black via-black/70 to-transparent text-white">
                      <h3 className="text-lg md:text-lg font-bold truncate">
                        {movie.title}
                      </h3>
                    </div> */}
                  </div>
                </div>
              ))}
              </div>

              {/* Navigation */}
              <div className="absolute h-full right-0 top-1/2 transform translate-x-1/3 -translate-y-1/2 lg:-translate-y-1/2 lg:translate-x-0 bg-linear-to-l from-black to-transperent via-black/80 lg:from-black lg:via-black/65 via-40% flex-col items-center justify-center gap-1 lg:gap-2 lg:p-1 transition-all duration-300 ease-out hover:from-black lg:opacity-0 lg:hover:opacity-100 lg:flex hidden">
                <button
                  onClick={goToPrevious}
                  className="text-white p-2 cursor-pointer rounded-full"
                >
                  <ChevronLeft />
                </button>
                <div className="w-6 h-px" />
                <button
                  onClick={goToNext}
                  className="text-white p-2 cursor-pointer rounded-full"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Top Series */}
      <div className="relative w-full lg:mt-25 overflow-hidden flex justify-center p-2">
        <div className="relative overflow-hidden w-full max-w-7xl">
          <div className="flex items-center justify-between mb-2 lg:mb-6">
            <h1 className="text-lg md:text-2xl lg:text-4xl font-bold ml-2">Top Series</h1>

            {/* MOBILE NAVIGATION (same as movies) */}
            <div className="flex lg:hidden gap-2">
              <button
                onClick={goToPreviousSeries}
                className="text-text-primary cursor-pointer p-3 rounded-full"
              >
                <ChevronLeft />
              </button>

              <button
                onClick={goToNextSeries}
                className="text-text-primary p-3 cursor-pointer rounded-full"
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSeriesIndex * 100}%)` }}
            >
              {fetchedSeriesData.map((series) => (
                <div
                  key={series.id}
                  onClick={() => handleSeriesClick(series)}
                  className="px-2 shrink-0 w-1/5"
                >
                  <div className="relative cursor-pointer overflow-hidden shadow-lg">
                    <img
                      src={`${IMAGE_BASE_URL}${series.poster_path}`}
                      alt={series.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              ))}
              </div>

              {/* DESKTOP/TABLET NAVIGATION (same as movies) */}
              <div className="absolute h-full right-0 top-1/2 transform translate-x-1/3 -translate-y-1/2 lg:-translate-y-1/2 lg:translate-x-0 bg-linear-to-l from-black to-transperent via-black/80 lg:from-black lg:via-black/65 via-40% flex-col items-center justify-center gap-1 lg:gap-2 lg:p-1 transition-all duration-300 ease-out hover:from-black lg:opacity-0 lg:hover:opacity-100 lg:flex hidden">
                <button
                  onClick={goToPreviousSeries}
                  className="text-white p-2 cursor-pointer rounded-full"
                >
                  <ChevronLeft />
                </button>

                <div className="w-6 h-px" />

                <button
                  onClick={goToNextSeries}
                  className="text-white p-2 cursor-pointer rounded-full"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}

export default Home;
