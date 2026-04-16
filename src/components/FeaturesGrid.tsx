"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

const features = [
  {
    title: "Fast & Reliable",
    description: "Your site loads in under 1 second, worldwide.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  },
  {
    title: "We Watch It 24/7",
    description: "Get alerted the moment anything goes wrong.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
  },
  {
    title: "50 Professional Themes",
    description: "Pick your look. Switch anytime.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
  },
  {
    title: "Everything Built In",
    description: "Booking, store, blog, reviews \u2014 one click to turn on.",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80",
  },
  {
    title: "Real Human Support",
    description: "Text or email us directly. No bots, no tickets.",
    image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=600&q=80",
  },
  {
    title: "Secure by Default",
    description: "Enterprise-level security, handled for you.",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&q=80",
  },
  {
    title: "Built-In SEO",
    description: "Show up on Google. We handle the technical setup.",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f5f989?w=600&q=80",
  },
  {
    title: "Developer Option",
    description: "Want the code? Take it for $49.99 one-time.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
  },
];

export function FeaturesGrid() {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimer = useRef<NodeJS.Timeout>(null);

  const pauseAndResume = () => {
    setIsPaused(true);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => {
      setIsPaused(false);
    }, 1500);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (trackRef.current?.offsetLeft || 0);
    scrollLeftRef.current = trackRef.current?.scrollLeft || 0;
    pauseAndResume();
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - (trackRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 2;
    trackRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsPaused(true);
    }
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const handleTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].pageX - el.offsetLeft;
      scrollLeftRef.current = el.scrollLeft;
      pauseAndResume();
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const x = e.touches[0].pageX - el.offsetLeft;
      const walk = (x - startX.current) * 2;
      el.scrollLeft = scrollLeftRef.current - walk;
    };

    const handleTouchEnd = () => {
      pauseAndResume();
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-24">
      <Container>
        <motion.div
          className="text-center mb-12 px-4 pb-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl sm:text-6xl font-black text-center bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-4 leading-tight">
            Everything included
          </h2>
          <p className="text-2xl font-bold text-center text-violet-300 mb-16">
            No extras. No surprises.
          </p>
        </motion.div>
      </Container>

      <div className="overflow-hidden w-full">
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none px-8"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          animation: isPaused ? 'none' : 'scroll-gallery 25s linear infinite',
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {[...features, ...features, ...features].map((f, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 w-[85vw] sm:w-80 h-56 rounded-2xl overflow-hidden group cursor-pointer snap-start"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={f.image}
              alt={f.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-white font-bold text-lg leading-tight">
                {f.title}
              </h3>
              <p className="text-white/80 text-sm mt-1">{f.description}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
