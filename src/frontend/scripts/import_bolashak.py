"""Import the Bolashak 2024-2026 list of recommended foreign universities.

Usage:  python3 scripts/import_bolashak.py path/to/vuzy_bolashak_2026_rus.pdf

Reads the table of the official PDF (needs PyMuPDF: pip install pymupdf) and writes
  lib/data/bolashak-institutions.json   one record per institution, nothing invented
  lib/data/bolashak-import-report.json  rows that need a human look (duplicates, bad URLs)

The records match the backend table `universities` (name, country, website_url); the extra fields
(Russian name, list number) keep the link to the source. Names, countries and URLs are copied from
the PDF; the only transformation is whitespace cleanup and translating the country name to English.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

import fitz  # PyMuPDF

COUNTRY_EN = {
    "Австралийский Союз (Австралия)": "Australia",
    "Австрия": "Austria",
    "Австрийская Республика": "Austria",
    "Королевство Бельгия": "Belgium",
    "Бразилия": "Brazil",
    "Федеративная Республика Бразилия": "Brazil",
    "Венгрия": "Hungary",
    "Соединенное Королевство Великобритании и Северной Ирландии": "United Kingdom",
    "Федеративная Республика Германия": "Germany",
    "Королевство Дания": "Denmark",
    "Республика Индия": "India",
    "Государство Израиль": "Israel",
    "Республика Ирландия": "Ireland",
    "Королевство Испания": "Spain",
    "Итальянская Республика": "Italy",
    "Канада": "Canada",
    "Китайская Народная Республика": "China",
    "Специальный административный район Гонконг": "Hong Kong SAR",
    "Нидерланды": "Netherlands",
    "Королевство Нидерланды": "Netherlands",
    "Новая Зеландия": "New Zealand",
    "Королевство Норвегия": "Norway",
    "Российская Федерация": "Russia",
    "Республика Сингапур": "Singapore",
    "Соединенные Штаты Америки": "United States",
    "Финляндская Республика": "Finland",
    "Французская Республика": "France",
    "Чешская Республика": "Czech Republic",
    "Швейцарская Конфедерация": "Switzerland",
    "Королевство Швеция": "Sweden",
    "Республика Корея": "South Korea",
    "Южно-Африканская Республика": "South Africa",
    "Государство Япония": "Japan",
    "Япония": "Japan",
    "Мексиканские Соединенные Штаты": "Mexico",
    "Объединенные Арабские Эмираты": "United Arab Emirates",
    "Объединенные Арабские Эмираты ": "United Arab Emirates",
    "Турецкая Республика": "Turkey",
    "Федерация Малайзия": "Malaysia",
    "Республика Польша": "Poland",
    "Республика Чили": "Chile",
}


def clean(text: str) -> str:
    text = re.sub(r"(\w)-\n", r"\1-", text or "")  # a hyphenated word wrapped at the end of a line
    return re.sub(r"\s+", " ", text.replace("\n", " ")).strip()


def english_name(name: str) -> str:
    """The Latin name inside the first parenthesis group that starts with a Latin letter."""
    depth, start = 0, None
    for i, ch in enumerate(name):
        if ch == "(":
            if depth == 0:
                start = i + 1
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0 and start is not None:
                inner = name[start:i].strip()
                if re.match(r"[A-Za-z\u00C0-\u024F]", inner):
                    return inner
                start = None
    m = re.search(r"([A-Z][A-Za-z\u00C0-\u024F&'’.\- ]+)$", name)  # no parentheses: trailing Latin run
    return m.group(1).strip() if m else ""


def russian_name(name: str, en: str) -> str:
    if en and f"({en})" in name:
        return name.replace(f"({en})", "").strip()
    return name.replace(en, "").strip() if en else name


def slug(text: str) -> str:
    ascii_text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", ascii_text.lower()).strip("-")


def main(pdf: str) -> None:
    rows = []
    for page in fitz.open(pdf):
        for table in page.find_tables():
            rows.extend(table.extract())

    merged = []
    for r in rows:
        cells = [clean(c or "") for c in r]
        if cells[0] in ("№", "") and not cells[1] and not cells[2]:
            continue
        if re.fullmatch(r"\d+\.", cells[0]):
            merged.append(cells)
        elif merged and cells[0] == "" and any(cells[1:]):
            for i in (1, 2, 3):  # a row split by a page break continues the previous one
                merged[-1][i] = clean(merged[-1][i] + " " + cells[i]) if i != 3 else merged[-1][i] + cells[i]

    out, report = [], {"duplicate_name": [], "duplicate_url": [], "unknown_country": [], "bad_url": [], "no_english_name": []}
    seen_name, seen_url = {}, {}
    for num, name, country_ru, url in merged:
        number = int(num.rstrip("."))
        url = re.sub(r"\s+", "", url)
        url = re.sub(r"^[^h]*(?=https?://)", "", url)  # stray characters in front of the URL
        if url and not url.startswith("http"):
            url = "https://" + url
        en = english_name(name)
        ru = russian_name(name, en)
        country = COUNTRY_EN.get(country_ru.strip())
        if country is None:
            report["unknown_country"].append({"no": number, "country": country_ru})
        if not en:
            report["no_english_name"].append({"no": number, "name": name})
        if not re.match(r"https?://[^/]+\.[^/]+", url or ""):
            report["bad_url"].append({"no": number, "url": url})
        key = (en.lower(), country)
        if key in seen_name:
            report["duplicate_name"].append({"no": number, "of": seen_name[key]})
            continue
        seen_name[key] = number
        host_path = re.sub(r"^https?://(www\.)?", "", url).rstrip("/").lower()
        if host_path in seen_url:
            report["duplicate_url"].append({"no": number, "also_used_by": seen_url[host_path]})
        else:
            seen_url[host_path] = number
        out.append({
            "id": f"bolashak-{number}-{slug(en or ru)}",
            "no": number,
            "name": en or ru,
            "nameRu": ru,
            "country": country or country_ru,
            "countryRu": country_ru,
            "websiteUrl": url or None,
        })

    base = Path(__file__).resolve().parent.parent / "lib" / "data"
    base.mkdir(parents=True, exist_ok=True)
    (base / "bolashak-institutions.json").write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    (base / "bolashak-import-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(out)} institutions written; report: " + ", ".join(f"{k}={len(v)}" for k, v in report.items()))


if __name__ == "__main__":
    main(sys.argv[1])
