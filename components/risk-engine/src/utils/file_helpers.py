from pathlib import Path


def get_project_root() -> Path:
    """Returns the root directory of the project."""
    return Path(__file__).resolve().parent.parent.parent


def get_file_path(relative_path: str) -> Path:
    """
    Returns the absolute path to a file given its relative path from the project root.

    Args:
        relative_path (str): The relative path from the project root to the file.

    Returns:
        Path: The absolute path to the file.
    """
    project_root = get_project_root()
    return project_root / relative_path
