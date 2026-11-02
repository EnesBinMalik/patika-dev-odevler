"""Depo görsellerini üretir: docs/banner.png ve docs/social-preview.png.

Kullanım:  python docs/make_banner.py
Gerekli:   Pillow (PIL).
  banner.png         1600x640  -> README üstü
  social-preview.png 1200x630  -> GitHub > Settings > Social preview
"""

from PIL import Image, ImageDraw, ImageFilter, ImageFont
import pathlib

SCALE = 2
W, H = 1600 * SCALE, 640 * SCALE
DOCS = pathlib.Path(__file__).resolve().parent

F = lambda n, s: ImageFont.truetype(f"C:/Windows/Fonts/{n}", s * SCALE)
BOLD, MONO, REG, LIGHT = F("arialbd.ttf", 62), F("consolab.ttf", 20), F("arial.ttf", 22), F("segoeuil.ttf", 26)

INK = (233, 240, 251)
DIM = (148, 163, 190)
CYAN = (34, 211, 238)
VIOLET = (139, 92, 246)
AMBER = (251, 191, 36)
CARD = (13, 20, 33)
EDGE = (41, 55, 79)


def gradient(img):
    d = ImageDraw.Draw(img)
    top, bottom = (8, 13, 24), (17, 25, 41)
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=tuple(int(a + (b - a) * t) for a, b in zip(top, bottom)))


def glow(img, cx, cy, r, color, alpha):
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse([cx - r, cy - r, cx + r, cy + r], fill=color + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(r * 0.55))
    img.alpha_composite(layer)


def grid(img):
    d = ImageDraw.Draw(img)
    step = 46 * SCALE
    for x in range(0, W, step):
        d.line([(x, 0), (x, H)], fill=(255, 255, 255, 7))
    for y in range(0, H, step):
        d.line([(0, y), (W, y)], fill=(255, 255, 255, 7))


def spaced(d, xy, text, font, fill, tracking):
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill)
        x += d.textlength(ch, font=font) + tracking * SCALE
    return x


def main():
    img = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    gradient(img)
    glow(img, 300 * SCALE, 120 * SCALE, 320 * SCALE, CYAN, 46)
    glow(img, 1420 * SCALE, 560 * SCALE, 300 * SCALE, VIOLET, 52)
    grid(img)

    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 10 * SCALE, H], fill=CYAN)

    # sol blok
    x = 84 * SCALE
    spaced(d, (x, 62 * SCALE), "PATIKA.DEV  ·  ACIK KAYNAK ODEV ARSIVI", MONO, CYAN, 3)
    d.text((x, 118 * SCALE), "Patika.dev Ödevleri", font=F("arialbd.ttf", 66), fill=INK)
    d.text((x, 200 * SCALE), "& Proje Arşivi", font=F("arialbd.ttf", 66), fill=VIOLET)
    d.text((x, 288 * SCALE), "Node.js · GraphQL · Express · MongoDB · Java · Rust · Solana · React", font=F("arial.ttf", 25), fill=DIM)

    # istatistik kartları
    stats = [("63", "proje klasörü", CYAN), ("9", "teknoloji hattı", VIOLET), ("12", "ayrıntılı README", AMBER)]
    cx = x
    for value, label, accent in stats:
        w, h = 196 * SCALE, 118 * SCALE
        d.rounded_rectangle([cx, 356 * SCALE, cx + w, 356 * SCALE + h], radius=14 * SCALE, fill=CARD + (235,), outline=EDGE, width=SCALE)
        d.rounded_rectangle([cx, 356 * SCALE, cx + 5 * SCALE, 356 * SCALE + h], radius=2 * SCALE, fill=accent)
        d.text((cx + 24 * SCALE, 372 * SCALE), value, font=F("arialbd.ttf", 40), fill=accent)
        d.text((cx + 24 * SCALE, 424 * SCALE), label, font=F("arial.ttf", 19), fill=DIM)
        cx += w + 22 * SCALE

    d.text((x, 512 * SCALE), "Hazırlayan: Enes Öztürk", font=LIGHT, fill=INK)
    spaced(d, (x, 556 * SCALE), "github.com/EnesBinMalik/patika-dev-odevler", MONO, DIM, 0)

    # sağ blok: terminal mockup
    tx, ty, tw, th = 1012 * SCALE, 96 * SCALE, 512 * SCALE, 452 * SCALE
    d.rounded_rectangle([tx, ty, tx + tw, ty + th], radius=16 * SCALE, fill=(9, 14, 24, 245), outline=EDGE, width=SCALE)
    d.rounded_rectangle([tx, ty, tx + tw, ty + 44 * SCALE], radius=16 * SCALE, fill=(20, 28, 44, 255))
    d.rectangle([tx, ty + 30 * SCALE, tx + tw, ty + 44 * SCALE], fill=(20, 28, 44, 255))
    for i, c in enumerate(((248, 113, 113), (251, 191, 36), (74, 222, 128))):
        d.ellipse([tx + 20 * SCALE + i * 20 * SCALE, ty + 16 * SCALE, tx + 30 * SCALE + i * 20 * SCALE, ty + 26 * SCALE], fill=c)
    d.text((tx + 92 * SCALE, ty + 12 * SCALE), "arsiv.sh", font=MONO, fill=DIM)

    lines = [
        ("$ ls -d */ | wc -l", INK),
        ("63", DIM),
        ("", DIM),
        ("$ cat hatlar.txt", INK),
        ("nodejs   graphql   cleanblog", CYAN),
        ("java     rust      solana", VIOLET),
        ("react    oyun      projeler", AMBER),
        ("", DIM),
        ("$ grep -r 'README.md' -l | wc -l", INK),
        ("63 / 63", DIM),
    ]
    ly = ty + 66 * SCALE
    for text, color in lines:
        if text:
            d.text((tx + 24 * SCALE, ly), text, font=F("consolab.ttf", 19), fill=color)
        ly += 34 * SCALE

    banner = img.resize((W // SCALE, H // SCALE), Image.LANCZOS).convert("RGB")
    banner.save(DOCS / "banner.png")

    # GitHub sosyal önizleme: 1200x630, afiş dikey olarak ortalanır
    sw, sh = 1200, 630
    scaled = banner.resize((sw, int(sw * banner.height / banner.width)), Image.LANCZOS)
    canvas = Image.new("RGB", (sw, sh), (10, 16, 28))
    cd = ImageDraw.Draw(canvas)
    for y in range(sh):
        t = y / sh
        cd.line([(0, y), (sw, y)], fill=tuple(int(a + (b - a) * t) for a, b in zip((8, 13, 24), (17, 25, 41))))
    canvas.paste(scaled, (0, (sh - scaled.height) // 2))
    cd = ImageDraw.Draw(canvas)
    caption = ImageFont.truetype("C:/Windows/Fonts/consolab.ttf", 12)
    cx = 36
    for ch in "63 ODEV VE PROJE KLASORU  ·  TEK CATI ALTINDA":
        cd.text((cx, 596), ch, font=caption, fill=DIM)
        cx += cd.textlength(ch, font=caption) + 1
    canvas.save(DOCS / "social-preview.png")
    print("yazıldı:", DOCS / "banner.png", "|", DOCS / "social-preview.png")


if __name__ == "__main__":
    main()
