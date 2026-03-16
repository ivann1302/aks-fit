import { useEffect, useRef } from 'react';

export function useFooterReveal(
  containerRef: React.RefObject<HTMLElement | null>,
  wrapperRef: React.RefObject<HTMLElement | null>,
  contentRef: React.RefObject<HTMLElement | null>
) {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    const footer = footerRef.current;
    if (!container || !wrapper || !content || !footer) return;

    let removeScroll: (() => void) | undefined;

    const handleScroll = () => {
      const scroll = window.scrollY;
      const footerH = footer.offsetHeight;
      const contentH = content.offsetHeight;
      const viewH = window.innerHeight;

      // Wrapper сдвигается вверх — как scrollAnimateMain на главной
      wrapper.style.top = `-${scroll}px`;

      // Футер появляется пропорционально после того как контент уходит из вьюпорта
      const revealStart = contentH - viewH;
      const extra = scroll - revealStart;
      const clamped = Math.max(0, Math.min(extra, footerH));
      footer.style.bottom = `-${footerH - clamped}px`;
    };

    const applyHeights = () => {
      const footerH = footer.offsetHeight;
      const contentH = content.offsetHeight;
      const totalH = contentH + footerH;

      container.style.height = `${totalH}px`;
      wrapper.style.height = `${totalH}px`;

      handleScroll();
    };

    const setup = () => {
      applyHeights();

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
  }, [containerRef, wrapperRef, contentRef]);

  return { footerRef };
}
