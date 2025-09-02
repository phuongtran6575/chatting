from uuid import UUID

def to_uuid(val: str | UUID) -> UUID:
    """Convert string or UUID to UUID object."""
    if isinstance(val, UUID):
        return val
    return UUID(val)  #