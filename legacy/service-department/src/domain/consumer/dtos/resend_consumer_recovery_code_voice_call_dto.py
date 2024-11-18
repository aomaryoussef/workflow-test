from dataclasses import asdict, dataclass


@dataclass
class ResendConsumerRecoveryCodeVoiceCallOutputDto:
    identity_id: str
    flow_id: str

    def to_dict(self):
        return asdict(self)
