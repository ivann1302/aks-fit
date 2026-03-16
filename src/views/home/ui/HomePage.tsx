'use client';

import { useEffect } from 'react';
import { useParallaxScroll } from '@/shared/hooks';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { HeroSection } from '@/widgets/hero';
import { AboutSection } from '@/widgets/about';
import { ServicesSection } from '@/widgets/services';
import { ProcessSection } from '@/widgets/process';
import { PricingSection } from '@/widgets/pricing';
import { QaSection } from '@/widgets/qa';
import { ReviewsSection } from '@/widgets/reviews';
import { ContactsSection } from '@/widgets/contacts';
import { FaqSection } from '@/widgets/faq';
import { BlogSection } from '@/widgets/blog-section';
import styles from './HomePage.module.scss';

export function HomePage() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  }, []);

  const { containerRef, mainRef, heroRef, footerRef, contentRef, wrapperRef, stickyHeaderRef } =
    useParallaxScroll();

  return (
    <div className={styles.scrollAnimate} ref={containerRef}>
      <Header headerRef={stickyHeaderRef} />
      <div className={styles.scrollAnimateMain} ref={mainRef}>
        <div className={styles.wrapperParallax} ref={wrapperRef}>
          <HeroSection heroRef={heroRef} />
          <div ref={contentRef}>
            <AboutSection />
            <ServicesSection />
            <ProcessSection />
            <PricingSection />
            <QaSection />
            <ReviewsSection />
            <ContactsSection />
            <FaqSection />
            <BlogSection />
          </div>
          <Footer footerRef={footerRef} />
        </div>
      </div>
    </div>
  );
}
