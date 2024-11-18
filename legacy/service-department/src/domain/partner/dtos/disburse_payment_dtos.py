from dataclasses import dataclass
from uuid import UUID


@dataclass(frozen=True)
class DisbursePaymentOutputDto:
    workflow_id: UUID

    def to_dict(self):
        return {"workflow_id": str(self.workflow_id)}
