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
        dispatch(storeData(data.results.slice(0, 10)));
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

  const filteredWebSeries = fetchedSeriesData.filter(
    (item) => !item.genre_ids.includes(16)
  );

  const seriesList = filteredWebSeries.slice(0, 10);

  // console.log(seriesList)

  const goToPrevious = () => {
    if (fetchedData.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? fetchedData.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (fetchedData.length === 0) return;
    setCurrentIndex((prev) => (prev === fetchedData.length - 1 ? 0 : prev + 1));
  };

  const goToPreviousSeries = () => {
    if (seriesList.length === 0) return;
    setCurrentSeriesIndex((prev) =>
      prev === 0 ? seriesList.length - 1 : prev - 1
    );
  };

  const goToNextSeries = () => {
    if (seriesList.length === 0) return;
    setCurrentSeriesIndex((prev) =>
      prev === seriesList.length - 1 ? 0 : prev + 1
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

  const limitText = (text: string, limit = 160) => {
    if (text.length <= limit) return text;

    return text.slice(0, limit) + "...";
  };

  return (
    <>
      <div className="relative w-full mt-25 overflow-hidden flex justify-center">
        {/* Slider container */}
        <div
          className="
        relative overflow-hidden rounded-xl

        w-[400px] h-[240px]

        sm:w-[370px] sm:h-[460px]
        md:w-[460px] md:h-[360px]
        lg:w-[700px] lg:h-[350px]
        xl:w-[950px] xl:h-[500px]
      "
        >
          <h1 className="text-2xl md:text-4xl font-bold">Top Movies</h1>
          <div
            className="shadow-xl flex h-full transition-transform duration-500 mt-2 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {fetchedData.map((movie) => (
              <div
                key={movie.id}
                className="
              shrink-0 h-full relative

              /* Each slide width always equals container width */
              w-full
              sm:w-[370px]
              md:w-[460px]
              lg:w-[700px]
              xl:w-[950px]
            "
              >
                <img
                  src={`${IMAGE_BASE_URL}${movie.backdrop_path}`}
                  alt={movie.title}
                  className="
                w-full h-full
                object-cover        /* mobile perfect fit */
                md:object-cover   /* larger screens fill nicely */
                object-center
                rounded-xl
              "
                />

                <div className="absolute mb-1 bottom-0 left-0 p-3 bg-gradient-to-t from-black via-black/40 to-transparent md:p-4 text-white rounded-none w-full">
                  <h1 className="text-l md:text-4xl font-bold">
                    {movie.title}
                  </h1>
                  <p className="text-xs mb-14 md:text-base max-w-xl">
                    {limitText(movie.overview, 180)}

                    {movie.overview.length > 180 && (
                      <span
                        onClick={() => handleMovieClick(movie)}
                        className="ml-1 underline cursor-pointer text-blue-300 hover:text-blue-400"
                      >
                        See more
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleMovieClick(movie)}
                  className="
    absolute top-4 right-4 
    bg-bg-secondary hover:bg-bg-primary
    text-text-primary px-4 py-2 rounded-full text-sm md:text-base
     cursor-pointer
  "
                >
                  Details
                </button>
              </div>
            ))}
          </div>

          {/* Buttons */}

          {/* Indicators */}
          <div className="absolute -mb-2 bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {fetchedData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 cursor-pointer rounded-full duration-300
              ${currentIndex === index ? "bg-white scale-125" : "bg-white/40"}
            `}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="">
        <div className="justify-self-center ">
          <button
            onClick={goToPrevious}
            className="m-3 cursor-pointer bg-bg-secondary hover:bg-muted/60 text-text-primary p-3 rounded-full"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={goToNext}
            className="cursor-pointer bg-bg-secondary hover:bg-muted/60 text-text-primary p-3 rounded-full"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* TOP SERIES */}

      <div className="relative w-full mt-25 overflow-hidden flex justify-center">
        {/* Slider container */}
        <div
          className="
        relative overflow-hidden rounded-xl

        w-[400px] h-[240px]

        sm:w-[370px] sm:h-[460px]
        md:w-[460px] md:h-[360px]
        lg:w-[700px] lg:h-[350px]
        xl:w-[950px] xl:h-[500px]
      "
        >
          <h1 className="text-2xl md:text-4xl font-bold">Top Web Series</h1>
          <div
            className="shadow-xl flex h-full transition-transform duration-500 mt-2 ease-in-out"
            style={{ transform: `translateX(-${currentSeriesIndex * 100}%)` }}
          >
            {seriesList.map((series) => (
              <div
                key={series.id}
                className="
              shrink-0 h-full relative

              /* Each slide width always equals container width */
              w-full
              sm:w-[370px]
              md:w-[460px]
              lg:w-[700px]
              xl:w-[950px]
            "
              >
                <img
                  src={`${IMAGE_BASE_URL}${series.backdrop_path}`}
                  alt={series.name}
                  className="
                w-full h-full
                object-cover        /* mobile perfect fit */
                md:object-cover   /* larger screens fill nicely */
                object-center
                rounded-xl
              "
                />

                <div className="absolute mb-1 bottom-0 left-0 p-3 bg-gradient-to-t from-black via-black/40 to-transparent md:p-4 text-white rounded-none w-full">
                  <h1 className="text-l md:text-4xl font-bold">
                    {series.name}
                  </h1>
                  <p className="text-xs mb-14 md:text-base max-w-xl">
                    {limitText(series.overview, 180)}

                    {series.overview.length > 180 && (
                      <span
                        onClick={() => handleSeriesClick(series)}
                        className="ml-1 underline cursor-pointer text-blue-300 hover:text-blue-400"
                      >
                        See more
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => handleSeriesClick(series)}
                  className="
    absolute top-4 right-4 
    bg-bg-secondary hover:bg-bg-primary
    text-text-primary px-4 py-2 rounded-full text-sm md:text-base
     cursor-pointer
  "
                >
                  Details
                </button>
              </div>
            ))}
          </div>

          {/* Buttons */}

          {/* Indicators */}
          <div className="absolute -mb-2 bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
            {seriesList.map((_, Idx) => (
              <button
                key={Idx}
                onClick={() => setCurrentSeriesIndex(Idx)}
                className={`w-3 h-3 cursor-pointer rounded-full duration-300
              ${
                currentSeriesIndex === Idx
                  ? "bg-white scale-125"
                  : "bg-white/40"
              }
            `}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="">
        <div className="justify-self-center ">
          <button
            onClick={goToPreviousSeries}
            className="m-3 cursor-pointer bg-bg-secondary hover:bg-muted/60 text-text-primary p-3 rounded-full"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={goToNextSeries}
            className="cursor-pointer bg-bg-secondary hover:bg-muted/60 text-text-primary p-3 rounded-full"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
