/**
 * @file EmojiSearch.test.js
 * @description React Emoji Search - Kapsamlı Birim Test Paketi
 * @author Enes Öztürk (Geliştirici & Test Mühendisi)
 * @license Apache-2.0 / MIT
 *
 * Kodluyoruz / React Dokümanları Örnek Projesi Test Gereksinimleri:
 * 1. Başlık kısmının başarılı bir şekilde render edildiğini kontrol edecek test
 * 2. Uygulama ilk açıldığında emoji listesinin başarılı bir şekilde render edildiğini kontrol edecek test
 * 3. Bir filtreleme işlemi yapıldığında emoji listesinin bu filtreye uygun render edildiğini kontrol edecek test
 * 4. Liste üzerinden herhangi bir emojiye tıklandığında ilgili emojinin kopyalandığını kontrol edecek test
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

describe("React Emoji Search - Enes Öztürk Test Paketi", () => {
  let writeTextMock;

  beforeEach(() => {
    // 4. Test için Clipboard mock kurulumu
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

  /**
   * GEREKSİNİM 1:
   * Başlık kısmının başarılı bir şekilde render edildiğini kontrol eder.
   */
  test("1. Başlık kısmının (Header) başarılı bir şekilde render edildiğini kontrol eder", () => {
    render(<App />);

    // Başlık metnini ve görsel/ikon içeriğini kontrol et
    const headerElement = screen.getByText(/Emoji Search/i);
    expect(headerElement).toBeInTheDocument();

    // Başlığın bir header elementi içerisinde olduğunu doğrula
    const headerContainer = screen.getByTestId("header");
    expect(headerContainer).toBeInTheDocument();
  });

  /**
   * GEREKSİNİM 2:
   * Uygulama ilk açıldığında emoji listesinin başarılı bir şekilde render edildiğini kontrol eder.
   * (Varsayılan maxResults limiti 20'dir)
   */
  test("2. Uygulama ilk açıldığında varsayılan emoji listesinin (20 adet) başarıyla render edildiğini kontrol eder", () => {
    render(<App />);

    // Ekranda listelenen tüm emoji satırlarını al
    const emojiRows = screen.getAllByTestId("emoji-row");

    // Listenin varsayılan olarak 20 adet emoji render ettiğini doğrula
    expect(emojiRows).toHaveLength(20);

    // İlk emoji olan '100'ün belgede yer aldığını doğrula
    const firstEmoji = screen.getByText("100");
    expect(firstEmoji).toBeInTheDocument();
  });

  /**
   * GEREKSİNİM 3:
   * Bir filtreleme işlemi yapıldığında, emoji listesinin bu filtreye uygun şekilde yeniden render edildiğini kontrol eder.
   */
  test("3. Bir filtreleme işlemi yapıldığında emoji listesinin filtreye uygun şekilde yeniden render edildiğini kontrol eder", () => {
    render(<App />);

    // Arama kutusunu bul
    const searchInput = screen.getByPlaceholderText(/Search emoji/i);
    expect(searchInput).toBeInTheDocument();

    // 'Joy' kelimesini input'a gir
    fireEvent.change(searchInput, { target: { value: "Joy" } });

    // Filtrelenen sonuçlarda 'Joy' başlığının olduğunu doğrula
    const joyEmoji = screen.getByText("Joy");
    expect(joyEmoji).toBeInTheDocument();

    // Filtreye uymayan '100' emojisi artık DOM'da bulunmamalı
    const nonMatchingEmoji = screen.queryByText("100");
    expect(nonMatchingEmoji).not.toBeInTheDocument();
  });

  /**
   * GEREKSİNİM 4:
   * Liste üzerinden herhangi bir emojiye tıklandığında, ilgili emojinin kopyalandığını kontrol eder.
   */
  test("4. Liste üzerinden bir emojiye tıklandığında ilgili emojinin panoya kopyalandığını kontrol eder", async () => {
    render(<App />);

    // İlk emoji satırını seç
    const emojiRows = screen.getAllByTestId("emoji-row");
    const firstEmojiRow = emojiRows[0];

    // Satırdaki kopyalanacak emoji sembolünü al (data-clipboard-text niteliğinden)
    const expectedEmojiSymbol = firstEmojiRow.getAttribute("data-clipboard-text");

    // Emoji satırına tıkla
    fireEvent.click(firstEmojiRow);

    // navigator.clipboard.writeText fonksiyonunun 1 kez çağrıldığını doğrula
    expect(writeTextMock).toHaveBeenCalledTimes(1);

    // Fonksiyonun beklenen emoji karakteri ile çağrıldığını doğrula
    expect(writeTextMock).toHaveBeenCalledWith(expectedEmojiSymbol);
  });
});
