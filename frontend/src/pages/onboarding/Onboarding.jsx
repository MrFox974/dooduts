import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PARTICLE_CONTENT } from './OnboardingParticles';

const SUB_SLIDES = [
  { text: 'Etes-vous prêt à vous réaliser ?' },
  { text: 'à devenir la meilleure version de vous-même ?' },
  { text: 'et à contribuer à faire de ce monde, un monde meilleur ?', showButton: true },
];

const SUB_SLIDE_DURATION = 3000;

function Onboarding() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [subSlideIndex, setSubSlideIndex] = useState(0);
  const [subSlideProgress, setSubSlideProgress] = useState(0);
  const [aiAssistantChecked, setAiAssistantChecked] = useState(false);
  const transitioningToSlide1Ref = useRef(false);

  const navigate = useNavigate();
  const currentSubSlide = SUB_SLIDES[subSlideIndex];
  const isLastSubSlide = subSlideIndex === SUB_SLIDES.length - 1;

  // Barres de progression type story (3s par sous-slide) - uniquement sur slide 0
  useEffect(() => {
    if (slideIndex !== 0 || transitioningToSlide1Ref.current) return;
    const start = Date.now();
    const interval = setInterval(() => {
      if (transitioningToSlide1Ref.current) return;
      const elapsed = Date.now() - start;
      const progress = Math.min((elapsed / SUB_SLIDE_DURATION) * 100, 100);
      setSubSlideProgress(progress);
    }, 50);
    return () => clearInterval(interval);
  }, [subSlideIndex, slideIndex]);

  // Passage automatique aux sous-slides (sauf le dernier qui a le bouton OUI)
  useEffect(() => {
    if (slideIndex !== 0 || transitioningToSlide1Ref.current) return;
    if (subSlideProgress >= 100 && subSlideIndex < SUB_SLIDES.length - 1 && !currentSubSlide?.showButton) {
      setSubSlideIndex((prev) => prev + 1);
      setSubSlideProgress(0);
    }
  }, [subSlideProgress, subSlideIndex, currentSubSlide?.showButton, slideIndex]);

  const handleOuiClick = useCallback(() => {
    if (slideIndex === 0 && isLastSubSlide) {
      transitioningToSlide1Ref.current = true;
      setSlideIndex(1);
    }
  }, [slideIndex, isLastSubSlide]);

  const handleCommencerRapidement = useCallback(() => {
    if (slideIndex === 1) {
      navigate('/home', { replace: true });
    }
  }, [slideIndex, navigate]);

  const handlePersonnaliser = useCallback(() => {
    if (slideIndex === 1) {
      navigate('/home', { replace: true });
    }
  }, [slideIndex, navigate]);

  const handleRetour = useCallback(() => {
    if (slideIndex === 1) {
      transitioningToSlide1Ref.current = false;
      setSlideIndex(0);
      setSubSlideIndex(SUB_SLIDES.length - 1);
    } else if (subSlideIndex > 0) {
      setSubSlideIndex((prev) => prev - 1);
      setSubSlideProgress(0);
    }
  }, [slideIndex, subSlideIndex]);

  const canGoBack = slideIndex === 1 || (slideIndex === 0 && subSlideIndex > 0);

  const particleTheme = subSlideIndex === 0 ? 'math' : subSlideIndex === 1 ? 'philo' : 'symbols';
  const particleContent = PARTICLE_CONTENT[particleTheme];
  const mathContent = PARTICLE_CONTENT.math;

  const renderParticle = (index, isSlide2 = false) => {
    const content = isSlide2 ? mathContent[index] : particleContent[index];
    const isSvg = typeof content !== 'string';
    const slide2Class = isSlide2 ? ' onboarding-particle-slide2' : '';
    return (
      <div
        key={index}
        className={`onboarding-particle onboarding-particle-${index + 1} onboarding-particle-content${isSvg ? ' onboarding-particle-svg' : ' onboarding-particle-text'}${slide2Class}`}
      >
        {content}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] relative overflow-hidden">
      {/* Piste de slides : slide 0 part à gauche, slide 1 arrive de la droite */}
      <div className="onboarding-slides-wrapper">
        <div className={`onboarding-slides-track${slideIndex === 1 ? ' slide-2-visible' : ''}`}>
          {/* Panel 1 : Slide 0 (3 sous-slides) */}
          <div className="onboarding-slide-panel relative">
            <div key={subSlideIndex} className="onboarding-canvas" aria-hidden>
              <div className="onboarding-bg-gradient" />
              <div className="onboarding-gradient" />
              <div className="onboarding-orb onboarding-orb-1" />
              <div className="onboarding-orb onboarding-orb-2" />
              <div className="onboarding-orb onboarding-orb-3" />
              {Array.from({ length: 15 }, (_, i) => renderParticle(i, false))}
              <svg className="onboarding-curves" viewBox="0 0 400 200" preserveAspectRatio="none">
                <path className="onboarding-curve-path" d="M0,100 Q100,50 200,100 T400,100" />
                <path className="onboarding-curve-path" d="M0,120 Q150,80 300,120 T400,120" />
                <path className="onboarding-curve-path" d="M0,80 Q120,60 250,80 T400,80" />
              </svg>
            </div>
            <div className="onboarding-canvas-overlay">
              <div className="flex gap-1.5 px-4 pt-6 pb-2 flex-shrink-0">
                {SUB_SLIDES.map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 h-1 rounded-full bg-[var(--progress-track)] overflow-hidden"
                  >
                    <div
                      className="h-full bg-[var(--accent)] rounded-full transition-all duration-75 ease-linear"
                      style={{
                        width:
                          i < subSlideIndex
                            ? '100%'
                            : i === subSlideIndex
                              ? `${subSlideProgress}%`
                              : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>
              <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 min-h-0">
                <div className="w-full max-w-2xl text-center">
                  <h2
                    key={subSlideIndex}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-[var(--text-primary)] leading-relaxed animate-bounce-in px-4"
                  >
                    {currentSubSlide?.text}
                  </h2>
                  {isLastSubSlide && currentSubSlide?.showButton && (
                    <div className="mt-10 animate-fade-in">
                      <button
                        type="button"
                        onClick={handleOuiClick}
                        className="px-8 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors"
                      >
                        OUI
                      </button>
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>

          {/* Panel 2 : Slide 1 (choix pré-config / personnaliser) */}
          <div className="onboarding-slide-panel relative">
            <div className="onboarding-canvas" aria-hidden>
              <div className="onboarding-bg-gradient" />
              <div className="onboarding-gradient" />
              <div className="onboarding-orb onboarding-orb-1" />
              <div className="onboarding-orb onboarding-orb-2" />
              <div className="onboarding-orb onboarding-orb-3" />
              {Array.from({ length: 15 }, (_, i) => renderParticle(i, true))}
            </div>
            <div className="onboarding-canvas-overlay">
              <main className="flex-1 flex flex-col items-center justify-center px-6 py-8 min-h-0">
                <div className="w-full max-w-xl">
                  <div className="flex flex-col divide-y-2 divide-[var(--border)] rounded-xl bg-white/75 backdrop-blur-sm shadow-lg border border-[var(--border)] overflow-hidden">
                    <div className="flex flex-col items-center justify-center px-8 py-10">
                      <p className="text-lg text-[var(--text-primary)] font-medium text-center mb-6">
                        Pré-configuration de base pour découvrir l&apos;application
                      </p>
                      <button
                        type="button"
                        onClick={handleCommencerRapidement}
                        className="px-8 py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors"
                      >
                        Commencer rapidement
                      </button>
                    </div>
                    <div className="flex flex-col items-center justify-center px-8 py-10">
                      <p className="text-lg text-[var(--text-primary)] font-medium text-center mb-6">
                        Personnaliser entièrement votre expérience
                      </p>
                      <label className="flex items-center gap-3 mb-6 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={aiAssistantChecked}
                          onChange={(e) => setAiAssistantChecked(e.target.checked)}
                          className="w-5 h-5 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                        />
                        <span className="text-[var(--text-secondary)]">
                          AI assistant vocal <span className="text-[var(--accent)]">(recommandé)</span>
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={handlePersonnaliser}
                        className="px-8 py-3 rounded-lg border-2 border-[var(--accent)] text-[var(--accent)] font-medium hover:bg-[var(--accent)] hover:text-white transition-colors"
                      >
                        Personnaliser
                      </button>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour */}
      {canGoBack && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10">
          <button
            type="button"
            onClick={handleRetour}
            className="text-[var(--text-secondary)] hover:text-[var(--accent)] text-sm font-medium transition-colors"
          >
            Retour
          </button>
        </div>
      )}
    </div>
  );
}

export default Onboarding;
