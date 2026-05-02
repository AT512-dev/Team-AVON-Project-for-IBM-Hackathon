"use client";

interface ErrorBannerProps {
  message: string;
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <>
      <style>{`
        .error-banner {
          background: rgba(239,68,68,0.08);
          border: 1px solid rgba(239,68,68,0.2);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          color: #fca5a5;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
      `}</style>
      <div className="error-banner">
        <span className="material-symbols-outlined">error</span>
        {message}
      </div>
    </>
  );
}
