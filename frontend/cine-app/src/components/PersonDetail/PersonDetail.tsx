import { useParams } from "react-router";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/LoaderSlice/LoaderSlice";

// Define the TypeScript interface for TMDB person data
interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string;
  deathday?: string;
  place_of_birth: string;
  profile_path: string;
  known_for_department: string;
  also_known_as: string[];
  popularity: number;
  imdb_id: string;
  homepage?: string;
}

interface PersonCredits {
  cast: {
    id: number;
    title?: string;
    name?: string; // For TV shows
    character: string;
    release_date?: string;
    first_air_date?: string; // For TV shows
    poster_path: string;
    vote_average: number;
    media_type: string; // "movie" or "tv"
  }[];
  crew: {
    id: number;
    title?: string;
    name?: string; // For TV shows
    job: string;
    release_date?: string;
    first_air_date?: string; // For TV shows
    poster_path: string;
    vote_average: number;
    media_type: string; // "movie" or "tv"
  }[];
}

// Updated interface to handle both movies and TV shows
interface MediaItem {
  id: number;
  title: string; // Will always have a value after processing
  release_date?: string;
  first_air_date?: string;
  poster_path: string;
  character?: string;
  vote_average?: number;
  media_type: string;
}

function PersonDetail() {
  const { personId } = useParams<{ personId: string }>();
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [credits, setCredits] = useState<PersonCredits | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAllMovies, setShowAllMovies] = useState(false);
  const [showAllTVShows, setShowAllTVShows] = useState(false);
  const [showAllOthers, setShowAllOthers] = useState(false);
  const apiKey = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        dispatch(showLoader());
        setError(null);

        // Fetch person details
        const personResponse = await fetch(
          `https://api.themoviedb.org/3/person/${personId}?api_key=${apiKey}&language=en-US`
        );

        if (!personResponse.ok) {
          throw new Error("Failed to fetch person details");
        }

        const personData = await personResponse.json();
        setPerson(personData);

        // Fetch person credits
        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/person/${personId}/combined_credits?api_key=${apiKey}&language=en-US`
        );

        if (!creditsResponse.ok) {
          throw new Error("Failed to fetch person credits");
        }

        const creditsData = await creditsResponse.json();
        setCredits(creditsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        dispatch(hideLoader());
      }
    };

    if (personId) {
      fetchPersonDetails();
    }
  }, [personId, apiKey, dispatch]);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate age
  const calculateAge = (birthday: string, deathday?: string) => {
    if (!birthday) return "Unknown";

    const birthDate = new Date(birthday);
    const endDate = deathday ? new Date(deathday) : new Date();

    let age = endDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = endDate.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && endDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Get movies (at least 20)
  const getMovies = (): MediaItem[] => {
    if (!credits?.cast) return [];

    // Filter only movies and ensure title is always defined
    const movies = credits.cast
      .filter((item) => item.media_type === "movie")
      .map((item) => ({
        ...item,
        title: item.title || "Unknown Title",
      }));

    // Sort by release date (newest first)
    const sortedMovies = movies.sort((a, b) => {
      if (!a.release_date) return 1;
      if (!b.release_date) return -1;
      return (
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
      );
    });

    // Return at least 20 movies, or all if less than 20
    return showAllMovies ? sortedMovies : sortedMovies.slice(0, 20);
  };

  // Get TV shows (at least 20)
  const getTVShows = (): MediaItem[] => {
    if (!credits?.cast) return [];

    // Filter only TV shows and ensure title is always defined
    const tvShows = credits.cast
      .filter((item) => item.media_type === "tv")
      .map((item) => ({
        ...item,
        title: item.name || item.title || "Unknown Title",
      }));

    // Sort by first air date (newest first)
    const sortedTVShows = tvShows.sort((a, b) => {
      if (!a.first_air_date) return 1;
      if (!b.first_air_date) return -1;
      return (
        new Date(b.first_air_date).getTime() -
        new Date(a.first_air_date).getTime()
      );
    });

    // Return at least 20 TV shows, or all if less than 20
    return showAllTVShows ? sortedTVShows : sortedTVShows.slice(0, 20);
  };

  // Get other media (at least 20)
  const getOthers = (): MediaItem[] => {
    if (!credits?.cast) return [];

    // Filter only media that is not movie or tv and ensure title is always defined
    const others = credits.cast
      .filter((item) => item.media_type !== "movie" && item.media_type !== "tv")
      .map((item) => ({
        ...item,
        title: item.title || item.name || "Unknown Title",
      }));

    // Sort by release date (newest first)
    const sortedOthers = others.sort((a, b) => {
      const dateA = a.release_date || a.first_air_date;
      const dateB = b.release_date || b.first_air_date;

      if (!dateA) return 1;
      if (!dateB) return -1;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    // Return at least 20 items, or all if less than 20
    return showAllOthers ? sortedOthers : sortedOthers.slice(0, 20);
  };

  // Handle navigation to movie details
  const handleMovieClick = (movie: MediaItem) => {
    const slug = movie.title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/movie/${movie.id}/${slug}`);
  };

  // Handle navigation to TV show details
  const handleTVShowClick = (tvShow: MediaItem) => {
    const slug = tvShow.title.toLowerCase().replace(/\s+/g, "-");
    navigate(`/webseries/${tvShow.id}/${slug}`);
  };

  // Handle navigation to other media details
  const handleOtherClick = (item: MediaItem) => {
    // Navigate based on media type
    if (item.media_type === "movie") {
      const slug = item.title.toLowerCase().replace(/\s+/g, "-");
      navigate(`/movie/${item.id}/${slug}`);
    } else if (item.media_type === "tv") {
      const slug = item.title.toLowerCase().replace(/\s+/g, "-");
      navigate(`/webseries/${item.id}/${slug}`);
    } else {
      // For other media types, you might need to handle differently
      // For now, we'll just log it
      console.log("Unknown media type:", item.media_type);
    }
  };

  if (error || !person) {
    return (
      <div className="flex justify-center items-center h-screen bg-bg-primary">
        <div className="text-center p-8 rounded-xl bg-bg-secondary shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-text-primary">
            Person not found
          </h2>
          <p className="text-text-secondary">
            {error || "Please try another person"}
          </p>
        </div>
      </div>
    );
  }

  const castList = credits?.cast ?? [];
  const movies = getMovies();
  const tvShows = getTVShows();
  const others = getOthers();
  const hasMoreMovies =
    castList.filter((item) => item.media_type === "movie").length > 20;
  const hasMoreTVShows =
    castList.filter((item) => item.media_type === "tv").length > 20;
  const hasMoreOthers =
    castList.filter(
      (item) => item.media_type !== "movie" && item.media_type !== "tv"
    ).length > 20;

  // Get counts for each category
  const movieCount =
    castList.filter((item) => item.media_type === "movie").length || 0;
  const tvShowCount =
    castList.filter((item) => item.media_type === "tv").length || 0;
  const otherCount =
    castList.filter(
      (item) => item.media_type !== "movie" && item.media_type !== "tv"
    ).length || 0;

  return (
    <div className="bg-bg-primary text-text-primary mt-12 sm:mt-14 min-h-screen">
      {/* Hero Section with Backdrop */}
      <div className="relative">
        {/* Backdrop Image Container */}
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          {person.profile_path ? (
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${person.profile_path})`,
              }}
            ></div>
          ) : (
            <div className="bg-bg-secondary flex h-full w-full items-center justify-center">
              <span className="text-text-secondary">No Profile Image Available</span>
            </div>
          )}
          <div
            className="absolute inset-0 bg-linear-to-t from-black/70 from-10% to-transparent"
          ></div>
        </div>

        {/* Person Title and Basic Info */}
        <div className="relative container mx-auto px-4 -mt-20 md:-mt-22">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="md:w-1/3 lg:w-1/4">
              <div className="rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300">
                {person.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                    alt={person.name}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="bg-bg-secondary h-[450px] flex items-center justify-center">
                    <span className="text-muted">
                      No Image
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Person Info */}
            <div className="md:w-2/2 lg:w-3/4 pb-6">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-text-primary sm:text-white">
                {person.name}
              </h1>

              <div className="flex flex-wrap gap-3 text-sm text-text-secondary sm:text-gray-300 mb-6">
                <span>{person.known_for_department}</span>
                <span>•</span>
                <span>Born {formatDate(person.birthday)}</span>
                <span>•</span>
                <span>
                  {person.deathday
                    ? `Died ${formatDate(person.deathday)}`
                    : `Age ${calculateAge(person.birthday, person.deathday)}`}
                </span>
                {person.place_of_birth && (
                  <>
                    <span>•</span>
                    <span>{person.place_of_birth}</span>
                  </>
                )}
              </div>

              {/* Biography */}
              <div className="container mx-auto">
                <div className="max-w-4xl">
                  <h2 className="text-2xl font-bold mb-4 text-text-primary">
                    Biography
                  </h2>
                  <p className="text-text-secondary leading-relaxed text-lg">
                    {person.biography || "No biography available."}
                  </p>
                </div>
              </div>

              {/* Popularity and Basic Stats */}
              <div className="flex flex-wrap gap-4 mt-4 mb-6">
                <div className="bg-bg-secondary bg-opacity-60 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px]">
                  <div className="flex items-center">
                    <span className="text-3xl font-bold mr-1 text-yellow-400">
                      {person.popularity.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-text-secondary text-sm">
                    Popularity
                  </span>
                </div>

                <div className="bg-bg-secondary bg-opacity-60 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px]">
                  <span className="text-text-primary font-medium">
                    {person.known_for_department}
                  </span>
                  <p className="text-text-secondary text-sm">Known for</p>
                </div>

                <div className="bg-bg-secondary bg-opacity-60 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px]">
                  <span className="text-text-primary font-medium">
                    {credits?.cast?.length || 0}
                  </span>
                  <p className="text-text-secondary text-sm">Total Credits</p>
                </div>

                <div className="bg-bg-secondary bg-opacity-60 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px]">
                  <span className="text-text-primary font-medium">
                    {movieCount}
                  </span>
                  <p className="text-text-secondary text-sm">Movies</p>
                </div>

                <div className="bg-bg-secondary bg-opacity-60 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px]">
                  <span className="text-text-primary font-medium">
                    {tvShowCount}
                  </span>
                  <p className="text-text-secondary text-sm">TV Shows</p>
                </div>

                {otherCount > 0 && (
                  <div className="bg-bg-secondary bg-opacity-60 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px]">
                    <span className="text-text-primary font-medium">
                      {otherCount}
                    </span>
                    <p className="text-text-secondary text-sm">Other</p>
                  </div>
                )}

                {person.homepage && (
                  <div className="bg-bg-secondary bg-opacity-60 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px]">
                    <a
                      href={person.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      Visit Website
                    </a>
                    <p className="text-text-secondary text-sm">Official Site</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Additional Details */}
          <div className="lg:col-span-1">
            {/* Also Known As */}
            {person.also_known_as && person.also_known_as.length > 0 && (
              <div className="bg-card rounded-xl p-6 mb-6 shadow-md border border-border">
                <h3 className="text-lg font-semibold mb-4 text-text-primary">
                  Also Known As
                </h3>
                <div className="space-y-3">
                  {person.also_known_as.map((name, index) => (
                    <div
                      key={index}
                      className="p-2 rounded-lg transition-colors"
                    >
                      <span className="text-text-primary">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-card rounded-xl p-6 shadow-md border border-border">
              <h3 className="text-lg font-semibold mb-4 text-text-primary">
                Additional Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Birthday</span>
                  <span className="text-text-primary font-medium">
                    {formatDate(person.birthday)}
                  </span>
                </div>
                {person.deathday && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Deathday</span>
                    <span className="text-text-primary font-medium">
                      {formatDate(person.deathday)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-secondary">Age</span>
                  <span className="text-text-primary font-medium">
                    {calculateAge(person.birthday, person.deathday)}
                  </span>
                </div>
                {person.place_of_birth && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Place of Birth</span>
                    <span className="text-text-primary font-medium">
                      {person.place_of_birth}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Credits</span>
                  <span className="text-text-primary font-medium">
                    {credits?.cast?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Movies</span>
                  <span className="text-text-primary font-medium">
                    {movieCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">TV Shows</span>
                  <span className="text-text-primary font-medium">
                    {tvShowCount}
                  </span>
                </div>
                {otherCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Other</span>
                    <span className="text-text-primary font-medium">
                      {otherCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            {/* Movies Section */}
            {movies.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-text-primary">
                    Movies
                  </h2>
                  <div className="text-text-secondary text-sm">
                    Showing{" "}
                    {showAllMovies
                      ? movies.length
                      : Math.min(20, movies.length)}{" "}
                    of {movieCount} movies
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movies.map((movie) => (
                    <div
                      key={movie.id}
                      onClick={() => handleMovieClick(movie)}
                      className="bg-card cursor-pointer rounded-xl overflow-hidden shadow-md border border-border hover:shadow-xl transition-all transform"
                    >
                      {movie.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                          alt={movie.title}
                          className="w-full h-64 sm:h-72 object-cover"
                        />
                      ) : (
                        <div className="bg-bg-secondary h-64 sm:h-72 flex items-center justify-center">
                          <span className="text-muted text-sm">No Image</span>
                        </div>
                      )}
                      <div className="p-3">
                        <p className="font-semibold truncate text-text-primary">
                          {movie.title}
                        </p>
                        <p className="text-text-secondary text-sm">
                          {movie.release_date
                            ? new Date(movie.release_date).getFullYear()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show More/Less Button */}
                {hasMoreMovies && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowAllMovies(!showAllMovies)}
                      className="bg-accent cursor-pointer hover:bg-accent-hover text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {showAllMovies
                        ? "Show Less"
                        : `Show All (${movieCount}) Movies`}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TV Shows Section */}
            {tvShows.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-text-primary">
                    Web Series
                  </h2>
                  <div className="text-text-secondary text-sm">
                    Showing{" "}
                    {showAllTVShows
                      ? tvShows.length
                      : Math.min(20, tvShows.length)}{" "}
                    of {tvShowCount} series
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {tvShows.map((show) => (
                    <div
                      key={show.id}
                      onClick={() => handleTVShowClick(show)}
                      className="bg-card cursor-pointer rounded-xl overflow-hidden shadow-md border border-border hover:shadow-xl transition-all transform"
                    >
                      {show.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${show.poster_path}`}
                          alt={show.title}
                          className="w-full h-64 sm:h-72 object-cover"
                        />
                      ) : (
                        <div className="bg-bg-secondary h-64 sm:h-72 flex items-center justify-center">
                          <span className="text-muted text-sm">No Image</span>
                        </div>
                      )}
                      <div className="p-3">
                        <p className="font-semibold truncate text-text-primary">
                          {show.title}
                        </p>
                        <p className="text-text-secondary text-sm">
                          {show.first_air_date
                            ? new Date(show.first_air_date).getFullYear()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show More/Less Button */}
                {hasMoreTVShows && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowAllTVShows(!showAllTVShows)}
                      className="bg-accent cursor-pointer hover:bg-accent-hover text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {showAllTVShows
                        ? "Show Less"
                        : `Show All (${tvShowCount}) Series`}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Other Media Section */}
            {others.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-text-primary">
                    Other Works
                  </h2>
                  <div className="text-text-secondary text-sm">
                    Showing{" "}
                    {showAllOthers
                      ? others.length
                      : Math.min(20, others.length)}{" "}
                    of {otherCount} other works
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {others.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleOtherClick(item)}
                      className="bg-card cursor-pointer rounded-xl overflow-hidden shadow-md border border-border hover:shadow-xl transition-all transform"
                    >
                      {item.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${item.poster_path}`}
                          alt={item.title}
                          className="w-full h-64 sm:h-72 object-cover"
                        />
                      ) : (
                        <div className="bg-bg-secondary h-64 sm:h-72 flex items-center justify-center">
                          <span className="text-muted text-sm">No Image</span>
                        </div>
                      )}
                      <div className="p-3">
                        <p className="font-semibold truncate text-text-primary">
                          {item.title}
                        </p>
                        <p className="text-text-secondary text-sm">
                          {item.media_type}
                        </p>
                        <p className="text-text-secondary text-sm">
                          {item.release_date || item.first_air_date
                            ? new Date(
                                item.release_date || item.first_air_date!
                              ).getFullYear()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show More/Less Button */}
                {hasMoreOthers && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setShowAllOthers(!showAllOthers)}
                      className="bg-accent cursor-pointer hover:bg-accent-hover text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      {showAllOthers
                        ? "Show Less"
                        : `Show All (${otherCount}) Other Works`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonDetail;
