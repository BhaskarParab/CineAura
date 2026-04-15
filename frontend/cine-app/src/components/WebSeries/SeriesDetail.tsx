import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/LoaderSlice/LoaderSlice";
import type {
  CrewMember,
  SeriesDetailType,
  Video,
} from "../../types/SeriesDetail";
import {
  storeSeasons,
  updateSeasonEpisodes,
} from "../../Redux/SeriesSlice/StoreSeasonsSlice";
import type { RootState } from "../../Redux/Store";
import ReviewPage from "../Review Page/ReviewPage";
import type { Review } from "../../types/MovieDetail";
import SEO from "../../SEOs/SEO";

interface PersonType {
  id: number;
  name: string;
}

interface Season {
  season_number: number;
}

function SeriesDetail() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const location = useLocation();

  const mediaType = location.pathname.startsWith("/tv") ? "TV" : "MOVIE";

  // Get series ID from URL parameters
  const { id } = useParams<{ id: string }>();

  const [seriesData, setSeriesData] = useState<SeriesDetailType | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [topReviews, setTopReviews] = useState<Review[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [visibleCount, setVisibleCount] = useState(10);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});
  const [expandedSeasons, setExpandedSeasons] = useState<
    Record<number, boolean>
  >({});
  // Add state for showing all cast
  const [showAllCast, setShowAllCast] = useState(false);
  // const [toggleAccordian, setToggleAccordian] = useState(false)
  const fetchedSeasonsData = useSelector(
    (state: RootState) => state.storeSeasons.seasonsData,
  );

  const allReviews = [
    ...(reviews || []).map((r) => ({ ...r, type: "db" })),
    ...(topReviews || []).map((r) => ({ ...r, type: "tmdb" })),
  ];

  const visibleReviews = allReviews.slice(0, visibleCount);

  useEffect(() => {
    if (!id) return;

    async function fetchSeriesData() {
      dispatch(showLoader());
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=videos,credits,reviews`,
        );
        const data = await res.json();
        setSeriesData(data);

        const latestSeason = data.seasons
          .filter((s: Season) => s.season_number > 0)
          .pop();

        // const totalSeasons = data.number_of_seasons;

        // const latestSeason = data.seasons
        //   .filter((s: Season) => s.season_number > 0) // ignore specials
        //   .pop();

        const latestSeasonVideosRes = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${latestSeason?.season_number}/videos?api_key=${apiKey}`,
        );

        const latestSeasonVideos = await latestSeasonVideosRes.json();

        const seasonTrailer = latestSeasonVideos.results?.find(
          (vid: Video) => vid.type === "Trailer" && vid.site === "YouTube",
        );

        const seriesTrailer = data.videos?.results?.find(
          (vid: Video) => vid.type === "Trailer" && vid.site === "YouTube",
        );

        setTrailer(seasonTrailer || seriesTrailer || null);

        // Fetch each season
        // const seasonPromises = [];

        const seasonsList = data.seasons
          .filter((s: Season) => s.season_number > 0)
          .map((s: Season) => ({
            season: s.season_number,
            episodes: [],
          }));

        dispatch(storeSeasons(seasonsList));

        if (latestSeason?.season_number) {
          const res = await fetch(
            `https://api.themoviedb.org/3/tv/${id}/season/${latestSeason.season_number}?api_key=${apiKey}`,
          );

          const seasonData = await res.json();

          dispatch(
            updateSeasonEpisodes({
              season: latestSeason.season_number,
              episodes: seasonData.episodes,
            }),
          );
        }
        // console.log(allSeasons);
      } catch (error) {
        console.error("Error fetching series data:", error);
      } finally {
        dispatch(hideLoader());
      }
    }

    fetchSeriesData();

    async function fetchSeriesReview() {
      try {
        const res = await fetch(
          `https://cineaura-production.up.railway.app/api/reviews/${mediaType}/${id}`,
          {
            method: "GET",
          },
        );

        const data = await res.json();

        setReviews(data);

        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }

        console.log("Review added!");
      } catch (err: unknown) {
        console.error(err);

        if (err instanceof Error) {
          console.log(err.message);
        } else {
          console.log("Something went wrong");
        }
      }
    }

    fetchSeriesReview();
  }, [apiKey, id, dispatch, mediaType]);

  const getTopReviews = async (pageNumber: number = 1) => {
    if (!id) return;

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${apiKey}&page=${pageNumber}`,
      );

      const data = await res.json();

      if (pageNumber === 1) {
        // first load
        setTopReviews(data.results);
      } else {
        // append more
        setTopReviews((prev) => [...prev, ...data.results]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    if (!id) return;

    setPage(1);
    setHasMore(true);
    getTopReviews(1);
  }, [id]);

  useEffect(() => {
    if (!hasMore) return;

    if (visibleCount > allReviews.length - 5) {
      const nextPage = page + 1;
      setPage(nextPage);
      getTopReviews(nextPage);
    }
  }, [visibleCount]);

  const fetchSeasonEpisodes = async (seasonNumber: number) => {
    const existing = fetchedSeasonsData.find((s) => s.season === seasonNumber);

    if (existing && existing.episodes.length > 0) return;

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${apiKey}`,
      );

      const data = await res.json();

      dispatch(
        updateSeasonEpisodes({
          season: seasonNumber,
          episodes: data.episodes,
        }),
      );
    } catch (err) {
      console.error(err);
    }
  };

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
  // const formatRuntime = (minutes: number | null) => {
  //   if (!minutes) return "Unknown";
  //   const hours = Math.floor(minutes / 60);
  //   const mins = minutes % 60;
  //   return `${hours}h ${mins}min`;
  // };

  // Find official trailer
  // const findTrailer = () => {
  //   if (!seriesData?.videos?.results) return null;
  //   return (
  //     seriesData.videos.results.find(
  //       (video) => video.type === "Trailer" && video.official === true,
  //     ) || seriesData.videos.results.find((video) => video.type === "Trailer")
  //   );
  // };

  // Get cast members (either top 10 or all based on state)
  const getCast = () => {
    if (!seriesData?.credits?.cast) return [];
    return showAllCast
      ? seriesData.credits.cast
      : seriesData.credits.cast.slice(0, 10);
  };

  // Get director(s)
  const getDirectors = () => {
    if (!seriesData?.credits?.crew) return [];
    return seriesData.credits.crew.filter(
      (person: CrewMember) => person.job === "Director",
    );
  };

  // Get top reviews
  // const getTopReviews = () => {
  //   if (!seriesData?.reviews?.results) return [];
  //   return seriesData.reviews.results.slice(0, 3);
  // };

  // Toggle review expansion
  const toggleReviewExpansion = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handleToggleAccordian = async (seasonNumber: number) => {
    setExpandedSeasons((prev) => ({
      ...prev,
      [seasonNumber]: !prev[seasonNumber],
    }));

    if (!expandedSeasons[seasonNumber]) {
      await fetchSeasonEpisodes(seasonNumber);
    }
  };

  const handlePerson = (person: PersonType, series: SeriesDetailType) => {
    const slug = person.name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/tv/${series.id}/person/${person.id}/${slug}`);
  };

  if (!seriesData) {
    return (
      <div className="flex justify-center items-center h-screen bg-bg-primary">
        <div className="text-center p-8 rounded-xl bg-bg-secondary shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-text-primary">
            Series not found
          </h2>
          <p className="text-text-secondary">Please try another series</p>
        </div>
      </div>
    );
  }

  // const trailer = findTrailer();
  const cast = getCast();
  const directors = getDirectors();
  // const topReviews = getTopReviews();

  return (
    <>
      <SEO
        title={`${seriesData.name} | CineAura`}
        description={seriesData.overview}
        type="video.tv_show"
        image={`https://image.tmdb.org/t/p/w500${seriesData.poster_path}`}
      />
      <div className="bg-bg-primary text-text-primary mt-12 sm:mt-14 min-h-screen">
        {/* Hero Section with Backdrop */}
        <div className="relative">
          {/* Backdrop Image Container */}
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            {seriesData.backdrop_path && (
              <div
                className="absolute inset-0 bg-cover bg-center scale-105"
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${seriesData.backdrop_path})`,
                }}
              ></div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 from-10% to-transparent"></div>
          </div>

          {/* Series Title and Basic Info */}
          <div className="relative container mx-auto px-4 -mt-20 md:-mt-32">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Poster */}
              <div className="md:w-1/3 lg:w-1/4">
                <div className="rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300">
                  {seriesData.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${seriesData.poster_path}`}
                      alt={seriesData.name}
                      className="w-full h-auto"
                    />
                  ) : (
                    <div className="bg-bg-secondary h-[450px] flex items-center justify-center">
                      <span className="text-muted">No Poster Available</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Series Info */}
              <div className="md:w-2/3 lg:w-3/4 pb-6">
                <h1 className="text-4xl md:text-2xl lg:text-4xl font-bold mb-2 text-text-primary sm:text-white">
                  {seriesData.name}
                </h1>
                {seriesData.tagline && (
                  <div className="mb-4">
                    <p
                      className={`${
                        seriesData.tagline.length < 20
                          ? "md:text-lg" // short
                          : seriesData.tagline.length <= 50
                            ? "md:text-sm" // medium
                            : "md:text-sm" // long
                      } text-text-secondary sm:text-gray-300 italic mb-4`}
                    >
                      "{seriesData.tagline}"
                    </p>
                  </div>
                )}
                <div className="flex flex-wrap gap-3 text-sm text-text-secondary sm:text-gray-300 mb-6 lg:mt-6 tab-820:-mt-2">
                  <span>{formatDate(seriesData.first_air_date)}</span>
                  <span>•</span>
                  <span>
                    {seriesData.number_of_seasons} Season
                    {seriesData.number_of_seasons > 1 ? "s" : ""}
                  </span>
                  <span>•</span>
                  <span>
                    {seriesData.number_of_episodes} Episode
                    {seriesData.number_of_episodes > 1 ? "s" : ""}
                  </span>
                  <span>•</span>
                  <span>{seriesData.original_language.toUpperCase()}</span>
                </div>

                {/* Overview */}

                {seriesData.tagline.length > 0 ? (
                  <div className="mb-6 md:mt-12 lg:mt-10">
                    <h2 className="text-2xl font-bold mb-4 text-text-primary lg:mt-10">
                      Overview
                    </h2>
                    <p className="text-text-secondary-200 leading-relaxed text-lg">
                      {seriesData.overview}
                    </p>
                  </div>
                ) : (
                  <div className="mb-6 md:mt-20 lg:mt-14">
                    <h2 className="text-2xl font-bold mb-4 text-text-primary lg:mt-10">
                      Overview
                    </h2>
                    <p className="text-text-secondary-200 leading-relaxed text-lg">
                      {seriesData.overview}
                    </p>
                  </div>
                )}

                {/* User Score and Basic Stats */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="bg-bg-secondary bg-opacity-60 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px]">
                    <div className="flex items-center">
                      <span className="text-3xl font-bold mr-1 text-yellow-400">
                        {seriesData.vote_average.toFixed(1)}
                      </span>
                      <span className="text-text-primary-300">/10</span>
                    </div>
                    <span className="text-text-secondary text-sm">
                      Aura Score
                    </span>
                  </div>

                  <div className="bg-bg-secondary bg-opacity-60 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px]">
                    <span className="text-text-primary font-medium">
                      {seriesData.status}
                    </span>
                    <p className="text-text-secondary text-sm">Status</p>
                  </div>

                  <div className="bg-bg-secondary bg-opacity-60 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center min-w-[100px]">
                    <span className="text-text-primary font-medium">
                      {seriesData.type}
                    </span>
                    <p className="text-text-secondary text-sm">Type</p>
                  </div>
                </div>

                {/* Genres */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {seriesData.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="bg-bg-secondary bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-text-primary font-medium hover:bg-opacity-30 transition-all"
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
              {seriesData.production_companies.length > 0 && (
                <div className="bg-card rounded-xl p-6 mb-6 shadow-md border border-border">
                  <h3 className="text-lg font-semibold mb-4 text-text-primary">
                    Production Companies
                  </h3>
                  <div className="space-y-3">
                    {seriesData.production_companies.map((company) => (
                      <div
                        key={company.id}
                        className="flex items-center p-2 rounded-lg transition-colors"
                      >
                        {company.logo_path && (
                          <div className="w-12 h-12 rounded-full shadow-xs shadow-black bg-bg-inverted flex items-center justify-center mr-3">
                            <img
                              src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                              alt={company.name}
                              className="w-10 h-10 object-contain rounded-full"
                            />
                          </div>
                        )}
                        <span className="text-text-primary">
                          {company.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Networks */}
              {seriesData.networks.length > 0 && (
                <div className="bg-card rounded-xl p-6 mb-6 shadow-md border border-border">
                  <h3 className="text-lg font-semibold mb-4 text-text-primary">
                    Networks
                  </h3>
                  <div className="space-y-3">
                    {seriesData.networks.map((network) => (
                      <div
                        key={network.id}
                        className="flex items-center p-2 rounded-lg transition-colors"
                      >
                        {network.logo_path && (
                          <div className="w-12 h-12 rounded-full shadow-xs shadow-black bg-bg-inverted flex items-center justify-center mr-3">
                            <img
                              src={`https://image.tmdb.org/t/p/w92${network.logo_path}`}
                              alt={network.name}
                              className="w-10 h-10 object-contain rounded-full"
                            />
                          </div>
                        )}
                        <span className="text-text-primary">
                          {network.name}
                        </span>
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
                      {seriesData.original_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">First Air Date</span>
                    <span className="text-text-primary font-medium">
                      {formatDate(seriesData.first_air_date)}
                    </span>
                  </div>
                  {seriesData.last_air_date && (
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Last Air Date</span>
                      <span className="text-text-primary font-medium">
                        {formatDate(seriesData.last_air_date)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Seasons</span>
                    <span className="text-text-primary font-medium">
                      {seriesData.number_of_seasons}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Episodes</span>
                    <span className="text-text-primary font-medium">
                      {seriesData.number_of_episodes}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="lg:col-span-2">
              {/* Seasons accordian */}
              <div className="lg:col-span-2">
                {fetchedSeasonsData && fetchedSeasonsData.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-text-primary">
                      Seasons ({fetchedSeasonsData.length})
                    </h2>
                    <div className="space-y-4">
                      {fetchedSeasonsData.map((season) => (
                        <div
                          key={season.season}
                          className="bg-card rounded-xl overflow-hidden shadow-md border border-border"
                        >
                          <button
                            onClick={() => handleToggleAccordian(season.season)}
                            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-bg-secondary transition-colors cursor-pointer"
                          >
                            <div className="flex items-center">
                              <div className="w-12 h-16 bg-bg-secondary rounded mr-4 flex items-center justify-center">
                                <span className="text-text-primary font-bold">
                                  S{season.season}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-text-primary">
                                  Season {season.season}
                                </h3>
                                <p className="text-text-secondary text-sm">
                                  {season.episodes.length > 0
                                    ? `${season.episodes.length} Episodes`
                                    : "Click to load episodes"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {expandedSeasons[season.season] ? (
                                <svg
                                  className="h-5 w-5 text-text-secondary"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 15l7-7 7 7"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="h-5 w-5 text-text-secondary"
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
                              )}
                            </div>
                          </button>
                          {expandedSeasons[season.season] && (
                            <div className="px-6 pb-4 border-t border-border">
                              <div className="mt-4 space-y-4">
                                {season.episodes.length === 0 ? (
                                  <div className="flex items-center gap-2 text-text-secondary text-sm">
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                    Loading episodes...
                                  </div>
                                ) : (
                                  season.episodes.map((episode) => (
                                    <div
                                      key={episode.id}
                                      className="flex gap-4 p-3 rounded-lg hover:bg-bg-secondary transition-colors"
                                    >
                                      {episode.still_path ? (
                                        <img
                                          src={`https://image.tmdb.org/t/p/w185${episode.still_path}`}
                                          alt={episode.name}
                                          className="w-24 h-14 object-cover rounded"
                                        />
                                      ) : (
                                        <div className="w-24 h-14 bg-bg-secondary rounded flex items-center justify-center">
                                          <span className="text-text-secondary text-xs">
                                            No Image
                                          </span>
                                        </div>
                                      )}
                                      <div className="flex-1">
                                        <h4 className="font-medium text-text-primary">
                                          Episode {episode.episode_number}:{" "}
                                          {episode.name}
                                        </h4>
                                        <p className="text-text-secondary text-sm mb-1">
                                          {episode.air_date &&
                                            formatDate(episode.air_date)}
                                          <span className="ml-2">
                                            <span className="text-yellow-400">
                                              ★
                                            </span>{" "}
                                            {episode.vote_average !== undefined
                                              ? episode.vote_average.toFixed(1)
                                              : ""}
                                          </span>
                                        </p>
                                        <p className="text-text-secondary text-sm line-clamp-2">
                                          {episode.overview}
                                        </p>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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
                          <p className="text-text-secondary text-sm">
                            Director
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trailer */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-text-primary">
                  Trailer
                </h2>

                {trailer ? (
                  <div className="rounded-xl overflow-hidden shadow-lg border border-border">
                    <iframe
                      title={trailer.name}
                      src={`https://www.youtube.com/embed/${trailer.key}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-64 md:h-140"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 md:h-96 flex items-center justify-center border border-border rounded-xl text-text-secondary">
                    No trailer available
                  </div>
                )}
              </div>

              {/* Cast */}
              {cast.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-text-primary">
                      Cast
                    </h2>
                    <div className="text-text-secondary text-sm">
                      Showing{" "}
                      {showAllCast ? cast.length : Math.min(10, cast.length)} of{" "}
                      {seriesData.credits?.cast?.length || 0} cast members
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {cast.map((person) => (
                      <div
                        key={person.id}
                        onClick={() => handlePerson(person, seriesData)}
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
                  {seriesData.credits?.cast &&
                    seriesData.credits.cast.length > 10 && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => setShowAllCast(!showAllCast)}
                          className="bg-accent cursor-pointer hover:bg-accent-hover text-white px-6 py-2 rounded-lg transition-colors"
                        >
                          {showAllCast
                            ? "Show Less"
                            : `Show All Cast (${seriesData.credits.cast.length})`}
                        </button>
                      </div>
                    )}
                </div>
              )}

              <ReviewPage
                movieId={seriesData.id}
                mediaType={mediaType}
                setReviews={setReviews}
              />

              {visibleReviews.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-6 text-text-primary">
                    Reviews
                  </h2>

                  <div className="space-y-4">
                    {visibleReviews.map((review) => {
                      const isDB = review.type === "db";
                      const reviewId = String(isDB ? review.id : review.id_);
                      const avatarPath = isDB
                        ? review.user.avatar
                        : review.author_details?.avatar_path;

                      const avatarUrl =
                        !isDB && avatarPath
                          ? avatarPath.startsWith("/http")
                            ? avatarPath.slice(1)
                            : `https://image.tmdb.org/t/p/w200${avatarPath}`
                          : avatarPath;

                      return (
                        <div
                          key={review.id}
                          className="bg-card rounded-xl p-6 shadow-md border border-border"
                        >
                          {/* Header */}
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-accent flex items-center justify-center mr-3">
                              {avatarUrl ? (
                                <img
                                  src={avatarUrl}
                                  alt="avatar"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-white font-bold">
                                  {(isDB ? review.user.username : review.author)
                                    ?.charAt(0)
                                    ?.toUpperCase() || "U"}
                                </span>
                              )}
                            </div>

                            <h3 className="font-semibold text-text-primary">
                              {isDB ? review.user.username : review.author}
                            </h3>

                            {(isDB
                              ? review.rating
                              : review.author_details.rating) && (
                              <div className="flex items-center ml-auto bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
                                <span className="text-yellow-600 dark:text-yellow-400 mr-1">
                                  ★
                                </span>
                                <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                                  {isDB
                                    ? review.rating
                                    : review.author_details.rating}
                                  /10
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <p className="text-text-secondary leading-relaxed">
                            {review.content &&
                            review.content.length > 300 &&
                            !expandedReviews[reviewId]
                              ? `${review.content.substring(0, 300)}...`
                              : review.content}
                          </p>

                          {/* Read More */}
                          {review.content && review.content.length > 300 && (
                            <button
                              onClick={() => toggleReviewExpansion(reviewId)}
                              className="text-accent cursor-pointer text-sm mt-3 inline-block hover:underline font-medium"
                            >
                              {expandedReviews[reviewId]
                                ? "Show less"
                                : "Read full review"}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {visibleCount < allReviews.length && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 10)}
                    className="px-6 py-2 bg-accent text-white rounded-lg cursor-pointer"
                  >
                    Show More Reviews
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SeriesDetail;
