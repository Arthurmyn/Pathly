from typing import List, Optional

import psycopg
from pydantic import BaseModel


class University(BaseModel):
    id: int
    name: str
    country: str
    website_url: Optional[str] = None


class UniversityRepository:
    """Plain SQL access to the universities table; returns typed models, no ORM."""

    def __init__(self, conn: psycopg.Connection) -> None:
        self._conn = conn

    def add(self, name: str, country: str, website_url: Optional[str] = None) -> University:
        row = self._conn.execute(
            "INSERT INTO universities (name, country, website_url) VALUES (%s, %s, %s) "
            "RETURNING id, name, country, website_url",
            (name, country, website_url),
        ).fetchone()
        return University(**row)

    def list_all(self) -> List[University]:
        rows = self._conn.execute(
            "SELECT id, name, country, website_url FROM universities ORDER BY name, country"
        ).fetchall()
        return [University(**row) for row in rows]
