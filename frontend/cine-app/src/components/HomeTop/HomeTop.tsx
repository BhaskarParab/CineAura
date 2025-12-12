import { useEffect, useRef, useState } from "react";
import type { SearchItem } from "../../types/SearchType";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w1280";

function HomeTop() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [storeMedia, setStoreMedia] = useState<SearchItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingMedia = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`
      );
      const data = await res.json();
      console.log(data);
      setStoreMedia(data.results);
    };

    fetchTrendingMedia();
  }, [apiKey]);

  useEffect(() => {
    if (storeMedia.length === 0) return;

    const maxIndex = storeMedia.length - 1;

    const startAutoSlide = () => {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }, 7000);
    };

    startAutoSlide();

    const sliderEl = sliderRef.current;

    // Pause on hover
    const handleMouseEnter = () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };

    // Resume on leave
    const handleMouseLeave = () => {
      startAutoSlide();
    };

    sliderEl?.addEventListener("mouseenter", handleMouseEnter);
    sliderEl?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      sliderEl?.removeEventListener("mouseenter", handleMouseEnter);
      sliderEl?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [storeMedia]);

  // const handleSlide = (Idx: number) => {
  //   setCurrentIndex(Idx)
  // }

  const goToPrevious = () => {
    if (storeMedia.length === 0) return;
    setCurrentIndex((prev) => (prev === 0 ? storeMedia.length - 1 : prev - 1));
  };

  const goToNext = () => {
    if (storeMedia.length === 0) return;
    setCurrentIndex((prev) => (prev === storeMedia.length - 1 ? 0 : prev + 1));
  };

  const handleOnClickNavigation = (ele: SearchItem) => {
    if (ele.media_type === "movie") {
      const slug = ele.title.toLowerCase().replace(/\s+/g, "-");
      navigate(`/movie/${ele.id}/${slug}`);
    } else {
      const slug = ele.name.toLowerCase().replace(/\s+/g, "-");
      navigate(`/webseries/${ele.id}/${slug}`);
    }
  };

  return (
    <div ref={sliderRef} className="overflow-hidden mt-12 sm:14 relative">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {storeMedia.map((ele) => (
          <>
            <div
              key={ele.id}
              className="relative shrink-0 w-full"
            >

              {/* Gradient black */}
              <div className="absolute inset-0 bottom-0 sm:bottom-1/5 bg-linear-to-t from-black/70 to-transparent"></div>
              <img
                alt={ele.media_type}
                className="w-full h-full object-contain cursor-pointer sm:object-cover sm:h-[80%]"
                src={`${IMAGE_BASE_URL}${ele.backdrop_path}`}
              />

              {/* TITLE */}
              <h2 onClick={() => handleOnClickNavigation(ele)} className="absolute cursor-pointer bottom-2 left-4 text-white hover:text-white/90 hover:scale-[1.010] max-w-[70%] lg:h-15 truncate xs-430:text-2xl sm:text-2xl lg:text-5xl sm:bottom-1/4 font-semibold drop-shadow-lg ">
                {ele.media_type === "movie" ? ele.title : ele.name}
              </h2>
            </div> 
          </>
        ))}
      </div>
      <div className="absolute hidden gap-5 lg:block bottom-1/4 right-4">
        <button className="cursor-pointer text-white" onClick={goToPrevious}>
          <ChevronLeft />
        </button>
        <div className="w-6 h-px m-1" />
        <button className="cursor-pointer text-white" onClick={goToNext}>
          <ChevronRight />
        </button>
      </div>

      <div className="absolute flex gap-8 bottom-2 sm:bottom-1/4 lg:hidden right-5">
        <button className="cursor-pointer text-white" onClick={goToPrevious}>
          <ChevronLeft />
        </button>
        <button className="cursor-pointer text-white" onClick={goToNext}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}

export default HomeTop;
