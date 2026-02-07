import { useEffect } from 'react';

const BRAIN_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8" />
    <path d="M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8" />
    <path d="M17.5 16a3.5 3.5 0 0 0 0 -7h-.5" />
    <path d="M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0" />
    <path d="M6.5 16a3.5 3.5 0 0 1 0 -7h.5" />
    <path d="M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10" />
  </svg>
);

const MODAL_ITEMS = [
  { id: 'routines', label: 'Routines' },
  { id: 'apprentissages', label: 'Apprentissages' },
  { id: 'todo', label: 'To do list' },
  { id: 'productivite', label: 'Productivité' },
];

function BrainModal({ isOpen, onClose, onSelect }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSelect = (id) => {
    onSelect?.(id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Menu assistant"
    >
      {/* Backdrop avec animation */}
      <div
        className="absolute inset-0 bg-[var(--text-primary)]/40 backdrop-blur-sm animate-brain-backdrop"
        onClick={handleBackdropClick}
      />

      {/* Contenu modal avec animation scale + fade */}
      <div
        className="relative z-10 w-full max-w-md mx-4 flex flex-col gap-4 animate-brain-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {MODAL_ITEMS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSelect(item.id)}
            className="brain-modal-btn w-full py-4 px-6 rounded-xl bg-white/95 backdrop-blur-sm border border-[var(--border)] text-[var(--text-primary)] font-medium text-lg shadow-lg hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]/30 transition-all duration-200"
            style={{ animationDelay: `${100 + index * 80}ms` }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export { BrainModal, BRAIN_ICON };
