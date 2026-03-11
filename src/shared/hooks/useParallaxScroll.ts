import { useEffect, useRef } from 'react';

export function useParallaxScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const scrollBtnRef = useRef<HTMLButtonElement>(null);
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
      heightDocument = heroHeight + content.offsetHeight + footerHeight - 20;

      container.style.height = `${heightDocument}px`;
      main.style.height = `${heightDocument}px`;
      hero.style.height = `${heroHeight}px`;
      wrapper.style.marginTop = `${heroHeight}px`;
      wrapper.style.marginBottom = `${footerHeight}px`;
      setFooterBottom(`-${footerHeight}px`);

      // Фиксируем позицию кнопки относительно низа экрана (на границе футера)
      const btn = scrollBtnRef.current;
      if (btn) {
        const isMobile = window.innerWidth <= 767;
        btn.style.bottom = isMobile ? '31px' : `${footerHeight - btn.offsetHeight / 2 - 15}px`;
      }
    };

    const setup = () => {
      applyHeights();

      let scrollEndTimer: ReturnType<typeof setTimeout>;

      const handleScroll = () => {
        const scroll = window.scrollY;
        main.style.top = `-${scroll}px`;
        hero.style.backgroundPositionY = `${50 - (scroll * 100) / heightDocument}%`;
        const footerHeight = footer.offsetHeight;
        setFooterBottom(scroll >= footerHeight ? '0px' : `-${footerHeight}px`);
        if (stickyHeader) {
          stickyHeader.style.transform = scroll > 100 ? 'translateY(0)' : 'translateY(-100%)';
        }

        const btn = scrollBtnRef.current;
        if (!btn) return;

        // Кнопка видна только после первой секции
        if (scroll < heroHeight) {
          btn.style.transform = 'translateX(calc(100% + 50px))';
          clearTimeout(scrollEndTimer);
          return;
        }

        // Прячем при скролле, возвращаем после остановки
        btn.style.transform = 'translateX(calc(100% + 50px))';
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
          btn.style.transform = 'translateX(0)';
        }, 400);
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
    scrollBtnRef,
    contentRef,
    wrapperRef,
    stickyHeaderRef,
  };
}
