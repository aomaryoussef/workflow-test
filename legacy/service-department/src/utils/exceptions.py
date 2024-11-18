class ConflictException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)


class NotFoundException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)


class ResourceNotCreatedException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)


class ResourceNotUpdatedException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)


class FailedToProcessRequestException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)


class ServiceUnAvailableException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)
