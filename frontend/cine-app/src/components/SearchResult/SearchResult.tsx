import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { showLoader, hideLoader } from "../../Redux/LoaderSlice/LoaderSlice";
import {
  setFilteredMovies,
  setFilteredSeries,
} from "../../Redux/FilteredResultsSlice/FilteredResultsSlice";
import type {
  PersonResult,
  SearchMovie,
  SearchSeries,
} from "../../types/SearchType";
import SEO from "../../SEOs/SEO";
import { ArrowUp } from "lucide-react";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

interface QueryParams {
  yearFrom: string;
  yearTo: string;
  genres?: string;
  countries?: string;
}

const MOVIE_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const TV_GENRES = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];

const COUNTRIES = [
  { iso_3166_1: "AR", english_name: "Argentina" },
  { iso_3166_1: "AU", english_name: "Australia" },
  { iso_3166_1: "AT", english_name: "Austria" },
  { iso_3166_1: "BE", english_name: "Belgium" },
  { iso_3166_1: "BR", english_name: "Brazil" },
  { iso_3166_1: "BG", english_name: "Bulgaria" },
  { iso_3166_1: "CA", english_name: "Canada" },
  { iso_3166_1: "CL", english_name: "Chile" },
  { iso_3166_1: "CN", english_name: "China" },
  { iso_3166_1: "CO", english_name: "Colombia" },
  { iso_3166_1: "CZ", english_name: "Czech Republic" },
  { iso_3166_1: "DK", english_name: "Denmark" },
  { iso_3166_1: "EG", english_name: "Egypt" },
  { iso_3166_1: "FI", english_name: "Finland" },
  { iso_3166_1: "FR", english_name: "France" },
  { iso_3166_1: "DE", english_name: "Germany" },
  { iso_3166_1: "GR", english_name: "Greece" },
  { iso_3166_1: "HU", english_name: "Hungary" },
  { iso_3166_1: "IS", english_name: "Iceland" },
  { iso_3166_1: "IN", english_name: "India" },
  { iso_3166_1: "ID", english_name: "Indonesia" },
  { iso_3166_1: "IE", english_name: "Ireland" },
  { iso_3166_1: "IL", english_name: "Israel" },
  { iso_3166_1: "IT", english_name: "Italy" },
  { iso_3166_1: "JP", english_name: "Japan" },
  { iso_3166_1: "KE", english_name: "Kenya" },
  { iso_3166_1: "MY", english_name: "Malaysia" },
  { iso_3166_1: "MX", english_name: "Mexico" },
  { iso_3166_1: "NL", english_name: "Netherlands" },
  { iso_3166_1: "NZ", english_name: "New Zealand" },
  { iso_3166_1: "NG", english_name: "Nigeria" },
  { iso_3166_1: "NO", english_name: "Norway" },
  { iso_3166_1: "PE", english_name: "Peru" },
  { iso_3166_1: "PH", english_name: "Philippines" },
  { iso_3166_1: "PL", english_name: "Poland" },
  { iso_3166_1: "PT", english_name: "Portugal" },
  { iso_3166_1: "RO", english_name: "Romania" },
  { iso_3166_1: "RU", english_name: "Russia" },
  { iso_3166_1: "SG", english_name: "Singapore" },
  { iso_3166_1: "ZA", english_name: "South Africa" },
  { iso_3166_1: "KR", english_name: "South Korea" },
  { iso_3166_1: "ES", english_name: "Spain" },
  { iso_3166_1: "SE", english_name: "Sweden" },
  { iso_3166_1: "CH", english_name: "Switzerland" },
  { iso_3166_1: "TH", english_name: "Thailand" },
  { iso_3166_1: "TR", english_name: "Turkey" },
  { iso_3166_1: "UA", english_name: "Ukraine" },
  { iso_3166_1: "GB", english_name: "United Kingdom" },
  { iso_3166_1: "US", english_name: "United States" },
  { iso_3166_1: "VE", english_name: "Venezuela" },
];

const mapMovieToTVGenres = (movieGenreIds: number[]): number[] => {
  const tvGenreIds: number[] = [];
  movieGenreIds.forEach((movieId) => {
    const movieGenre = MOVIE_GENRES.find((g) => g.id === movieId);
    if (movieGenre) {
      const tvGenre = TV_GENRES.find(
        (tv) =>
          tv.name.toLowerCase().includes(movieGenre.name.toLowerCase()) ||
          movieGenre.name.toLowerCase().includes(tv.name.toLowerCase()),
      );
      if (tvGenre) {
        tvGenreIds.push(tvGenre.id);
      }
    }
  });
  return tvGenreIds;
};

// ===================== PAGINATION COMPONENT =====================
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sectionId: string;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  sectionId,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const scrollToSection = () => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
    scrollToSection();
  };

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
      <p className="text-text-secondary text-sm">
        Page {currentPage} of {totalPages}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-bg-tertiary text-text-primary text-sm font-medium
                     hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline">Prev</span>
        </button>

        {getPageNumbers().map((page, index) =>
          typeof page === "string" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 py-2 text-text-secondary"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-lg text-sm font-medium cursor-pointer
                ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-bg-tertiary text-text-primary hover:bg-bg-secondary"
                }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-bg-tertiary text-text-primary text-sm font-medium
                     hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <span className="hidden sm:inline">Next</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ===================== CARD COMPONENTS =====================
interface MovieCardProps {
  movie: SearchMovie;
  onClick: (movie: SearchMovie) => void;
}

function MovieCard({ movie, onClick }: MovieCardProps) {
  return (
    <div
      onClick={() => onClick(movie)}
      className="bg-bg-secondary rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
    >
      <div className="relative w-full pt-[150%]">
        {movie.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-bg-tertiary flex items-center justify-center">
            <span className="text-text-secondary text-sm">No Image</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3
          className="text-sm sm:text-base font-semibold text-text-primary truncate"
          title={movie.title}
        >
          {movie.title}
        </h3>
        <p className="text-text-secondary text-xs sm:text-sm">
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "N/A"}
        </p>
      </div>
    </div>
  );
}

interface SeriesCardProps {
  series: SearchSeries;
  onClick: (series: SearchSeries) => void;
}

function SeriesCard({ series, onClick }: SeriesCardProps) {
  return (
    <div
      onClick={() => onClick(series)}
      className="bg-bg-secondary rounded-lg overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
    >
      <div className="relative w-full pt-[150%]">
        {series.poster_path ? (
          <img
            src={`${IMAGE_BASE_URL}${series.poster_path}`}
            alt={series.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-bg-tertiary flex items-center justify-center">
            <span className="text-text-secondary text-sm">No Image</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3
          className="text-sm sm:text-base font-semibold text-text-primary truncate"
          title={series.name}
        >
          {series.name}
        </h3>
        <p className="text-text-secondary text-xs sm:text-sm">
          {series.first_air_date
            ? new Date(series.first_air_date).getFullYear()
            : "N/A"}
        </p>
      </div>
    </div>
  );
}

// ===================== MAIN COMPONENT =====================
function SearchResult() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_API_KEY;

  // Filter form state
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [yearFrom, setYearFrom] = useState<number>(1990);
  const [yearTo, setYearTo] = useState<number>(new Date().getFullYear());
  const [filtersAreActive, setFiltersAreActive] = useState<boolean>(false);
  const [searchTrigger, setSearchTrigger] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [genreError, setGenreError] = useState<boolean>(false);

  // Discover state with API pagination
  const [discoverMovies, setDiscoverMovies] = useState<SearchMovie[]>([]);
  const [discoverSeries, setDiscoverSeries] = useState<SearchSeries[]>([]);
  const [discoverMoviesPage, setDiscoverMoviesPage] = useState(1);
  const [discoverSeriesPage, setDiscoverSeriesPage] = useState(1);
  const [discoverMoviesTotalPages, setDiscoverMoviesTotalPages] = useState(0);
  const [discoverSeriesTotalPages, setDiscoverSeriesTotalPages] = useState(0);
  const [discoverMoviesTotalResults, setDiscoverMoviesTotalResults] =
    useState(0);
  const [discoverSeriesTotalResults, setDiscoverSeriesTotalResults] =
    useState(0);
  const [showDiscover, setShowDiscover] = useState<boolean>(false);

  // Search state with API pagination
  const [searchMovies, setSearchMovies] = useState<SearchMovie[]>([]);
  const [searchSeries, setSearchSeries] = useState<SearchSeries[]>([]);
  const [searchPersons, setSearchPersons] = useState<PersonResult[]>([]);
  const [searchMoviesPage, setSearchMoviesPage] = useState(1);
  const [searchSeriesPage, setSearchSeriesPage] = useState(1);
  const [searchMoviesTotalPages, setSearchMoviesTotalPages] = useState(0);
  const [searchSeriesTotalPages, setSearchSeriesTotalPages] = useState(0);
  const [searchMoviesTotalResults, setSearchMoviesTotalResults] = useState(0);
  const [searchSeriesTotalResults, setSearchSeriesTotalResults] = useState(0);
  const [hasSearchResults, setHasSearchResults] = useState<boolean>(false);

  // Filtered state with API pagination
  const [filteredMovies, setFilteredMoviesLocal] = useState<SearchMovie[]>([]);
  const [filteredSeries, setFilteredSeriesLocal] = useState<SearchSeries[]>([]);
  const [filteredMoviesPage, setFilteredMoviesPage] = useState(1);
  const [filteredSeriesPage, setFilteredSeriesPage] = useState(1);
  const [filteredMoviesTotalPages, setFilteredMoviesTotalPages] = useState(0);
  const [filteredSeriesTotalPages, setFilteredSeriesTotalPages] = useState(0);
  const [filteredMoviesTotalResults, setFilteredMoviesTotalResults] =
    useState(0);
  const [filteredSeriesTotalResults, setFilteredSeriesTotalResults] =
    useState(0);

  const [showScrollBtn, setShowScrollBtn] = useState(false);

  // Current filter params for pagination
  const [currentFilterParams, setCurrentFilterParams] = useState<{
    genres: number[];
    tvGenreIds: number[];
    countries: string[];
    fromYear: number;
    toYear: number;
  } | null>(null);

  const minYear = 1900;
  const maxYear = new Date().getFullYear();

  // ===================== API FETCH FUNCTIONS =====================

  const fetchDiscoverMovies = useCallback(
    async (page: number) => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`,
        );
        const data = await res.json();
        setDiscoverMovies(data.results || []);
        setDiscoverMoviesTotalPages(Math.min(data.total_pages || 0, 500));
        setDiscoverMoviesTotalResults(data.total_results || 0);
      } catch (err) {
        console.error("Discover movies error:", err);
      }
    },
    [apiKey],
  );

  const fetchDiscoverSeries = useCallback(
    async (page: number) => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&page=${page}`,
        );
        const data = await res.json();
        setDiscoverSeries(data.results || []);
        setDiscoverSeriesTotalPages(Math.min(data.total_pages || 0, 500));
        setDiscoverSeriesTotalResults(data.total_results || 0);
      } catch (err) {
        console.error("Discover series error:", err);
      }
    },
    [apiKey],
  );

  const fetchSearchMovies = useCallback(
    async (query: string, page: number) => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&include_adult=false&page=${page}`,
        );
        const data = await res.json();
        setSearchMovies(data.results || []);
        setSearchMoviesTotalPages(Math.min(data.total_pages || 0, 500));
        setSearchMoviesTotalResults(data.total_results || 0);
      } catch (err) {
        console.error("Search movies error:", err);
      }
    },
    [apiKey],
  );

  const fetchSearchSeries = useCallback(
    async (query: string, page: number) => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${query}&include_adult=false&page=${page}`,
        );
        const data = await res.json();
        setSearchSeries(data.results || []);
        setSearchSeriesTotalPages(Math.min(data.total_pages || 0, 500));
        setSearchSeriesTotalResults(data.total_results || 0);
      } catch (err) {
        console.error("Search series error:", err);
      }
    },
    [apiKey],
  );

  const fetchSearchPersons = useCallback(
    async (query: string) => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&query=${query}&include_adult=false`,
        );
        const data = await res.json();
        setSearchPersons(data.results || []);
      } catch (err) {
        console.error("Search persons error:", err);
      }
    },
    [apiKey],
  );

  const fetchFilteredMovies = useCallback(
    async (
      genres: number[],
      countries: string[],
      fromYear: number,
      toYear: number,
      page: number,
    ) => {
      try {
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genres.join(",")}&primary_release_date.gte=${fromYear}-01-01&primary_release_date.lte=${toYear}-12-31&page=${page}`;
        if (countries.length > 0) {
          url += `&with_origin_country=${countries.join(",")}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setFilteredMoviesLocal(data.results || []);
        setFilteredMoviesTotalPages(Math.min(data.total_pages || 0, 500));
        setFilteredMoviesTotalResults(data.total_results || 0);
        dispatch(setFilteredMovies(data.results || []));
      } catch (err) {
        console.error("Filter movies error:", err);
      }
    },
    [apiKey, dispatch],
  );

  const fetchFilteredSeries = useCallback(
    async (
      tvGenreIds: number[],
      countries: string[],
      fromYear: number,
      toYear: number,
      page: number,
    ) => {
      try {
        let url = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${tvGenreIds.join(",")}&first_air_date.gte=${fromYear}-01-01&first_air_date.lte=${toYear}-12-31&page=${page}`;
        if (countries.length > 0) {
          url += `&with_origin_country=${countries.join(",")}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setFilteredSeriesLocal(data.results || []);
        setFilteredSeriesTotalPages(Math.min(data.total_pages || 0, 500));
        setFilteredSeriesTotalResults(data.total_results || 0);
        dispatch(setFilteredSeries(data.results || []));
      } catch (err) {
        console.error("Filter series error:", err);
      }
    },
    [apiKey, dispatch],
  );

  // ===================== EFFECTS =====================

  // Discover initial fetch
  useEffect(() => {
    if (!slug && !filtersAreActive) {
      setShowDiscover(true);
      setDiscoverMoviesPage(1);
      setDiscoverSeriesPage(1);
      setHasSearchResults(false);

      const fetchDiscover = async () => {
        dispatch(showLoader());
        try {
          await Promise.all([fetchDiscoverMovies(1), fetchDiscoverSeries(1)]);
        } finally {
          dispatch(hideLoader());
        }
      };

      fetchDiscover();
    } else {
      setShowDiscover(false);
    }
  }, [
    slug,
    filtersAreActive,
    fetchDiscoverMovies,
    fetchDiscoverSeries,
    dispatch,
  ]);

  // Scroll to top listener
  useEffect(() => {
    const handleScroll = () => setShowScrollBtn(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Discover movies page change
  useEffect(() => {
    if (showDiscover) {
      dispatch(showLoader());
      fetchDiscoverMovies(discoverMoviesPage).finally(() => {
        dispatch(hideLoader());
      });
    }
  }, [discoverMoviesPage, showDiscover, fetchDiscoverMovies, dispatch]);

  // Discover series page change
  useEffect(() => {
    if (showDiscover) {
      dispatch(showLoader());
      fetchDiscoverSeries(discoverSeriesPage).finally(() => {
        dispatch(hideLoader());
      });
    }
  }, [discoverSeriesPage, showDiscover, fetchDiscoverSeries, dispatch]);

  // URL params for filters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const hasGenres = queryParams.has("genres");
    const hasCountries = queryParams.has("countries");
    const hasYearFrom = queryParams.has("yearFrom");
    const hasYearTo = queryParams.has("yearTo");

    if ((hasGenres || hasCountries) && hasYearFrom && hasYearTo) {
      const genresParam = queryParams.get("genres");
      const countriesParam = queryParams.get("countries");
      const yearFromParam = queryParams.get("yearFrom");
      const yearToParam = queryParams.get("yearTo");

      const genres = genresParam ? genresParam.split(",").map(Number) : [];
      const countries = countriesParam ? countriesParam.split(",") : [];
      const fromYear = Number(yearFromParam);
      const toYear = Number(yearToParam);
      const tvGenreIds = mapMovieToTVGenres(genres);

      setSelectedGenres(genres);
      setSelectedCountries(countries);
      setYearFrom(fromYear);
      setYearTo(toYear);
      setFiltersAreActive(true);
      setHasSearchResults(false);
      setFilteredMoviesPage(1);
      setFilteredSeriesPage(1);
      setCurrentFilterParams({
        genres,
        tvGenreIds,
        countries,
        fromYear,
        toYear,
      });

      dispatch(showLoader());
      Promise.all([
        fetchFilteredMovies(genres, countries, fromYear, toYear, 1),
        fetchFilteredSeries(tvGenreIds, countries, fromYear, toYear, 1),
      ]).finally(() => {
        dispatch(hideLoader());
      });
    } else {
      if (filtersAreActive) {
        setFiltersAreActive(false);
        setSelectedGenres([]);
        setSelectedCountries([]);
        setYearFrom(1990);
        setYearTo(new Date().getFullYear());
        setSearchTrigger((prev) => prev + 1);
        setCurrentFilterParams(null);
      }
    }
  }, [
    location.search,
    filtersAreActive,
    fetchFilteredMovies,
    fetchFilteredSeries,
    dispatch,
  ]);

  // Search
  useEffect(() => {
    if (!slug) {
      return;
    }

    if (filtersAreActive) {
      setSelectedGenres([]);
      setSelectedCountries([]);
      setYearFrom(1990);
      setYearTo(new Date().getFullYear());
      setFiltersAreActive(false);
      setGenreError(false);
      setCurrentFilterParams(null);
      dispatch(setFilteredMovies([]));
      dispatch(setFilteredSeries([]));
      setFilteredMoviesLocal([]);
      setFilteredSeriesLocal([]);
    }

    setSearchMoviesPage(1);
    setSearchSeriesPage(1);
    setHasSearchResults(true);

    dispatch(showLoader());
    Promise.all([
      fetchSearchMovies(slug, 1),
      fetchSearchSeries(slug, 1),
      fetchSearchPersons(slug),
    ]).finally(() => {
      dispatch(hideLoader());
    });
  }, [
    slug,
    searchTrigger,
    dispatch,
    fetchSearchMovies,
    fetchSearchSeries,
    fetchSearchPersons,
    filtersAreActive,
  ]);

  // Search movies page change
  useEffect(() => {
    if (hasSearchResults && slug) {
      dispatch(showLoader());
      fetchSearchMovies(slug, searchMoviesPage).finally(() => {
        dispatch(hideLoader());
      });
    }
  }, [searchMoviesPage, hasSearchResults, slug, fetchSearchMovies, dispatch]);

  // Search series page change
  useEffect(() => {
    if (hasSearchResults && slug) {
      dispatch(showLoader());
      fetchSearchSeries(slug, searchSeriesPage).finally(() => {
        dispatch(hideLoader());
      });
    }
  }, [searchSeriesPage, hasSearchResults, slug, fetchSearchSeries, dispatch]);

  // Filtered movies page change
  useEffect(() => {
    if (filtersAreActive && currentFilterParams) {
      dispatch(showLoader());
      fetchFilteredMovies(
        currentFilterParams.genres,
        currentFilterParams.countries,
        currentFilterParams.fromYear,
        currentFilterParams.toYear,
        filteredMoviesPage,
      ).finally(() => {
        dispatch(hideLoader());
      });
    }
  }, [
    filteredMoviesPage,
    filtersAreActive,
    currentFilterParams,
    fetchFilteredMovies,
    dispatch,
  ]);

  // Filtered series page change
  useEffect(() => {
    if (filtersAreActive && currentFilterParams) {
      dispatch(showLoader());
      fetchFilteredSeries(
        currentFilterParams.tvGenreIds,
        currentFilterParams.countries,
        currentFilterParams.fromYear,
        currentFilterParams.toYear,
        filteredSeriesPage,
      ).finally(() => {
        dispatch(hideLoader());
      });
    }
  }, [
    filteredSeriesPage,
    filtersAreActive,
    currentFilterParams,
    fetchFilteredSeries,
    dispatch,
  ]);

  // ===================== HANDLERS =====================

  const toggleGenre = (id: number) => {
    if (genreError) {
      setGenreError(false);
    }
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const toggleCountry = (iso: string) => {
    setSelectedCountries((prev) =>
      prev.includes(iso) ? prev.filter((c) => c !== iso) : [...prev, iso],
    );
  };

  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedGenres.length === 0) {
      setGenreError(true);
      return;
    }

    setFiltersAreActive(true);

    const tvGenreIds = mapMovieToTVGenres(selectedGenres);
    const queryParams: QueryParams = {
      yearFrom: yearFrom.toString(),
      yearTo: yearTo.toString(),
    };

    if (selectedGenres.length > 0) {
      queryParams.genres = selectedGenres.join(",");
    }

    if (selectedCountries.length > 0) {
      queryParams.countries = selectedCountries.join(",");
    }

    const searchParams = new URLSearchParams();
    searchParams.set("yearFrom", queryParams.yearFrom);
    searchParams.set("yearTo", queryParams.yearTo);
    if (queryParams.genres) {
      searchParams.set("genres", queryParams.genres);
    }
    if (queryParams.countries) {
      searchParams.set("countries", queryParams.countries);
    }

    setCurrentFilterParams({
      genres: selectedGenres,
      tvGenreIds,
      countries: selectedCountries,
      fromYear: yearFrom,
      toYear: yearTo,
    });

    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  const handleResetFilters = () => {
    setSelectedGenres([]);
    setSelectedCountries([]);
    setYearFrom(1990);
    setYearTo(new Date().getFullYear());
    setFiltersAreActive(false);
    setGenreError(false);
    setFilteredMoviesPage(1);
    setFilteredSeriesPage(1);
    setCurrentFilterParams(null);

    dispatch(setFilteredMovies([]));
    dispatch(setFilteredSeries([]));
    setFilteredMoviesLocal([]);
    setFilteredSeriesLocal([]);

    navigate(location.pathname, { replace: true });

    if (slug) {
      setSearchTrigger((prev) => prev + 1);
    }
  };

  const handleMovieClick = (movie: SearchMovie) => {
    navigate(
      `/movie/${movie.id}/${movie.title.toLowerCase().replace(/\s+/g, "-")}`,
    );
  };

  const handleSeriesClick = (series: SearchSeries) => {
    navigate(
      `/tv/${series.id}/${series.name.toLowerCase().replace(/\s+/g, "-")}`,
    );
  };

  const handlePersonClick = (person: PersonResult) => {
    navigate(
      `/person/${person.id}/${person.name.toLowerCase().replace(/\s+/g, "-")}`,
    );
  };

  // ===================== RESULTS INFO DISPLAY =====================
  const ResultsInfo = ({ total, label }: { total: number; label: string }) => (
    <div className="flex items-center gap-2 mb-6">
      <h2 className="text-3xl font-bold">{label}</h2>
      <span className="text-text-secondary text-sm bg-bg-tertiary px-2 py-1 rounded-md">
        {total} {total === 1 ? "result" : "results"}
      </span>
    </div>
  );

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <SEO
        title="Search Results | CineAura"
        description="Search movies, TV shows, and people on CineAura."
      />
      <div className="min-h-screen mt-22 sm:mt-20 md:mt-16 bg-bg-primary text-text-primary p-4 md:p-8">
        {/* FILTER FORM */}
        <form className="container mx-auto" onSubmit={handleFilterSubmit}>
          <div className="bg-bg-secondary shadow-sm p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Filter</h1>
              <button
                type="button"
                className="md:hidden cursor-pointer flex items-center justify-self-center w-8 h-8 p-2 bg-bg-tertiary rounded-full"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
            <div className={`${!isFilterOpen && "hidden md:block"}`}>
              <h1 className="text-lg font-semibold mt-6">Genre</h1>

              <div className="flex flex-wrap gap-5 mt-4">
                {MOVIE_GENRES.map((g) => (
                  <label
                    key={g.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGenres.includes(g.id)}
                      onChange={() => toggleGenre(g.id)}
                      className="cursor-pointer"
                    />
                    <span>{g.name}</span>
                  </label>
                ))}
              </div>

              {genreError && (
                <p className="text-red-500 text-sm mt-2">
                  Please select at least one genre.
                </p>
              )}

              <h1 className="text-lg font-semibold mt-6">Country (Optional)</h1>
              <div className="flex flex-wrap gap-5 mt-4">
                {COUNTRIES.map((country) => (
                  <label
                    key={country.iso_3166_1}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCountries.includes(country.iso_3166_1)}
                      onChange={() => toggleCountry(country.iso_3166_1)}
                      className="cursor-pointer"
                    />
                    <span>{country.english_name}</span>
                  </label>
                ))}
              </div>

              <h1 className="text-lg font-semibold mt-6">Release Year</h1>
              <div className="flex gap-4 mt-4 items-center">
                <select
                  className="p-2 rounded cursor-pointer bg-bg-tertiary focus:outline-none font-medium hide-scrollbar"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(Number(e.target.value))}
                >
                  {Array.from(
                    { length: maxYear - minYear + 1 },
                    (_, i) => maxYear - i,
                  ).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>

                <span>to</span>

                <select
                  className="p-2 rounded bg-bg-tertiary cursor-pointer focus:outline-none font-medium hide-scrollbar"
                  value={yearTo}
                  onChange={(e) => setYearTo(Number(e.target.value))}
                >
                  {Array.from(
                    { length: maxYear - minYear + 1 },
                    (_, i) => maxYear - i,
                  ).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  type="submit"
                  className="p-2 w-35 bg-bg-tertiary rounded-lg font-medium cursor-pointer hover:bg-bg-secondary"
                >
                  Apply Filters
                </button>
                {filtersAreActive && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="p-2 w-35 bg-red-600 text-white rounded-lg font-medium cursor-pointer hover:bg-red-700"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* SEARCH RESULTS OR DISCOVER CONTENT — ONLY SHOW IF FILTERS NOT APPLIED */}
        {!filtersAreActive && (
          <div className="container mx-auto mt-12">
            {hasSearchResults ? (
              <>
                {/* SEARCH MOVIES WITH PAGINATION */}
                {searchMovies.length > 0 && (
                  <section id="search-movies-section">
                    <ResultsInfo
                      total={searchMoviesTotalResults}
                      label="Movies"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                      {searchMovies.map((movie) => (
                        <MovieCard
                          key={movie.id}
                          movie={movie}
                          onClick={handleMovieClick}
                        />
                      ))}
                    </div>
                    <Pagination
                      currentPage={searchMoviesPage}
                      totalPages={searchMoviesTotalPages}
                      onPageChange={setSearchMoviesPage}
                      sectionId="search-movies-section"
                    />
                  </section>
                )}

                {/* SEARCH SERIES WITH PAGINATION */}
                {searchSeries.length > 0 && (
                  <section className="mt-12" id="search-series-section">
                    <ResultsInfo
                      total={searchSeriesTotalResults}
                      label="Series"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                      {searchSeries.map((show) => (
                        <SeriesCard
                          key={show.id}
                          series={show}
                          onClick={handleSeriesClick}
                        />
                      ))}
                    </div>
                    <Pagination
                      currentPage={searchSeriesPage}
                      totalPages={searchSeriesTotalPages}
                      onPageChange={setSearchSeriesPage}
                      sectionId="search-series-section"
                    />
                  </section>
                )}

                {/* PERSON */}
                {searchPersons.length > 0 && (
                  <section className="mt-12">
                    <h2 className="text-3xl font-bold mb-6">People</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                      {searchPersons.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handlePersonClick(p)}
                          className="bg-bg-secondary rounded-lg overflow-hidden text-center cursor-pointer hover:scale-[1.02] transition-transform"
                        >
                          <div className="relative w-full pt-[125%]">
                            {p.profile_path ? (
                              <img
                                src={`${IMAGE_BASE_URL}${p.profile_path}`}
                                alt={p.name}
                                className="absolute inset-0 w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-bg-tertiary flex items-center justify-center">
                                <svg
                                  className="w-16 h-16 text-gray-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold truncate">{p.name}</h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* No search results at all */}
                {searchMovies.length === 0 &&
                  searchSeries.length === 0 &&
                  searchPersons.length === 0 && (
                    <div className="mt-50 text-center">
                      <h2 className="text-2xl font-bold text-text-secondary">
                        No results found for "{slug}"
                      </h2>
                      <p className="mt-4 text-text-secondary">
                        Try searching for something else.
                      </p>
                    </div>
                  )}
              </>
            ) : showDiscover ? (
              <>
                {/* DISCOVER POPULAR MOVIES WITH PAGINATION */}
                {discoverMovies.length > 0 && (
                  <section id="discover-movies-section">
                    <ResultsInfo
                      total={discoverMoviesTotalResults}
                      label="Popular Movies"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                      {discoverMovies.map((movie) => (
                        <MovieCard
                          key={movie.id}
                          movie={movie}
                          onClick={handleMovieClick}
                        />
                      ))}
                    </div>
                    <Pagination
                      currentPage={discoverMoviesPage}
                      totalPages={discoverMoviesTotalPages}
                      onPageChange={setDiscoverMoviesPage}
                      sectionId="discover-movies-section"
                    />
                  </section>
                )}

                {/* DISCOVER POPULAR SERIES WITH PAGINATION */}
                {discoverSeries.length > 0 && (
                  <section className="mt-12" id="discover-series-section">
                    <ResultsInfo
                      total={discoverSeriesTotalResults}
                      label="Popular Series"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                      {discoverSeries.map((show) => (
                        <SeriesCard
                          key={show.id}
                          series={show}
                          onClick={handleSeriesClick}
                        />
                      ))}
                    </div>
                    <Pagination
                      currentPage={discoverSeriesPage}
                      totalPages={discoverSeriesTotalPages}
                      onPageChange={setDiscoverSeriesPage}
                      sectionId="discover-series-section"
                    />
                  </section>
                )}
              </>
            ) : null}
          </div>
        )}

        {/* FILTER RESULTS WITH PAGINATION — ONLY SHOW IF FILTERS APPLIED */}
        {filtersAreActive &&
          (filteredMovies.length > 0 || filteredSeries.length > 0) && (
            <div className="container mx-auto mt-12">
              {filteredMovies.length > 0 && (
                <section id="filtered-movies-section">
                  <ResultsInfo
                    total={filteredMoviesTotalResults}
                    label="Movies"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {filteredMovies.map((movie) => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onClick={handleMovieClick}
                      />
                    ))}
                  </div>
                  <Pagination
                    currentPage={filteredMoviesPage}
                    totalPages={filteredMoviesTotalPages}
                    onPageChange={setFilteredMoviesPage}
                    sectionId="filtered-movies-section"
                  />
                </section>
              )}

              {filteredSeries.length > 0 && (
                <section className="mt-12" id="filtered-series-section">
                  <ResultsInfo
                    total={filteredSeriesTotalResults}
                    label="Series"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {filteredSeries.map((show) => (
                      <SeriesCard
                        key={show.id}
                        series={show}
                        onClick={handleSeriesClick}
                      />
                    ))}
                  </div>
                  <Pagination
                    currentPage={filteredSeriesPage}
                    totalPages={filteredSeriesTotalPages}
                    onPageChange={setFilteredSeriesPage}
                    sectionId="filtered-series-section"
                  />
                </section>
              )}
            </div>
          )}

        {/* NO RESULTS MESSAGE */}
        {filtersAreActive &&
          filteredMovies.length === 0 &&
          filteredSeries.length === 0 && (
            <div className="container mx-auto mt-50 text-center">
              <h2 className="text-2xl font-bold text-text-secondary">
                No results found with the selected filters.
              </h2>
              <p className="mt-4 text-text-secondary">
                Try adjusting your filters or search for something else.
              </p>
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

export default SearchResult;
