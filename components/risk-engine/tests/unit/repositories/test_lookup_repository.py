import pytest
from uuid import uuid4
from src.models.lookup import Lookup, LookupType
from src.repositories.lookup_repository import LookupRepository
from sqlalchemy.exc import SQLAlchemyError


@pytest.fixture(scope="function")
def lookup_repository(db_session):
    """Fixture to create a new LookupRepository for each test."""
    return LookupRepository(session=db_session)


def test_get_by_id_not_found(lookup_repository: LookupRepository):
    """Test handling when a lookup is not found by ID."""
    non_existent_id = uuid4()

    fetched_lookup = lookup_repository.get_by_id(non_existent_id)

    assert fetched_lookup is None


def test_get_by_id_sqlalchemy_error(lookup_repository: LookupRepository, monkeypatch):
    """Test handling of SQLAlchemyError when retrieving a lookup by ID."""
    new_lookup_id = uuid4()

    # Mock session.query.filter.first to raise SQLAlchemyError
    def mock_first(*args, **kwargs):
        raise SQLAlchemyError("Mock SQLAlchemy error")

    monkeypatch.setattr(lookup_repository.session.query(Lookup).filter(Lookup.id == new_lookup_id), "first", mock_first)

    fetched_lookup = lookup_repository.get_by_id(new_lookup_id)

    assert fetched_lookup is None


def test_get_by_lookup_type_success(lookup_repository: LookupRepository):
    """Test retrieving all lookups by type successfully."""
    lookup_type = LookupType.job_name_map

    new_lookup_1 = Lookup(
        id=uuid4(),
        lookup_type=lookup_type,
        slug="test-slug-1",
        name="Test Name 1",
        description="Test Description 1"
    )
    new_lookup_2 = Lookup(
        id=uuid4(),
        lookup_type=lookup_type,
        slug="test-slug-2",
        name="Test Name 2",
        description="Test Description 2"
    )

    # Create the lookups first
    lookup_repository.session.add(new_lookup_1)
    lookup_repository.session.add(new_lookup_2)
    lookup_repository.session.commit()

    # Fetch the lookups by type
    fetched_lookups = lookup_repository.get_by_lookup_type(lookup_type.value)

    assert fetched_lookups[0].lookup_type == lookup_type
    assert fetched_lookups[1].lookup_type == lookup_type


def test_get_by_lookup_type_sqlalchemy_error(lookup_repository: LookupRepository, monkeypatch):
    """Test handling of SQLAlchemyError when retrieving lookups by type."""
    lookup_type = LookupType.scenario

    # Mock session.query.filter.all to raise SQLAlchemyError
    def mock_all(*args, **kwargs):
        raise SQLAlchemyError("Mock SQLAlchemy error")

    monkeypatch.setattr(lookup_repository.session.query(Lookup).filter(Lookup.lookup_type == lookup_type), "all",
                        mock_all)

    fetched_lookups = lookup_repository.get_by_lookup_type(lookup_type.value)

    assert len(fetched_lookups) == 2


def test_get_by_id_success(lookup_repository: LookupRepository):
    """Test retrieving a lookup by its ID successfully."""
    new_lookup = Lookup(
        id=uuid4(),
        lookup_type=LookupType.job_name_map,
        slug="test-slug",
        name="Test Name",
        description="Test Description"
    )

    # Create the lookup first
    lookup_repository.session.add(new_lookup)
    lookup_repository.session.commit()

    # Fetch the lookup by ID
    fetched_lookup = lookup_repository.get_by_id(new_lookup.id)

    assert fetched_lookup is not None
    assert fetched_lookup.id == new_lookup.id
    assert fetched_lookup.lookup_type.value == LookupType.job_name_map.value
    assert fetched_lookup.slug == "test-slug"
    assert fetched_lookup.name == "Test Name"
    assert fetched_lookup.description == "Test Description"
