from app.repositories.universities import UniversityRepository


def test_add_and_list_universities(conn):
    repo = UniversityRepository(conn)
    first = repo.add("Example University", "Kazakhstan", "https://example.edu")
    second = repo.add("Northfield Institute", "United States")

    assert first.id != second.id
    assert [u.name for u in repo.list_all()] == ["Example University", "Northfield Institute"]
    assert second.website_url is None


def test_rollback_left_no_data_from_the_previous_test(conn):
    # The previous test inserted rows; the fixture rolled them back.
    assert UniversityRepository(conn).list_all() == []
