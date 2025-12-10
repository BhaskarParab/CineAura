import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { MovieDetailType, CrewMember } from "../../types/MovieDetail";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/LoaderSlice/LoaderSlice";

interface PersonType {
  id: number;
  name: string;
}

function MovieDetail() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get movie ID from URL parameters
  const { id } = useParams<{ id: string }>();

  const [movieData, setMovieData] = useState<MovieDetailType | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});
  // Add state for showing all cast
  const [showAllCast, setShowAllCast] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchMovieData() {
      dispatch(showLoader());
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos,credits,reviews`
        );
        const data = await res.json();
        setMovieData(data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        dispatch(hideLoader());
      }
    }

    fetchMovieData();
  }, [apiKey, id, dispatch]);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Convert minutes to hours and minutes
  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return "Unknown";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  // Find official trailer
  const findTrailer = () => {
    if (!movieData?.videos?.results) return null;
    return (
      movieData.videos.results.find(
        (video) => video.type === "Trailer" && video.official === true
      ) || movieData.videos.results.find((video) => video.type === "Trailer")
    );
  };

  // Get cast members (either top 10 or all based on state)
  const getCast = () => {
    if (!movieData?.credits?.cast) return [];
    return showAllCast
      ? movieData.credits.cast
      : movieData.credits.cast.slice(0, 10);
  };

  // Get director(s)
  const getDirectors = () => {
    if (!movieData?.credits?.crew) return [];
    return movieData.credits.crew.filter(
      (person: CrewMember) => person.job === "Director"
    );
  };

  // Get top reviews
  const getTopReviews = () => {
    if (!movieData?.reviews?.results) return [];
    return movieData.reviews.results.slice(0, 3);
  };

  // Toggle review expansion
  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handlePerson = (person: PersonType, movie: MovieDetailType) => {
    const slug = person.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/movie/${movie.id}/person/${person.id}/${slug}`);
  };

  if (!movieData) {
    return (
      <div className="flex justify-center items-center h-screen bg-bg-primary">
        <div className="text-center p-8 rounded-xl bg-bg-secondary shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-text-primary">
            Movie not found
          </h2>
          <p className="text-text-secondary">Please try another movie</p>
        </div>
      </div>
    );
  }

  const trailer = findTrailer();
  const cast = getCast(); // Changed from getTopCast to getCast
  const directors = getDirectors();
  const topReviews = getTopReviews();

  return (
    <div className="bg-bg-primary text-text-primary mt-12 sm:mt-14 min-h-screen">
      {/* Hero Section with Backdrop */}
      <div className="relative">
        {/* Backdrop Image Container */}
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          {movieData.backdrop_path && (
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movieData.backdrop_path})`,
              }}
            ></div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 from-10% to-transparent"></div>
        </div>

        {/* Movie Title and Basic Info */}
        <div className="relative container mx-auto px-4 -mt-20 md:-mt-32">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster */}
            <div className="md:w-1/3 lg:w-1/4 shrink-0">
              <div className="rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300">
                {movieData.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}
                    alt={movieData.title}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="bg-bg-secondary h-[450px] flex items-center justify-center">
                    <span className="text-muted">No Poster Available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Movie Info */}
            <div className="md:w-2/3 lg:w-3/4 pb-6 flex flex-col">
              <h1 className="text-3xl md:text-2xl lg:text-4xl font-bold mb-2 text-text-primary sm:text-white wrap-break-words">
                {movieData.title}
              </h1>

              {movieData.tagline && (
                <p className="text-xl text-text-secondary sm:text-gray-300 italic mb-2 wrap-break-words">
                  "{movieData.tagline}"
                </p>
              )}

              <div className="flex flex-wrap gap-3 text-sm text-text-secondary sm:text-gray-300 mb-6">
                <span>{formatDate(movieData.release_date)}</span>
                <span>•</span>
                <span>{formatRuntime(movieData.runtime)}</span>
                <span>•</span>
                <span>{movieData.original_language.toUpperCase()}</span>
              </div>

              {/* Overview */}
              <div className="mb-6 mt-11">
                <h2 className="text-2xl font-bold mb-4 text-text-primary">
                  Overview
                </h2>
                <p className="text-text-secondary-200 leading-relaxed text-lg">
                  {movieData.overview}
                </p>
              </div>

              {/* User Score and Basic Stats */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-bg-secondary bg-opacity-60 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px]">
                  <div className="flex items-center">
                    <span className="text-3xl font-bold mr-1 text-yellow-400">
                      {movieData.vote_average.toFixed(1)}
                    </span>
                    <span className="text-text-primary-300">/10</span>
                  </div>
                  <span className="text-text-secondary text-sm">
                    Aura Score
                  </span>
                </div>

                <div className="bg-bg-secondary bg-opacity-60 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px]">
                  <span className="text-text-primary font-medium">
                    {movieData.status}
                  </span>
                  <p className="text-text-secondary text-sm">Status</p>
                </div>

                {movieData.budget > 0 && (
                  <div className="bg-bg-secondary bg-opacity-60 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px]">
                    <span className="text-text-primary font-medium">
                      ${(movieData.budget / 1000000).toFixed(1)}M
                    </span>
                    <p className="text-text-secondary text-sm">Budget</p>
                  </div>
                )}

                {movieData.revenue > 0 && (
                  <div className="bg-bg-secondary bg-opacity-60 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px]">
                    <span className="text-text-primary font-medium">
                      ${(movieData.revenue / 1000000).toFixed(1)}M
                    </span>
                    <p className="text-text-secondary text-sm">Revenue</p>
                  </div>
                )}
              </div>

              {/* Genres */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {movieData.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-bg-secondary bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-text-primary font-medium hover:bg-opacity-30"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
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
            {/* Production Companies */}
            {movieData.production_companies.length > 0 && (
              <div className="bg-card rounded-xl p-6 mb-6 shadow-md border border-border">
                <h3 className="text-lg font-semibold mb-4 text-text-primary">
                  Production Companies
                </h3>
                <div className="space-y-3">
                  {movieData.production_companies.map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center p-2 rounded-lg transition-colors"
                    >
                      {company.logo_path && (
                        <div className="w-12 h-12 rounded-full shadow-xs shadow-black bg-bg-inverted flex items-center justify-center mr-3">
                          <img
                            src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                            alt={company.name}
                            className="w-10 h-10 object-contain  rounded-full"
                          />
                        </div>
                      )}
                      <span className="text-text-primary">{company.name}</span>
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
                  <span className="text-text-secondary">Original Title</span>
                  <span className="text-text-primary font-medium">
                    {movieData.original_title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Release Date</span>
                  <span className="text-text-primary font-medium">
                    {formatDate(movieData.release_date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Runtime</span>
                  <span className="text-text-primary font-medium">
                    {formatRuntime(movieData.runtime)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            {/* Director(s) */}
            {directors.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-text-primary">
                  Director{directors.length > 1 ? "s" : ""}
                </h2>
                <div className="flex flex-wrap gap-4">
                  {directors.map((director: CrewMember) => (
                    <div
                      key={director.id}
                      className="bg-bg-secondary rounded-xl p-4 flex items-center shadow-md border border-border hover:shadow-lg"
                    >
                      <div className="w-12 h-12 rounded-full border border-accent bg-bg-secondary flex items-center justify-center mr-3">
                        <span className="text-accent font-bold text-lg">
                          {director.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">
                          {director.name}
                        </p>
                        <p className="text-text-secondary text-sm">Director</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trailer */}
            {trailer && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-text-primary">
                  Trailer
                </h2>
                <div className="rounded-xl overflow-hidden shadow-lg border border-border">
                  <iframe
                    title={trailer.name}
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-64 md:h-96"
                  ></iframe>
                </div>
              </div>
            )}

            {/* Cast */}
            {cast.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-text-primary">Cast</h2>
                  <div className="text-text-secondary text-sm">
                    Showing{" "}
                    {showAllCast ? cast.length : Math.min(10, cast.length)} of{" "}
                    {movieData.credits?.cast?.length || 0} cast members
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {cast.map((person) => (
                    <div
                      key={person.id}
                      onClick={() => handlePerson(person, movieData)}
                      className="bg-card cursor-pointer rounded-xl overflow-hidden shadow-md border border-border hover:shadow-xl"
                    >
                      {person.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                          alt={person.name}
                          className="w-full h-64 sm:h-72 object-cover"
                        />
                      ) : (
                        <div className="bg-bg-secondary h-64 sm:h-72 flex items-center justify-center">
                          <span className="text-muted text-sm">No Image</span>
                        </div>
                      )}
                      <div className="p-3">
                        <p className="font-semibold truncate text-text-primary">
                          {person.name}
                        </p>
                        <p className="text-text-secondary text-sm truncate">
                          {person.character}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Show More/Less Button */}
                {movieData.credits?.cast &&
                  movieData.credits.cast.length > 10 && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setShowAllCast(!showAllCast)}
                        className="bg-accent cursor-pointer hover:bg-accent-hover text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        {showAllCast
                          ? "Show Less"
                          : `Show All Cast (${movieData.credits.cast.length})`}
                      </button>
                    </div>
                  )}
              </div>
            )}

            {/* Reviews */}
            {topReviews.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-text-primary">
                  Reviews
                </h2>
                <div className="space-y-4">
                  {topReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-card rounded-xl p-6 shadow-md border border-border"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mr-3">
                          <span className="text-white font-bold">
                            {review.author.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="font-semibold text-text-primary">
                          {review.author}
                        </h3>
                        {review.author_details.rating && (
                          <div className="flex items-center ml-auto bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
                            <span className="text-yellow-600 dark:text-yellow-400 mr-1">
                              ★
                            </span>
                            <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                              {review.author_details.rating}/10
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-text-secondary leading-relaxed">
                        {review.content &&
                        review.content.length > 300 &&
                        !expandedReviews[review.id || ""]
                          ? `${review.content.substring(0, 300)}...`
                          : review.content}
                      </p>
                      {review.content && review.content.length > 300 && (
                        <button
                          onClick={() => toggleReviewExpansion(review.id || "")}
                          className="text-accent cursor-pointer text-sm mt-3 inline-block hover:underline font-medium"
                        >
                          {expandedReviews[review.id || ""]
                            ? "Show less"
                            : "Read full review"}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
