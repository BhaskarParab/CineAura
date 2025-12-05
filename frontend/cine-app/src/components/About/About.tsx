import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { Quote } from "lucide-react";

function About() {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // 1. Wait for fonts + layout — pseudo preload
    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const hi = document.querySelector('#hi')
          const mid = document.querySelector("#mid");
          const end = document.querySelector("#end");

          // Remove hidden class BEFORE animation so SplitText can animate cleanly
          hi?.classList.remove("split-hidden")
          mid?.classList.remove("split-hidden");
          end?.classList.remove("split-hidden");

          // SPLIT TEXT AFTER LAYOUT IS 100% STABLE
          const paraSplit = new SplitText("#mid", { type: "chars, words" });
          const quoteSplit = new SplitText("#end", { type: "chars, words" });

          // HEADLINE ANIMATION
          gsap.fromTo(
            "#hi",
            { y: -100, opacity: 0, delay:0.5},
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
            }
          );

          // MID PARAGRAPH (NO SCROLL TRIGGER → LESS GLITCHING)
          gsap.fromTo(
            paraSplit.words,
            { y: 30, opacity: 0 },
            {
              opacity: 1,
              y: 0,
              // duration: 0.5,
              ease: "expo.out",
              stagger: 0.03,
              delay: 0.8,
            }
          );

          // END QUOTE WITH SCROLL TRIGGER
          gsap.fromTo(
            quoteSplit.chars,
            { y: 20, opacity: 0 },
            {
              opacity: 1,
              y: 0,
              ease: "none",
              scrollTrigger: {
                trigger: "#end",
                start: "top 80%",
                end: "top 25%",
                scrub: 2,
              },
              stagger: 0.05,
            }
          );

          // LINE ANIMATION
          gsap.fromTo(
            "#line",
            { opacity: 0, xPercent: 100 },
            {
              opacity: 1,
              xPercent: 0,
              scrollTrigger: {
                trigger: "#line",
                start: "top 80%",
                end: "top 30%",
                scrub: true,
              },
            }
          );

          // 2. Final refresh → eliminates 100% glitching
          ScrollTrigger.refresh();
        }, 200); // small delay = pseudo preload
      });
    });
  }, []);

  return (
    <div className="min-h-screen">
      <div className="px-6 py-16 mt-5 flex flex-col gap-16">
        <div className="text-5xl justify-items-center">
          {}
          <h1 id="hi" className="text-text-amber mt-30 mr-67 split-hidden">
            hi,
          </h1>

          <p id="mid" className="text-text-primary w-80 split-hidden">
            I created this site for people to search or view the information
            about entertainment media. Its also a learning project
          </p>
        </div>

        <div className="max-w-3xl mt-35 mx-auto px-6 sm:px-10 md:px-16">
          <div id="end" className="flex items-start gap-3 mt-10 split-hidden">
            <h1 className="text-text-secondary text-xl w-80 sm:text-3xl sm:w-120 leading-relaxed">
              <Quote
                size={30}
                className="scale-x-[-1] opacity-40 -ml-9 -mb-5"
              />
              As a movie and webseries lover, before I watch anything I look for
              people's reviews and ratings, so I have to surf through multiple
              sites. I find that a waste of my time — that's when CineAura comes
              in...
              <Quote
                size={30}
                className="opacity-40 ml-73 -mt-10 sm:ml-110 sm:-mt-12"
              />
            </h1>
          </div>
        </div>

        <div className="mt-100">
          <div className="overflow-hidden">
            <hr id="line" className="border-2 border-text-secondary mb-10"></hr>
          </div>
          <h1 className="justify-self-center text-5xl font-thin mb-20">API</h1>
          <div className="flex gap-2">
            <h1 className="text-l md:text-2xl md:w-200 sm:text-4xl self-center text-text-secondary font-thin">
              I used TMDB api for fetching movies and web-series data.
            </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 190.24 81.52"
              className="w-50 h-20 md:w-200 md:h-80 sm:ml-50 sm:w-300 sm:h-200 md:ml-50"
            >
              <defs>
                <linearGradient
                  id="linear-gradient"
                  y1="40.76"
                  x2="190.24"
                  y2="40.76"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#90cea1" />
                  <stop offset="0.56" stopColor="#3cbec9" />
                  <stop offset="1" stopColor="#00b3e5" />
                </linearGradient>
              </defs>

              <path
                className="cls-1"
                fill="url(#linear-gradient)"
                d="M105.67,36.06h66.9A17.67,17.67,0,0,0,190.24,18.4h0A17.67,17.67,0,0,0,172.57.73h-66.9A17.67,17.67,0,0,0,88,18.4h0A17.67,17.67,0,0,0,105.67,36.06Zm-88,45h76.9A17.67,17.67,0,0,0,112.24,63.4h0A17.67,17.67,0,0,0,94.57,45.73H17.67A17.67,17.67,0,0,0,0,63.4H0A17.67,17.67,0,0,0,17.67,81.06ZM10.41,35.42h7.8V6.92h10.1V0H.31v6.9h10.1Zm28.1,0h7.8V8.25h.1l9,27.15h6l9.3-27.15h.1V35.4h7.8V0H66.76l-8.2,23.1h-.1L50.31,0H38.51ZM152.43,55.67a15.07,15.07,0,0,0-4.52-5.52,18.57,18.57,0,0,0-6.68-3.08,33.54,33.54,0,0,0-8.07-1h-11.7v35.4h12.75a24.58,24.58,0,0,0,7.55-1.15A19.34,19.34,0,0,0,148.11,77a16.27,16.27,0,0,0,4.37-5.5,16.91,16.91,0,0,0,1.63-7.58A18.5,18.5,0,0,0,152.43,55.67ZM145,68.6A8.8,8.8,0,0,1,142.36,72a10.7,10.7,0,0,1-4,1.82,21.57,21.57,0,0,1-5,.55h-4.05v-21h4.6a17,17,0,0,1,4.67.63,11.66,11.66,0,0,1,3.88,1.87A9.14,9.14,0,0,1,145,59a9.87,9.87,0,0,1,1,4.52A11.89,11.89,0,0,1,145,68.6Zm44.63-.13a8,8,0,0,0-1.58-2.62A8.38,8.38,0,0,0,185.63,64a10.31,10.31,0,0,0-3.17-1v-.1a9.22,9.22,0,0,0,4.42-2.82A7.43,7.43,0,0,0,188.56,55a8.42,8.42,0,0,0-1.15-4.65,8.09,8.09,0,0,0-3-2.72,12.56,12.56,0,0,0-4.18-1.3,32.84,32.84,0,0,0-4.62-.33h-13.2v35.4h14.5a22.41,22.41,0,0,0,4.72-.5,13.53,13.53,0,0,0,4.28-1.65,9.42,9.42,0,0,0,3.1-3,8.52,8.52,0,0,0,1.2-4.68A9.39,9.39,0,0,0,189.66,68.47ZM170.21,52.72h5.3a10,10,0,0,1,1.85.18,6.18,6.18,0,0,1,1.7.57,3.39,3.39,0,0,1,1.22,1.13,3.22,3.22,0,0,1,.48,1.82,3.63,3.63,0,0,1-.43,1.8,3.4,3.4,0,0,1-1.12,1.2,4.92,4.92,0,0,1-1.58.65,7.51,7.51,0,0,1-1.77.2h-5.65Zm11.72,20a3.9,3.9,0,0,1-1.22,1.3,4.64,4.64,0,0,1-1.68.7,8.18,8.18,0,0,1-1.82.2h-7v-8h5.9a15.35,15.35,0,0,1,2,.15,8.47,8.47,0,0,1,2.05.55,4,4,0,0,1,1.57,1.18,3.11,3.11,0,0,1,.63,2A3.71,3.71,0,0,1,181.93,72.72Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
