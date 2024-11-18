from src.config.postgresql import SessionLocal
from typing import List, Type
from sqlalchemy.orm import Session


class BaseRepositoryService:
    """
    A base service class for initializing and managing database sessions and repositories.

    This class provides a foundation for other service classes that require access to
    multiple repositories and a database session. It initializes the session and the
    specified repositories, ensuring they are ready for use, if session is not provided.

    Attributes:
        session (Session): The SQLAlchemy session for database operations.
        repositories (List[Type]): A list of repository classes to be initialized.

    Methods:
        _initialize_session(): Initializes the database session if not provided.
        _initialize_repositories(): Initializes and sets repository instances as attributes.
    """

    def __init__(self, session: Session = None, repositories: List[Type] = None):
        """
        Initializes the BaseRepositoryService with the given session and repositories.

        Args:
            session (Session, optional): An existing SQLAlchemy session. Defaults to None.
            repositories (List[Type], optional): A list of repository classes to be initialized. Defaults to None.
        """
        self.session = session
        self.repositories = repositories or []
        self._session_created_here = False  # Track if the session was created by this service
        self._initialize_session()
        self._initialize_repositories()

    def _initialize_session(self):
        """
        Initializes the database session if not provided.

        This method checks if the session attribute is None. If it is, it initializes a new
        session using `SessionLocal()` (or another session factory) if necessary.
        """
        if self.session is None:
            self.session = SessionLocal()
            self._session_created_here = True

    def _initialize_repositories(self):
        """
        Initializes and sets repository instances as attributes.

        This method iterates over the list of repository classes, initializes each
        repository with the current session, and sets it as an attribute on the instance
        with a name derived from the repository class name.
        """
        for repository in self.repositories:
            repo_name = repository.__name__.replace("Repository", "").lower() + "_repository"
            setattr(self, repo_name, repository(self.session))

    def __del__(self):
        """Ensure the session is closed if it was created by this service."""
        if self._session_created_here and self.session:
            self.session.close()
