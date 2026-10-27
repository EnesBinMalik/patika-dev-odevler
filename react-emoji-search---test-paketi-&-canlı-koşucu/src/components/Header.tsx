import React from 'react';

export const Header: React.FC = () => {
  return (
    <header
      data-testid="header"
      className="component-header flex items-center justify-center gap-3 py-6 text-center select-none"
    >
      <span className="text-3xl sm:text-4xl" role="img" aria-label="smiling cat">
        😸
      </span>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
        Emoji Search
      </h1>
      <span className="text-3xl sm:text-4xl" role="img" aria-label="smiling cat">
        😸
      </span>
    </header>
  );
};
