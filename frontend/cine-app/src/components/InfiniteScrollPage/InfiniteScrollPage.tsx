import { useEffect, useRef, useState, memo } from "react";
import gsap from "gsap";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../Redux/LoaderSlice/LoaderSlice";

const API_KEY = import.meta.env.VITE_API_KEY;
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

interface Media {
  id: number;
  poster_path: string;
}

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
        // COMES FROM TOP → moves DOWN
        tween = gsap.fromTo(
          track,
          { y: -totalHeight }, // start ABOVE screen
          {
            y: 0, // move DOWN into view
            duration,
            ease: "none",
            repeat: -1,
          },
        );
      } else {
        // COMES FROM BOTTOM → moves UP
        tween = gsap.fromTo(
          track,
          { y: 0 },
          {
            y: -totalHeight, // move UP
            duration,
            ease: "none",
            repeat: -1,
          },
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
                : "https://via.placeholder.com/500x750?text=No+Image"
            }
            alt=""
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
  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchData() {
      try {
        dispatch(showLoader())
        const pages = [1, 2, 3, 4, 5];

        const requests = pages.flatMap((page) => [
          fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${page}`,
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=${page}`,
          ),
          fetch(
            `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&page=${page}`,
          ),
          fetch(
            `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&page=${page}`,
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

        // Shuffle for randomness
        const shuffled = allItems.sort(() => Math.random() - 0.5);

        // Duplicate for seamless infinite scroll
        setItems([...shuffled, ...shuffled]);

        // Small delay for smooth appearance
        setTimeout(() => setIsReady(true), 200);
      } catch (err) {
        console.error(err);
      }
      finally{
        dispatch(hideLoader())
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
      {/* Columns */}
      <div className="flex gap-6">
        {Array.from({ length: columnCount }).map((_, i) => {
          const columnItems = items.slice(i * chunkSize, (i + 1) * chunkSize);

          return (
            <Column
              key={i}
              items={columnItems}
              duration={150}
              reverse={i % 2 === 0}
            />
          );
        })}
      </div>

      {/* Gradient overlay */}
      {/* <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black via-transparent to-black" /> */}
    </div>
  );
};

export default memo(InfiniteScrollPage);
