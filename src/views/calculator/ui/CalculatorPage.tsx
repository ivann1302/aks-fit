'use client';

import { useRef, useState } from 'react';
import { useFooterReveal } from '@/shared/hooks';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { CalcHero } from '@/widgets/calc-hero';
import { CalculatorSection } from '@/widgets/calculator';
import { ResultsSection } from '@/widgets/calc-results';
import { HowItWorksSection } from '@/widgets/how-it-works';
import { CalcCta } from '@/widgets/calc-cta';
import type { CalculatorFormData, CalculatorResult } from '@/widgets/calculator';
import styles from './CalculatorPage.module.scss';

export function CalculatorPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { footerRef } = useFooterReveal(
    containerRef as React.RefObject<HTMLElement | null>,
    wrapperRef as React.RefObject<HTMLElement | null>,
    contentRef as React.RefObject<HTMLElement | null>
  );

  const [calcData, setCalcData] = useState<{
    result: CalculatorResult;
    form: CalculatorFormData;
  } | null>(null);

  return (
    <div ref={containerRef} className={styles.page}>
      <Header alwaysVisible />
      <div ref={wrapperRef} className={styles.wrapper}>
        <div ref={contentRef}>
          <CalcHero />
          <main className={styles.main}>
            <div id="calculator">
              <CalculatorSection onResult={(result, form) => setCalcData({ result, form })} />
            </div>
            {calcData && <ResultsSection result={calcData.result} form={calcData.form} />}
            <HowItWorksSection />
            <CalcCta />
          </main>
        </div>
        <Footer footerRef={footerRef} />
      </div>
    </div>
  );
}
