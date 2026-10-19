"""Helpers that apply the plain SQL migrations (dbmate file format) in tests."""
from pathlib import Path
from typing import List, Tuple

import psycopg

MIGRATIONS_DIR = Path(__file__).resolve().parents[2] / "src" / "backend" / "db" / "migrations"
UP = "-- migrate:up"
DOWN = "-- migrate:down"


def load_migrations() -> List[Tuple[str, str, str]]:
    """Return (name, up_sql, down_sql) for every migration file, oldest first."""
    result = []
    for path in sorted(MIGRATIONS_DIR.glob("*.sql")):
        text = path.read_text(encoding="utf-8")
        assert UP in text and DOWN in text, "%s needs both '%s' and '%s'" % (path.name, UP, DOWN)
        up = text.split(UP, 1)[1].split(DOWN, 1)[0]
        down = text.split(DOWN, 1)[1]
        result.append((path.name, up, down))
    return result


def migrate_up(conn: psycopg.Connection) -> None:
    for _, up, _ in load_migrations():
        conn.execute(up)


def migrate_down(conn: psycopg.Connection) -> None:
    for _, _, down in reversed(load_migrations()):
        conn.execute(down)
