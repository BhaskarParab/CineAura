import { useEffect, useRef, useState, memo } from "react";
import gsap from "gsap";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/LoaderSlice/LoaderSlice";

const API_KEY = import.meta.env.VITE_API_KEY;

// Step 1: smaller images for faster load
const IMAGE_BASE = "https://image.tmdb.org/t/p/w185";

interface Media {
  id: number;
  poster_path: string;
}

/* ================= SKELETON ================= */

const SkeletonColumn = () => {
  return (
    <div className="relative w-[200px] overflow-hidden">
      <div className="flex flex-col animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-full h-[300px] mb-4 rounded-xl bg-gray-700/40"
          />
        ))}
      </div>
    </div>
  );
};

/* ================= COLUMN COMPONENT ================= */

const Column = ({
  items,
  duration,
  reverse,
}: {
  items: Media[];
  duration: number;
  reverse?: boolean;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current || items.length === 0) return;

    const track = trackRef.current;

    const ctx = gsap.context(() => {
      const totalHeight = track.scrollHeight / 2;

      let tween;

      if (reverse) {
        tween = gsap.fromTo(
          track,
          { y: -totalHeight },
          {
            y: 0,
            duration,
            ease: "none",
            repeat: -1,
          }
        );
      } else {
        tween = gsap.fromTo(
          track,
          { y: 0 },
          {
            y: -totalHeight,
            duration,
            ease: "none",
            repeat: -1,
          }
        );
      }

      return () => tween.kill();
    }, trackRef);

    return () => ctx.revert();
  }, [items, duration, reverse]);

  return (
    <div className="relative w-[200px] overflow-hidden">
      <div ref={trackRef} className="flex flex-col">
        {items.map((item, index) => (
          <img
            key={`${item.id}-${index}`}
            src={
              item.poster_path
                ? `${IMAGE_BASE}${item.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt=""
            loading="lazy"       // ⚡ Step 2
            decoding="async"     // ⚡ Step 2
            className="w-full h-[300px] object-cover mb-4 rounded-xl shadow-lg"
          />
        ))}
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */

const InfiniteScrollPage = () => {
  const [items, setItems] = useState<Media[]>([]);
  const [isReady, setIsReady] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        dispatch(showLoader());

        // Step 3: reduced API load (was 5 pages → now 2 pages)
        const pages = [1, 2];

        const requests = pages.flatMap((page) => [
          fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=${page}`
          ),
          fetch(
            `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&page=${page}`
          ),
          fetch(
            `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&page=${page}`
          ),
        ]);

        const responses = await Promise.all(requests);
        const data = await Promise.all(responses.map((r) => r.json()));

        const allItems: Media[] = data
          .flatMap((d) => d.results as Media)
          .filter((item) => item.poster_path)
          .map((item) => ({
            id: item.id,
            poster_path: item.poster_path!,
          }));

        const shuffled = allItems.sort(() => Math.random() - 0.5);

        setItems([...shuffled, ...shuffled]);

        setTimeout(() => setIsReady(true), 200);
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(hideLoader());
      }
    }

    fetchData();
  }, []);

  const columnCount = 6;
  const chunkSize = Math.ceil(items.length / columnCount);

  return (
    <div
      className={`w-full h-full overflow-hidden flex items-center justify-center bg-bg-primary transition-opacity duration-700 ${
        isReady ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Step 4: Skeleton UI */}
      {!isReady ? (
        <div className="flex gap-6">
          {Array.from({ length: columnCount }).map((_, i) => (
            <SkeletonColumn key={i} />
          ))}
        </div>
      ) : (
        <div className="flex gap-6">
          {Array.from({ length: columnCount }).map((_, i) => {
            const columnItems = items.slice(
              i * chunkSize,
              (i + 1) * chunkSize
            );

            return (
              <Column
                key={i}
                items={columnItems}
                duration={100}
                reverse={i % 2 === 0}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default memo(InfiniteScrollPage);