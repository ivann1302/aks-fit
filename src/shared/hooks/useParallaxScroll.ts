import { useEffect, useRef } from 'react';

export function useParallaxScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyHeaderRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const main = mainRef.current;
    const hero = heroRef.current;
    const footer = footerRef.current;
    const content = contentRef.current;
    const wrapper = wrapperRef.current;
    const stickyHeader = stickyHeaderRef.current;

    if (!container || !main || !hero || !footer || !content || !wrapper) return;

    let removeScroll: (() => void) | undefined;
    let heightDocument = 0;
    let heroHeight = 0;

    const setFooterBottom = (value: string) => {
      footer.style.bottom = value;
    };

    const applyHeights = () => {
      heroHeight = window.innerHeight;
      const footerHeight = footer.offsetHeight;
      heightDocument = heroHeight + content.offsetHeight + footerHeight;

      container.style.height = `${heightDocument}px`;
      main.style.height = `${heightDocument}px`;
      hero.style.height = `${heroHeight}px`;
      wrapper.style.marginTop = `${heroHeight}px`;
      wrapper.style.marginBottom = `${footerHeight}px`;
      setFooterBottom(`-${footerHeight}px`);
    };

    const setup = () => {
      applyHeights();

      const handleScroll = () => {
        const scroll = window.scrollY;
        main.style.top = `-${scroll}px`;
        hero.style.backgroundPositionY = `${50 - (scroll * 100) / heightDocument}%`;
        const footerHeight = footer.offsetHeight;
        setFooterBottom(scroll >= footerHeight ? '0px' : `-${footerHeight}px`);
        if (stickyHeader) {
          stickyHeader.style.transform = scroll > 100 ? 'translateY(0)' : 'translateY(-100%)';
        }
      };

      window.addEventListener('scroll', handleScroll);
      removeScroll = () => window.removeEventListener('scroll', handleScroll);
    };

    const resizeObserver = new ResizeObserver(() => {
      applyHeights();
    });

    if (document.readyState === 'complete') {
      setup();
    } else {
      window.addEventListener('load', setup, { once: true });
    }

    resizeObserver.observe(content);

    return () => {
      removeScroll?.();
      resizeObserver.disconnect();
      window.removeEventListener('load', setup);
    };
  }, []);

  return {
    containerRef,
    mainRef,
    heroRef,
    footerRef,
    contentRef,
    wrapperRef,
    stickyHeaderRef,
  };
}
