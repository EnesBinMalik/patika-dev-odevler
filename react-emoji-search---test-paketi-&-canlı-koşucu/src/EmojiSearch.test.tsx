/**
 * @file EmojiSearch.test.tsx
 * @description React Emoji Search - TypeScript Kapsamlı Test Paketi
 * @author Enes Öztürk
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('React Emoji Search - Enes Öztürk Test Paketi (TS)', () => {
  let writeTextMock: jest.Mock;

  beforeEach(() => {
    writeTextMock = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('1. Başlık bileşeninin (Header) başarılı bir şekilde render edildiğini kontrol eder', () => {
    render(<App />);
    const headerTitle = screen.getByText(/Emoji Search/i);
    expect(headerTitle).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  test('2. Uygulama ilk açıldığında emoji listesinin (20 öğe) render edildiğini kontrol eder', () => {
    render(<App />);
    const emojiRows = screen.getAllByTestId('emoji-row');
    expect(emojiRows).toHaveLength(20);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('3. Filtreleme yapıldığında listenin filtreye uygun render edildiğini kontrol eder', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/search emoji/i);
    fireEvent.change(searchInput, { target: { value: 'Joy' } });

    expect(screen.getByText('Joy')).toBeInTheDocument();
    expect(screen.queryByText('100')).not.toBeInTheDocument();
  });

  test('4. Emojiye tıklandığında panoya (clipboard) kopyalandığını kontrol eder', () => {
    render(<App />);
    const firstEmoji = screen.getAllByTestId('emoji-row')[0];
    const emojiSymbol = firstEmoji.getAttribute('data-clipboard-text');

    fireEvent.click(firstEmoji);

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    expect(writeTextMock).toHaveBeenCalledWith(emojiSymbol);
  });
});
