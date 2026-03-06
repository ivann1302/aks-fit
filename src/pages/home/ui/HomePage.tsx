'use client';

import { useParallaxScroll } from '@/shared/hooks';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { HeroSection } from '@/widgets/hero';
import { AboutSection } from '@/widgets/about';
import { ServicesSection } from '@/widgets/services';
import { ReviewsSection } from '@/widgets/reviews';
import { ContactsSection } from '@/widgets/contacts';
import { FaqSection } from '@/widgets/faq';
import styles from './HomePage.module.scss';

export function HomePage() {
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
            <ReviewsSection />
            <ContactsSection />
            <FaqSection />
          </div>
          <Footer footerRef={footerRef} />
        </div>
      </div>
    </div>
  );
}
