/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Author: Enes Öztürk
 * Project: BookStore WebApi Unit Testing Suite (.NET Core)
 */

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-800 bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>BookStore WebApi Unit Test Suite</span>
            <span aria-hidden="true">·</span>
            <span>Geliştirici: Enes Öztürk</span>
            <span aria-hidden="true">·</span>
            <span>.NET 6 / C# 10</span>
          </div>
          <div>
            xUnit, FluentAssertions ve FluentValidation ile hazırlanmıştır.
          </div>
        </div>
      </div>
    </footer>
  );
};
