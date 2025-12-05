import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { showLoader, hideLoader } from "../../Redux/LoaderSlice/LoaderSlice";
import {
  setFilteredMovies,
  setFilteredSeries,
} from "../../Redux/FilteredResultsSlice/FilteredResultsSlice";
import type {
  PersonResult,
  SearchItem,
  SearchMovie,
  SearchSeries,
} from "../../types/SearchType";
import type { RootState } from "../../Redux/Store";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Add this interface near your other type imports
interface QueryParams {
  yearFrom: string;
  yearTo: string;
  genres?: string;
  countries?: string;
}

// Movie genres
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

// TV genres
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

// Countries list from TMDB
const COUNTRIES = [
  { iso_3166_1: "US", english_name: "United States" },
  { iso_3166_1: "GB", english_name: "United Kingdom" },
  { iso_3166_1: "FR", english_name: "France" },
  { iso_3166_1: "DE", english_name: "Germany" },
  { iso_3166_1: "IT", english_name: "Italy" },
  { iso_3166_1: "JP", english_name: "Japan" },
  { iso_3166_1: "KR", english_name: "South Korea" },
  { iso_3166_1: "CN", english_name: "China" },
  { iso_3166_1: "IN", english_name: "India" },
  { iso_3166_1: "CA", english_name: "Canada" },
  { iso_3166_1: "AU", english_name: "Australia" },
  { iso_3166_1: "MX", english_name: "Mexico" },
  { iso_3166_1: "ES", english_name: "Spain" },
  { iso_3166_1: "BR", english_name: "Brazil" },
  { iso_3166_1: "RU", english_name: "Russia" },
  { iso_3166_1: "SE", english_name: "Sweden" },
  { iso_3166_1: "NO", english_name: "Norway" },
  { iso_3166_1: "DK", english_name: "Denmark" },
  { iso_3166_1: "FI", english_name: "Finland" },
  { iso_3166_1: "NL", english_name: "Netherlands" },
  { iso_3166_1: "BE", english_name: "Belgium" },
  { iso_3166_1: "AT", english_name: "Austria" },
  { iso_3166_1: "CH", english_name: "Switzerland" },
  { iso_3166_1: "PL", english_name: "Poland" },
  { iso_3166_1: "CZ", english_name: "Czech Republic" },
  { iso_3166_1: "HU", english_name: "Hungary" },
  { iso_3166_1: "GR", english_name: "Greece" },
  { iso_3166_1: "TR", english_name: "Turkey" },
  { iso_3166_1: "IL", english_name: "Israel" },
  { iso_3166_1: "TH", english_name: "Thailand" },
  { iso_3166_1: "SG", english_name: "Singapore" },
  { iso_3166_1: "MY", english_name: "Malaysia" },
  { iso_3166_1: "ID", english_name: "Indonesia" },
  { iso_3166_1: "PH", english_name: "Philippines" },
  { iso_3166_1: "NZ", english_name: "New Zealand" },
  { iso_3166_1: "ZA", english_name: "South Africa" },
  { iso_3166_1: "EG", english_name: "Egypt" },
  { iso_3166_1: "NG", english_name: "Nigeria" },
  { iso_3166_1: "KE", english_name: "Kenya" },
  { iso_3166_1: "AR", english_name: "Argentina" },
  { iso_3166_1: "CL", english_name: "Chile" },
  { iso_3166_1: "CO", english_name: "Colombia" },
  { iso_3166_1: "PE", english_name: "Peru" },
  { iso_3166_1: "VE", english_name: "Venezuela" },
  { iso_3166_1: "IE", english_name: "Ireland" },
  { iso_3166_1: "PT", english_name: "Portugal" },
  { iso_3166_1: "RO", english_name: "Romania" },
  { iso_3166_1: "BG", english_name: "Bulgaria" },
  { iso_3166_1: "UA", english_name: "Ukraine" },
  { iso_3166_1: "IS", english_name: "Iceland" },
];

// Map movie genres to TV genres
const mapMovieToTVGenres = (movieGenreIds: number[]): number[] => {
  const tvGenreIds: number[] = [];

  movieGenreIds.forEach((movieId) => {
    const movieGenre = MOVIE_GENRES.find((g) => g.id === movieId);
    if (movieGenre) {
      const tvGenre = TV_GENRES.find(
        (tv) =>
          tv.name.toLowerCase().includes(movieGenre.name.toLowerCase()) ||
          movieGenre.name.toLowerCase().includes(tv.name.toLowerCase())
      );
      if (tvGenre) {
        tvGenreIds.push(tvGenre.id);
      }
    }
  });

  return tvGenreIds;
};

function SearchResult() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_API_KEY;

  // Get filtered results from Redux store
  const filteredMovies = useSelector(
    (state: RootState) => state.filteredResults.filteredMovies
  );
  const filteredSeries = useSelector(
    (state: RootState) => state.filteredResults.filteredSeries
  );

  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [yearFrom, setYearFrom] = useState<number>(1990);
  const [yearTo, setYearTo] = useState<number>(new Date().getFullYear());
  const [filtersAreActive, setFiltersAreActive] = useState<boolean>(false);
  const [searchTrigger, setSearchTrigger] = useState<number>(0);

  // State for validation errors
  const [genreError, setGenreError] = useState<boolean>(false);

  const minYear = 1900;
  const maxYear = new Date().getFullYear();

  // Function to fetch filtered data
  const fetchFilteredResults = useCallback(async (
    genres: number[],
    countries: string[],
    fromYear: number,
    toYear: number
  ) => {
    dispatch(showLoader());
    try {
      const tvGenreIds = mapMovieToTVGenres(genres);

      const moviePromises = [];
      const seriesPromises = [];

      for (let page = 1; page <= 5; page++) {
        // MODIFIED: Build movie URL conditionally with country filter
        let movieURL = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genres.join(
          ","
        )}&primary_release_date.gte=${fromYear}-01-01&primary_release_date.lte=${toYear}-12-31&page=${page}`;

        // Add country filter only if countries are selected
        if (countries.length > 0) {
          movieURL += `&with_origin_country=${countries.join(",")}`;
        }

        moviePromises.push(fetch(movieURL));
      }

      for (let page = 1; page <= 5; page++) {
        // MODIFIED: Build series URL conditionally with country filter
        let seriesURL = `https://api.themoviedb.org/3/discover/tv?api_key=${apiKey}&with_genres=${tvGenreIds.join(
          ","
        )}&first_air_date.gte=${fromYear}-01-01&first_air_date.lte=${toYear}-12-31&page=${page}`;

        // Add country filter only if countries are selected
        if (countries.length > 0) {
          seriesURL += `&with_origin_country=${countries.join(",")}`;
        }

        seriesPromises.push(fetch(seriesURL));
      }

      const [movieResponses, seriesResponses] = await Promise.all([
        Promise.all(moviePromises),
        Promise.all(seriesPromises),
      ]);

      let allMovies: SearchMovie[] = [];
      for (const res of movieResponses) {
        const data = await res.json();
        allMovies = [...allMovies, ...(data.results || [])];
      }

      let allSeries: SearchSeries[] = [];
      for (const res of seriesResponses) {
        const data = await res.json();
        allSeries = [...allSeries, ...(data.results || [])];
      }

      dispatch(setFilteredMovies(allMovies));
      dispatch(setFilteredSeries(allSeries));
    } catch (err) {
      console.error("Filter error:", err);
    } finally {
      dispatch(hideLoader());
    }
  },[apiKey, dispatch]);

  // Check for URL parameters on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    // Check if any filter parameters are present
    const hasGenres = queryParams.has("genres");
    const hasCountries = queryParams.has("countries");
    const hasYearFrom = queryParams.has("yearFrom");
    const hasYearTo = queryParams.has("yearTo");

    if ((hasGenres || hasCountries) && hasYearFrom && hasYearTo) {
      const genresParam = queryParams.get("genres");
      const countriesParam = queryParams.get("countries");
      const yearFromParam = queryParams.get("yearFrom");
      const yearToParam = queryParams.get("yearTo");

      // MODIFIED: Parse genres and countries safely
      const genres = genresParam ? genresParam.split(",").map(Number) : [];
      const countries = countriesParam ? countriesParam.split(",") : [];
      const fromYear = Number(yearFromParam);
      const toYear = Number(yearToParam);

      setSelectedGenres(genres);
      setSelectedCountries(countries);
      setYearFrom(fromYear);
      setYearTo(toYear);
      setFiltersAreActive(true);

      setResults([]);

      // Fetch data based on URL parameters
      fetchFilteredResults(genres, countries, fromYear, toYear);
    } else {
      // If no filter parameters are present, ensure filters are not active
      if (filtersAreActive) {
        setFiltersAreActive(false);
        setSelectedGenres([]);
        setSelectedCountries([]);
        setYearFrom(1990);
        setYearTo(new Date().getFullYear());
        // Trigger a search to show search results
        setSearchTrigger((prev) => prev + 1);
      }
    }
  }, [location.search]);

  // Search API (MULTI) - only runs if filters are NOT active
  useEffect(() => {
    // Don't fetch initial search if filters are already active from URL
    if (!slug) {
      dispatch(hideLoader());
      return;
    }

    const fetchSearch = async () => {
      if (filtersAreActive) {
        // Reset all filter-related state
        setSelectedGenres([]);
        setSelectedCountries([]);
        setYearFrom(1990);
        setYearTo(new Date().getFullYear());
        setFiltersAreActive(false);
        setGenreError(false);

        // Clear filtered results from Redux
        dispatch(setFilteredMovies([]));
        dispatch(setFilteredSeries([]));

        setResults([]);
      }
      try {
        dispatch(showLoader());
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${slug}&include_adult=false`
        );
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Search Error:", err);
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchSearch();
  }, [slug, dispatch, apiKey, searchTrigger]);

  const movies = results.filter(
    (item): item is SearchMovie => item.media_type === "movie"
  );
  const series = results.filter(
    (item): item is SearchSeries => item.media_type === "tv"
  );
  const persons = results.filter(
    (item): item is PersonResult => item.media_type === "person"
  );

  // ===================== HANDLERS =====================
  const toggleGenre = (id: number) => {
    // Clear error message when user interacts with checkboxes
    if (genreError) {
      setGenreError(false);
    }
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const toggleCountry = (iso: string) => {
    setSelectedCountries((prev) =>
      prev.includes(iso) ? prev.filter((c) => c !== iso) : [...prev, iso]
    );
  };

  // MODIFIED: handleFilterSubmit with validation
  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear search results when applying filters
    setResults([]);

    // Set filters as active
    setFiltersAreActive(true);

    // Validation: Check if at least one genre or country is selected
    if (selectedGenres.length === 0) {
      setGenreError(true);
      return; // Stop form submission
    }

    // MODIFIED: Build query parameters conditionally
    const queryParams: QueryParams = {
      yearFrom: yearFrom.toString(),
      yearTo: yearTo.toString(),
    };

    // Only add genres to query params if they're selected
    if (selectedGenres.length > 0) {
      queryParams.genres = selectedGenres.join(",");
    }

    // Only add countries to query params if they're selected
    if (selectedCountries.length > 0) {
      queryParams.countries = selectedCountries.join(",");
    }

    // Create URLSearchParams correctly to avoid type errors
    const searchParams = new URLSearchParams();
    searchParams.set("yearFrom", queryParams.yearFrom);
    searchParams.set("yearTo", queryParams.yearTo);
    if (queryParams.genres) {
      searchParams.set("genres", queryParams.genres);
    }
    if (queryParams.countries) {
      searchParams.set("countries", queryParams.countries);
    }

    // Navigate to the new URL with query parameters
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  const handleResetFilters = () => {
    // Reset all filter-related state
    setSelectedGenres([]);
    setSelectedCountries([]);
    setYearFrom(1990);
    setYearTo(new Date().getFullYear());
    setFiltersAreActive(false);
    setGenreError(false);

    // Clear filtered results from Redux
    dispatch(setFilteredMovies([]));
    dispatch(setFilteredSeries([]));

    // Navigate to the current path without query parameters
    navigate(location.pathname, { replace: true });

    // If there's a search slug, re-fetch search results
    if (slug) {
      setSearchTrigger((prev) => prev + 1);
      const fetchSearch = async () => {
        try {
          dispatch(showLoader());
          const res = await fetch(
            `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${slug}&include_adult=false`
          );
          const data = await res.json();
          setResults(data.results || []);
        } catch (err) {
          console.error("Search Error:", err);
        } finally {
          dispatch(hideLoader());
        }
      };

      fetchSearch();
    }
  };

  const handleMovieClick = (movie: SearchMovie) => {
    navigate(
      `/movie/${movie.id}/${movie.title.toLowerCase().replace(/\s+/g, "-")}`
    );
  };

  const handleSeriesClick = (series: SearchSeries) => {
    navigate(
      `/webseries/${series.id}/${series.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`
    );
  };

  const handlePersonClick = (person: PersonResult) => {
    navigate(
      `/person/${person.id}/${person.name.toLowerCase().replace(/\s+/g, "-")}`
    );
  };

  // ===================== RENDER =====================
  return (
    <div className="min-h-screen mt-22 sm:mt-20 md:mt-16 bg-bg-primary text-text-primary p-4 md:p-8">
      {/* FILTER FORM */}
      <form className="container mx-auto" onSubmit={handleFilterSubmit}>
        <div className="bg-bg-secondary shadow-sm p-6 rounded-lg">
          <h1 className="text-2xl font-bold">Filter</h1>

          {/* GENRE */}
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

          {/* VALIDATION MESSAGE */}
          {genreError && (
            <p className="text-red-500 text-sm mt-2">
              Please select at least one genre.
            </p>
          )}

          {/* COUNTRIES */}
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

          {/* YEAR SELECTION */}
          <h1 className="text-lg font-semibold mt-6">Release Year</h1>
          <div className="flex gap-4 mt-4 items-center">
            <select
              className="p-2 rounded cursor-pointer bg-bg-tertiary focus:outline-none font-medium hide-scrollbar"
              value={yearFrom}
              onChange={(e) => setYearFrom(Number(e.target.value))}
            >
              {Array.from(
                { length: maxYear - minYear + 1 },
                (_, i) => maxYear - i
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
                (_, i) => maxYear - i
              ).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* BUTTONS */}
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
      </form>

      {/* SEARCH RESULTS (MULTI API) — ONLY SHOW IF FILTERS NOT APPLIED */}
      {!filtersAreActive && (
        <div className="container mx-auto mt-12">
          {results.length > 0 && (
            <>
              {/* MOVIES */}
              {movies.length > 0 && (
                <section>
                  <h2 className="text-3xl font-bold mb-6">Movies</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {movies.map((movie) => (
                      <div
                        key={movie.id}
                        onClick={() => handleMovieClick(movie)}
                        className="bg-bg-secondary rounded-lg overflow-hidden cursor-pointer"
                      >
                        <div className="relative w-full pt-[150%]">
                          {movie.poster_path ? (
                            <img
                              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                              alt={movie.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-bg-tertiary flex items-center justify-center">
                              <span className="text-text-secondary">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3
                            className="text-lg font-semibold text-text-primary truncate"
                            title={movie.title}
                          >
                            {movie.title}
                          </h3>
                          <p className="text-text-secondary text-sm">
                            {movie.release_date
                              ? new Date(movie.release_date).getFullYear()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* SERIES */}
              {series.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-3xl font-bold mb-6">Series</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {series.map((show) => (
                      <div
                        key={show.id}
                        onClick={() => handleSeriesClick(show)}
                        className="bg-bg-tertiary rounded-lg overflow-hidden cursor-pointer"
                      >
                        <div className="relative w-full pt-[150%]">
                          {show.poster_path ? (
                            <img
                              src={`${IMAGE_BASE_URL}${show.poster_path}`}
                              alt={show.name}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-bg-tertiary flex items-center justify-center">
                              <span className="text-text-secondary">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3
                            className="text-lg font-semibold text-text-primary truncate"
                            title={show.name}
                          >
                            {show.name}
                          </h3>
                          <p className="text-text-secondary text-sm">
                            {show.first_air_date
                              ? new Date(show.first_air_date).getFullYear()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* PERSON */}
              {persons.length > 0 && (
                <section className="mt-12">
                  <h2 className="text-3xl font-bold mb-6">People</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {persons.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handlePersonClick(p)}
                        className="bg-bg-secondary rounded-lg overflow-hidden text-center cursor-pointer"
                      >
                        <div className="relative w-full pt-[125%]">
                          {p.profile_path ? (
                            <img
                              src={`${IMAGE_BASE_URL}${p.profile_path}`}
                              alt={p.name}
                              className="absolute inset-0 w-full h-full object-cover"
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
            </>
          )}
        </div>
      )}

      {/* FILTER RESULTS BELOW — ONLY SHOW IF FILTERS APPLIED */}
      {filtersAreActive &&
        (filteredMovies.length > 0 || filteredSeries.length > 0) && (
          <div className="container mx-auto mt-12">
            {filteredMovies.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-6">Movies</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {filteredMovies.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => handleMovieClick(movie)}
                      className="bg-bg-secondary rounded-lg cursor-pointer overflow-hidden"
                    >
                      <div className="relative w-full pt-[150%]">
                        {movie.poster_path ? (
                          <img
                            src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                            alt={movie.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-bg-tertiary flex items-center justify-center">
                            <span className="text-text-secondary">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold truncate">
                          {movie.title}
                        </h3>
                        <p className="text-text-secondary text-sm">
                          {movie.release_date
                            ? new Date(movie.release_date).getFullYear()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {filteredSeries.length > 0 && (
              <section className="mt-12">
                <h2 className="text-3xl font-bold mb-6">Series</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                  {filteredSeries.map((show) => (
                    <div
                      key={show.id}
                      onClick={() => handleSeriesClick(show)}
                      className="bg-bg-secondary rounded-lg cursor-pointer overflow-hidden"
                    >
                      <div className="relative w-full pt-[150%]">
                        {show.poster_path ? (
                          <img
                            src={`${IMAGE_BASE_URL}${show.poster_path}`}
                            alt={show.name}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-bg-tertiary flex items-center justify-center">
                            <span className="text-text-secondary">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold truncate">{show.name}</h3>
                        <p className="text-text-secondary text-sm">
                          {show.first_air_date
                            ? new Date(show.first_air_date).getFullYear()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
  );
}

export default SearchResult;
