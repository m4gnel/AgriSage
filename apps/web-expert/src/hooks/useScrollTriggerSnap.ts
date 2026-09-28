import { useEffect, useState } from 'react';
import { playHoverChime } from '../utils/audioFX';

interface UseScrollTriggerSnapOptions {
  totalChapters?: number;
  onChapterChange?: (chapter: number) => void;
}

export const useScrollTriggerSnap = ({
  totalChapters = 12,
  onChapterChange
}: UseScrollTriggerSnapOptions = {}) => {
  const [activeChapter, setActiveChapter] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // 1. Intersection Observer for buttery GSAP-style ScrollTrigger reveals
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const chapterNum = Number(el.getAttribute('data-chapter'));

          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            el.classList.add('is-active-snap');
            if (chapterNum && !isNaN(chapterNum)) {
              setActiveChapter(chapterNum);
              onChapterChange?.(chapterNum);
            }
          } else if (!entry.isIntersecting) {
            el.classList.remove('is-active-snap');
          }
        });
      },
      {
        threshold: [0.15, 0.25, 0.5],
        rootMargin: '-2% 0px -2% 0px'
      }
    );

    const sections = document.querySelectorAll('section[data-chapter]');
    sections.forEach((sec) => observer.observe(sec));

    // 2. Timeline Scrubber Progress Calculation
    let lastProgress = -1;
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const percent = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100));
        if (Math.abs(percent - lastProgress) > 0.4 || percent === 0 || percent === 100) {
          lastProgress = percent;
          setScrollProgress(percent);
        }

        // Safeguard for Chapter 12 at very bottom of page
        if (percent >= 97) {
          const ch12 = document.querySelector('section[data-chapter="12"]');
          if (ch12 && !ch12.classList.contains('is-active-snap')) {
            ch12.classList.add('is-active-snap');
            setActiveChapter(12);
            onChapterChange?.(12);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 3. Smooth Keyboard Snap Navigation (ArrowDown / ArrowUp)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const next = Math.min(totalChapters, activeChapter + 1);
        scrollToChapter(next);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prev = Math.max(1, activeChapter - 1);
        scrollToChapter(prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeChapter, totalChapters, onChapterChange]);

  const scrollToChapter = (chapNum: number) => {
    playHoverChime(420 + chapNum * 25);
    const target = document.querySelector(`section[data-chapter="${chapNum}"]`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return {
    activeChapter,
    scrollProgress,
    scrollToChapter
  };
};
