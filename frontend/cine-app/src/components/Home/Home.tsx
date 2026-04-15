import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storeData } from "../../Redux/MoviesSlice/PopularMovies";
import type { RootState } from "../../Redux/Store";
import { ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";
import { useNavigate, Link } from "react-router";
import { storeSeries } from "../../Redux/SeriesSlice/PopularSeriesSlice";
import HomeTop from "../HomeTop/HomeTop";
import SEO from "../../SEOs/SEO";
import { useAuth } from "../../contexts/AuthContext";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w1280";
const BASE_URL = "https://api.themoviedb.org/3/";

// ─── Types ─────────────────────────────────────────────────
type SliderItem = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
};

type GenreConfig = {
  title: string;
  movieEndpoint: string;
  seriesEndpoint: string;
};

type SpotlightData = {
  movieTitle: string;
  rating: number;
  backdrop: string | undefined;
  reviewText: string;
  author: string;
  movieId: number;
};

// ─── Genre Configurations ──────────────────────────────────
const GENRE_CONFIGS: GenreConfig[] = [
  {
    title: "Action",
    movieEndpoint: "discover/movie?with_genres=28&sort_by=popularity.desc",
    seriesEndpoint: "discover/tv?with_genres=10759&sort_by=popularity.desc",
  },
  {
    title: "Romance",
    movieEndpoint: "discover/movie?with_genres=10749&sort_by=popularity.desc",
    seriesEndpoint: "discover/tv?with_genres=10749&sort_by=popularity.desc",
  },
  {
    title: "Comedy",
    movieEndpoint: "discover/movie?with_genres=35&sort_by=popularity.desc",
    seriesEndpoint: "discover/tv?with_genres=35&sort_by=popularity.desc",
  },
  {
    title: "Horror",
    movieEndpoint: "discover/movie?with_genres=27&sort_by=popularity.desc",
    seriesEndpoint: "discover/tv?with_genres=27&sort_by=popularity.desc",
  },
  {
    title: "Indian",
    movieEndpoint:
      "discover/movie?with_origin_country=IN&sort_by=popularity.desc",
    seriesEndpoint:
      "discover/tv?with_origin_country=IN&sort_by=popularity.desc",
  },
];

// ─── Custom Hook: Responsive Card Count ────────────────────
function useCardsPerView() {
  const [cardsPerView, setCardsPerView] = useState(5);

  useEffect(() => {
    const updateCards = () => {
      const w = window.innerWidth;
      if (w < 640) setCardsPerView(2);
      else if (w < 768) setCardsPerView(3);
      else if (w < 1024) setCardsPerView(4);
      else setCardsPerView(5);
    };
    updateCards();
    window.addEventListener("resize", updateCards);
    return () => window.removeEventListener("resize", updateCards);
  }, []);

  return cardsPerView;
}

// ─── Skeleton Components ───────────────────────────────────
function CardSkeleton() {
  return (
    <div
      className="px-2 shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
      aria-hidden="true"
    >
      <div className="w-full aspect-2/3 bg-white/5 animate-pulse rounded-sm" />
    </div>
  );
}

function SliderSkeleton({
  cards = 5,
  large = false,
}: {
  cards?: number;
  large?: boolean;
}) {
  return (
    <div className="relative overflow-hidden w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-2 lg:mb-6">
        <div
          className={`ml-2 bg-white/5 animate-pulse rounded ${large ? "h-7 lg:h-10 w-44 lg:w-72" : "h-6 lg:h-8 w-36 lg:w-56"}`}
        />
        <div className="flex lg:hidden gap-2">
          <div className="w-10 h-10 bg-white/5 animate-pulse rounded-full" />
          <div className="w-10 h-10 bg-white/5 animate-pulse rounded-full" />
        </div>
      </div>
      <div className="flex">
        {Array.from({ length: cards }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Reusable Slider Component ─────────────────────────────
function ContentSlider({
  title,
  data,
  mediaType,
  cardsPerView,
  // large = false,
}: {
  title: string;
  data: SliderItem[];
  mediaType: "movie" | "tv";
  cardsPerView: number;
  large?: boolean;
}) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchRef = useRef({ start: 0, end: 0 });

  const maxIndex = Math.max(0, Math.ceil(data.length / cardsPerView) - 1);

  const goToNext = () =>
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchRef.current.start = e.targetTouches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchRef.current.end = e.targetTouches[0].clientX;
  };
  const handleTouchEnd = () => {
    const { start, end } = touchRef.current;
    if (!start || !end) return;
    const distance = start - end;
    if (distance > 50) goToNext();
    else if (distance < -50) goToPrevious();
    touchRef.current = { start: 0, end: 0 };
  };

  const handleClick = (item: SliderItem) => {
    const name = item.title || item.name || "";
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    navigate(
      mediaType === "movie"
        ? `/movie/${item.id}/${slug}`
        : `/tv/${item.id}/${slug}`,
    );
  };

  if (data.length === 0) return null;

  return (
    <div className="relative overflow-hidden w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-2 lg:mb-6">
        <h1
          className="text-lg md:text-2xl lg:text-3xl ml-2 font-bold"
        >
          {title}
        </h1>
        <div className="flex lg:hidden gap-2">
          <button
            onClick={goToPrevious}
            className="text-text-primary cursor-pointer p-3 rounded-full"
            aria-label="Previous"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={goToNext}
            className="text-text-primary p-3 cursor-pointer rounded-full"
            aria-label="Next"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      <div className="relative">
        <div
          className="flex will-change-transform transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {data.map((item) => (
            <div
              key={`${mediaType}-${item.id}`}
              onClick={() => handleClick(item)}
              className="px-2 shrink-0 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
            >
              <div className="relative cursor-pointer overflow-hidden rounded-sm shadow-lg group">
                <div className="relative w-full aspect-2/3">
                  <img
                    src={`${IMAGE_BASE_URL}${item.poster_path}`}
                    alt={item.title || item.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 lg:from-black to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-3 text-white opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition duration-300">
                  <h3 className="text-xs md:text-sm font-bold truncate">
                    {item.title || item.name}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] md:text-xs mt-1">
                    <span>⭐ {item.vote_average?.toFixed(1)}</span>
                    <span>
                      {
                        (item.release_date || item.first_air_date || "").split(
                          "-",
                        )[0]
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute h-full right-0 top-1/2 transform translate-x-1/3 -translate-y-1/2 lg:-translate-y-1/2 lg:translate-x-0 bg-linear-to-l from-black to-transperent via-black/80 lg:from-black lg:via-black/65 via-40% flex-col items-center justify-center gap-1 lg:gap-2 lg:p-1 transition-all duration-300 ease-out hover:from-black lg:opacity-0 lg:hover:opacity-100 lg:flex hidden">
          <button
            onClick={goToPrevious}
            className="text-white p-2 cursor-pointer rounded-full"
            aria-label="Previous"
          >
            <ChevronLeft />
          </button>
          <div className="w-6 h-px" />
          <button
            onClick={goToNext}
            className="text-white p-2 cursor-pointer rounded-full"
            aria-label="Next"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Lazy Genre Section ─────────────────────────────────────
function LazyGenreSection({
  config,
  apiKey,
  cardsPerView,
}: {
  config: GenreConfig;
  apiKey: string;
  cardsPerView: number;
}) {
  const [data, setData] = useState<{
    movies: SliderItem[];
    series: SliderItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchData();
          observer.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      abortRef.current?.abort();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchData() {
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;
    try {
      setLoading(true);
      const [movieRes, seriesRes] = await Promise.all([
        fetch(`${BASE_URL}${config.movieEndpoint}&api_key=${apiKey}`, {
          signal,
        }),
        fetch(`${BASE_URL}${config.seriesEndpoint}&api_key=${apiKey}`, {
          signal,
        }),
      ]);
      if (signal.aborted) return;
      const [movieData, seriesData] = await Promise.all([
        movieRes.json(),
        seriesRes.json(),
      ]);
      if (signal.aborted) return;
      setData({
        movies: (movieData.results || [])
          .filter((item: SliderItem) => item.poster_path)
          .slice(0, 10),
        series: (seriesData.results || [])
          .filter((item: SliderItem) => item.poster_path)
          .slice(0, 10),
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error(`Failed to fetch ${config.title}:`, err);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-6 lg:gap-8">
      {loading ? (
        <>
          <SliderSkeleton cards={cardsPerView} />
          <SliderSkeleton cards={cardsPerView} />
        </>
      ) : data ? (
        <>
          <ContentSlider
            title={`${config.title} movies`}
            data={data.movies}
            mediaType="movie"
            cardsPerView={cardsPerView}
          />
          <ContentSlider
            title={`${config.title} series`}
            data={data.series}
            mediaType="tv"
            cardsPerView={cardsPerView}
          />
        </>
      ) : null}
    </div>
  );
}

// ─── Main Home Component ───────────────────────────────────
function Home() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cardsPerView = useCardsPerView();

  const fetchedData = useSelector(
    (state: RootState) => state.popularMovies.data,
  );
  const fetchedSeriesData = useSelector(
    (state: RootState) => state.seriesData.seriesData,
  );

  // Scroll to top state
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Review of the day state
  const [spotlight, setSpotlight] = useState<SpotlightData | null>(null);
  const spotlightFetched = useRef(false);

  //authCheck
  const { isAuthenticated, refreshUser } = useAuth();

  // Fetch trending movies (Redux)
  useEffect(() => {
    if (fetchedData.length > 0) return;
    fetch(`${BASE_URL}movie/popular?api_key=${apiKey}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => dispatch(storeData(data.results)))
      .catch((err) => console.error(err));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch trending series (Redux)
  useEffect(() => {
    if (fetchedSeriesData.length > 0) return;
    fetch(`${BASE_URL}trending/tv/week?api_key=${apiKey}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => dispatch(storeSeries(data.results)))
      .catch((err) => console.error(err));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll listener for Scroll-to-Top button
  useEffect(() => {
    const handleScroll = () => setShowScrollBtn(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch Review of the Day once popular movies are loaded
  useEffect(() => {
    if (fetchedData.length === 0 || spotlightFetched.current) return;
    spotlightFetched.current = true;

    // Pick the highest-rated movie from trending
    const topMovie = [...fetchedData].sort(
      (a, b) => (b.vote_average || 0) - (a.vote_average || 0),
    )[0];
    if (!topMovie) return;

    fetch(`${BASE_URL}movie/${topMovie.id}/reviews?api_key=${apiKey}`)
      .then((res) => res.json())
      .then((data) => {
        const review = data.results?.[0];

        // Smart Fallback: If no user review exists, use the movie's overview
        const displayText = review
          ? review.content.substring(0, 250) +
            (review.content.length > 250 ? "..." : "")
          : (topMovie.overview?.substring(0, 250) ||
              "An absolute cinematic masterpiece that shouldn't be missed.") +
            "...";

        const displayAuthor = review ? review.author : "CineAura Editors";

        setSpotlight({
          movieTitle: topMovie.title || "Unknown",
          rating: topMovie.vote_average || 0,
          backdrop: topMovie.backdrop_path,
          reviewText: displayText,
          author: displayAuthor,
          movieId: topMovie.id,
        });
      })
      .catch(() => {
        // Fallback just in case the review endpoint fails entirely
        setSpotlight({
          movieTitle: topMovie.title || "Unknown",
          rating: topMovie.vote_average || 0,
          backdrop: topMovie.backdrop_path,
          reviewText:
            topMovie.overview?.substring(0, 250) ||
            "A highly rated trending movie.",
          author: "CineAura Editors",
          movieId: topMovie.id,
        });
      });
      refreshUser()
  }, [fetchedData, apiKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const moviesSliderData: SliderItem[] = fetchedData.map((m) => ({
    id: m.id,
    title: m.title,
    poster_path: m.poster_path,
    backdrop_path: m.backdrop_path,
    vote_average: m.vote_average,
    release_date: m.release_date,
  }));
  const seriesSliderData: SliderItem[] = fetchedSeriesData.map((s) => ({
    id: s.id,
    name: s.name,
    poster_path: s.poster_path,
    vote_average: s.vote_average,
    first_air_date: s.first_air_date,
  }));

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <SEO
        title="CineAura | Infinite Movies & TV Shows"
        description="Explore trending movies and TV shows in an infinite scrolling experience."
      />
      <HomeTop />

      <div className="flex flex-col gap-5 lg:gap-25 pt-5 lg:pt-0 px-2 pb-12">
        {fetchedData.length === 0 ? (
          <SliderSkeleton cards={cardsPerView} large />
        ) : (
          <ContentSlider
            title="Trending movies"
            data={moviesSliderData}
            mediaType="movie"
            cardsPerView={cardsPerView}
            large
          />
        )}
        {fetchedSeriesData.length === 0 ? (
          <SliderSkeleton cards={cardsPerView} large />
        ) : (
          <ContentSlider
            title="Trending series"
            data={seriesSliderData}
            mediaType="tv"
            cardsPerView={cardsPerView}
            large
          />
        )}

        {GENRE_CONFIGS.map((config) => (
          <LazyGenreSection
            key={config.title}
            config={config}
            apiKey={apiKey}
            cardsPerView={cardsPerView}
          />
        ))}

        {/* ─── Review of the Day Spotlight ─── */}
        {spotlight && (
          <div className="max-w-7xl mx-auto w-full mt-8 lg:mt-12 px-2">
            <div
              className="relative overflow-hidden rounded-sm shadow-xl cursor-pointer group"
              onClick={() => {
                const slug = spotlight.movieTitle
                  .toLowerCase()
                  .replace(/\s+/g, "-");
                navigate(`/movie/${spotlight.movieId}/${slug}`);
              }}
            >
              {/* Backdrop Image */}
              <img
                src={`${IMAGE_BASE_URL}${spotlight.backdrop}`}
                alt={spotlight.movieTitle}
                className="w-full h-80 sm:h-[380px] lg:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/70 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10 lg:p-16 max-w-2xl">
                <p className="text-xs sm:text-sm font-semibold text-yellow-400 uppercase tracking-widest mb-2">
                  Review of the Day
                </p>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white">
                    ⭐ {spotlight.rating.toFixed(1)}
                  </span>
                  <div className="w-px h-8 bg-white/30" />
                  <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white">
                    {spotlight.movieTitle}
                  </h2>
                </div>

                {/* Styled Quote */}
                <div className="relative pl-5 border-l-4 border-yellow-500 mb-8">
                  <p className="text-sm sm:text-base text-gray-200 italic leading-relaxed line-clamp-4">
                    "{spotlight.reviewText}"
                  </p>
                  <p className="text-xs sm:text-sm text-yellow-400 font-bold mt-3 not-italic">
                    — {spotlight.author}
                  </p>
                </div>

                {/* Sign Up CTA */}
                {!isAuthenticated && (
                  <Link
                    to="/sign-up"
                    onClick={(e) => e.stopPropagation()} // Prevent navigating to movie page
                    className="w-fit bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm sm:text-base px-6 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95"
                  >
                    Sign Up to Add Your Review
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Scroll to Top Button ─── */}
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 z-50 bg-bg-tertiary text-text-primary w-12 h-12 rounded-full shadow-xl flex items-center cursor-pointer justify-center hover:bg-bg-secondary hover:scale-110 active:scale-95 ${
          showScrollBtn
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <ArrowUp size={22} strokeWidth={3} />
      </button>
    </>
  );
}

export default Home;
