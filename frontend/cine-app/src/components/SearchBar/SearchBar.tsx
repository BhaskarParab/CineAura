import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Redux/Store";
import { storeSearch } from "../../Redux/SearchDataStoreSlice/SearchDataStoreSlice";
import { useNavigate } from "react-router-dom";
import type {
  PersonResult,
  SearchMovie,
  SearchSeries,
} from "../../types/SearchType";
import darkPlaceholder from "../../assets/images/placeholder-92x138 (1).png";
import placeholder from "../../assets/images/placeholder-92x138.png";

function SearchBar() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [input, setInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDark = useSelector((state: RootState) => state.darkTheme.value);
  const fetchedSearchData = useSelector(
    (state: RootState) => state.searchStoreData.results
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(input);
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    const handleSearch = () =>
      fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${debouncedQuery}&include_adult=false`
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const limit = data.results;
          dispatch(storeSearch(limit));
        })
        .then((err) => {
          console.log(err);
        });

    handleSearch();
  }, [debouncedQuery, apiKey]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setInput("");
        dispatch(storeSearch([])); // Clear search results
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dispatch]);

  const movies = fetchedSearchData.filter(
    (item) => item.media_type === "movie"
  );
  const series = fetchedSearchData.filter((item) => item.media_type === "tv");
  const persons = fetchedSearchData.filter(
    (item) => item.media_type === "person"
  );

  const handleMovieClick = (movie: SearchMovie) => {
    const slug = movie.title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/movie/${movie.id}/${slug}`);
    setInput("");
    dispatch(storeSearch([]));
  };

  const handleSeriesClick = (series: SearchSeries) => {
    const slug = series.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/webseries/${series.id}/${slug}`);
    setInput("");
    dispatch(storeSearch([]));
  };

  const handlePerson = (person: PersonResult) => {
    const slug = person.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/person/${person.id}/${slug}`);
    setInput("");
    dispatch(storeSearch([]));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debouncedQuery.length) {
        const slug = debouncedQuery.toLowerCase().replace(/\s+/g, "-");
        navigate(`/results/${slug}`);
        setInput("");
        dispatch(storeSearch([]));
      }
    }
  };

  const handleSearchClick = () => {
    const slug = debouncedQuery.toLowerCase().replace(/\s+/g, "-");
    navigate(`/results/${slug}`);
    setInput("");
    dispatch(storeSearch([]));
  };

  return (
    <>
      <div ref={wrapperRef} className="relative w-full max-w-md mx-auto">
        <input
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          value={input}
          placeholder="search..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-bg-tertiary text-text-primary
                   border border-none focus:border-none outline-none"
        />

        {/* Search Icon Inside Input */}
        <svg
          onClick={handleSearchClick}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 text-text-secondary"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.0392 15.6244C18.2714 14.084 19.0082 12.1301 19.0082 10.0041C19.0082 5.03127 14.9769 1 10.0041 1C5.03127 1 1 5.03127 1 10.0041C1 14.9769 5.03127 19.0082 10.0041 19.0082C12.1301 19.0082 14.084 18.2714 15.6244 17.0392L21.2921 22.707C21.6828 23.0977 22.3163 23.0977 22.707 22.707C23.0977 22.3163 23.0977 21.6828 22.707 21.2921L17.0392 15.6244ZM10.0041 17.0173C6.1308 17.0173 2.99087 13.8774 2.99087 10.0041C2.99087 6.1308 6.1308 2.99087 10.0041 2.99087C13.8774 2.99087 17.0173 6.1308 17.0173 10.0041C17.0173 13.8774 13.8774 17.0173 10.0041 17.0173Z"
            fill="gray"
          />
        </svg>
        {/* Search Results */}
        {fetchedSearchData.length > 0 && (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="absolute top-full left-0 w-full bg-bg-primary rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto hide-scrollbar mt-1 p-2"
          >
            {/* Movies */}
            {movies.length > 0 && (
              <>
                <h3 className="text-text-secondary px-2 py-1 text-xs uppercase tracking-wide">
                  Movies
                </h3>
                {movies.map((ele) => (
                  <div
                    key={ele.id}
                    onClick={() => handleMovieClick(ele)}
                    className="flex items-center p-2 hover:bg-bg-tertiary cursor-pointer rounded-md"
                  >
                    <img
                      src={
                        ele.poster_path
                          ? `https://image.tmdb.org/t/p/w92${ele.poster_path}`
                          : isDark === "dark"
                          ? darkPlaceholder
                          : placeholder
                      }
                      alt=""
                      className="w-12 h-16 object-cover rounded-md mr-3"
                    />
                    <div className="text-sm text-text-primary font-medium">
                      {ele.title}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Series */}
            {series.length > 0 && (
              <>
                <h3 className="text-text-secondary px-2 py-1 text-xs uppercase tracking-wide mt-2">
                  Series
                </h3>
                {series.map((ele) => (
                  <div
                    key={ele.id}
                    onClick={() => handleSeriesClick(ele)}
                    className="flex items-center p-2 hover:bg-bg-tertiary cursor-pointer rounded-md"
                  >
                    <img
                      src={
                        ele.poster_path
                          ? `https://image.tmdb.org/t/p/w92${ele.poster_path}`
                          : isDark === "dark"
                          ? darkPlaceholder
                          : placeholder
                      }
                      alt={isDark === "dark" ? placeholder : darkPlaceholder}
                      className="w-12 h-16 object-cover rounded-md mr-3"
                    />
                    <div className="text-sm text-text-primary font-medium">
                      {ele.name}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Persons */}
            {persons.length > 0 && (
              <>
                <h3 className="text-text-secondary px-2 py-1 text-xs uppercase tracking-wide mt-2">
                  People
                </h3>
                {persons.map((ele) => (
                  <div
                    key={ele.id}
                    onClick={() => handlePerson(ele)}
                    className="flex items-center p-2 hover:bg-bg-tertiary cursor-pointer rounded-md"
                  >
                    <img
                      src={
                        ele.profile_path
                          ? `https://image.tmdb.org/t/p/w92${ele.profile_path}`
                          : "data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjNjY2IiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjUiIC8+PHBhdGggZD0iTTEyIDE0Yy04IDAtOCA2LTggNmgxNnMwLTYtOC02eiIgLz48L3N2Zz4="
                      }
                      alt="N/A"
                      className="w-12 h-12 object-cover rounded-full mr-3"
                    />
                    <div className="text-sm text-text-primary font-medium">
                      {ele.name}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default SearchBar;
