"""Import the Bolashak 2026 list of priority specialities for academic study.

Usage:  python3 scripts/import_bolashak_specialities.py "path/to/1.1. Список ППС рус.pdf"

Writes (needs PyMuPDF: pip install pymupdf)
  lib/data/bolashak-specialities.json             light list: code, group, Russian name, levels, examples
  lib/data/bolashak-specialities-programmes.json  English programme names per speciality (loaded on the detail page only)

Everything is copied from the PDF. The list says which programme names count as an equivalent of a speciality,
not which university teaches them, so no university link is made here.
"""
import json
import re
import sys
from pathlib import Path

import fitz  # PyMuPDF

GROUP_EN = {
    1: "Engineering and technology",
    2: "Natural sciences",
    3: "Medicine and health",
    4: "Social sciences and humanities",
    5: "Education",
    6: "Creative industries",
}
LEVEL = {"Бакалавриат": "bachelor", "Магистратура": "master", "Докторантура": "phd", "Резидентура": "residency"}


def clean(text):
    text = re.sub(r"(\w)-\n", r"\1-", text or "")
    return re.sub(r"\s+", " ", text.replace("\n", " ")).strip()


def main(pdf):
    rows = []
    for page in fitz.open(pdf):
        for table in page.find_tables():
            rows.extend(table.extract())

    items = []
    for r in rows:
        cells = [(c or "") for c in r]
        if len(cells) < 6:
            continue
        if re.fullmatch(r"\d+", cells[0].strip()) and cells[2].strip():
            items.append({"no": int(cells[0]), "nameRu": clean(cells[2]), "eq": clean(cells[3]), "levels": cells[4], "codes": cells[5]})
        elif cells[0].strip() == "" and any(c.strip() for c in cells[2:]) and items:
            # a row split by a page break continues the previous one in any of its cells
            cur = items[-1]
            cur["nameRu"] = clean(cur["nameRu"] + " " + cells[2]) if cells[2].strip() else cur["nameRu"]
            cur["eq"] = clean(cur["eq"] + " " + cells[3]) if cells[3].strip() else cur["eq"]
            cur["levels"] = (cur["levels"] + "\n" + cells[4]).strip() if cells[4].strip() else cur["levels"]
            cur["codes"] = (cur["codes"] + "\n" + cells[5]).strip() if cells[5].strip() else cur["codes"]

    # The table loses the level and code cells of a few rows (page break), so the codes are also read from the text.
    # They appear once per speciality, in the same order as the rows.
    text = " ".join(page.get_text() for page in fitz.open(pdf))
    found = re.findall(r"\b(\d{1,2})\.(\d{1,2}) ([БМДР])\b", text)
    order, by_code = [], {}
    for a, b, lv in found:
        key = f"{a}.{b}"
        if key not in by_code:
            order.append(key)
            by_code[key] = []
        if lv not in by_code[key]:
            by_code[key].append(lv)
    assert len(order) == len(items), (len(order), len(items))
    LV = {"Б": "bachelor", "М": "master", "Д": "phd", "Р": "residency"}

    light, programmes = [], {}
    for it, code in zip(items, order):
        base = re.match(r"(\d+)\.(\d+)", code)
        levels_codes = [(LV[lv], f"{code} {lv}") for lv in sorted(by_code[code], key=lambda x: "БМДР".index(x))]
        levels = [a for a, _ in levels_codes]
        codes = [b for _, b in levels_codes]
        names, seen = [], set()
        for n in (x.strip() for x in it["eq"].split(";")):
            key = re.sub(r"\s+", " ", n.lower())
            if n and key not in seen:
                seen.add(key)
                names.append(n)
        light.append({
            "id": code.replace(".", "-"),
            "no": it["no"],
            "code": code,
            "group": GROUP_EN[int(base.group(1))],
            "groupNo": int(base.group(1)),
            "nameRu": it["nameRu"],
            "levels": [{"level": lv, "code": cd} for lv, cd in zip(levels, codes)],
            "programmeCount": len(names),
            "examples": names[:3],
        })
        programmes[code.replace(".", "-")] = names

    base_dir = Path(__file__).resolve().parent.parent / "lib" / "data"
    (base_dir / "bolashak-specialities.json").write_text(json.dumps(light, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    (base_dir / "bolashak-specialities-programmes.json").write_text(json.dumps(programmes, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(light)} specialities, {sum(len(v) for v in programmes.values())} programme names")


if __name__ == "__main__":
    main(sys.argv[1])
