""" This module has the definition of the BankAccount entity
"""

from dataclasses import asdict, dataclass
from datetime import datetime
from enum import Enum
from uuid import UUID, uuid4

from src.utils.dict_factory import asdict_factory


class BankName(Enum):
  CIB = "CIB"
  NBE = "NBE"
  MISR = "MISR"
  BDC = "BDC"
  AAIB = "AAIB"
  FAIB = "FAIB"
  BOA = "BOA"
  ADIB = "ADIB"
  ADCB = "ADCB"
  ARAB = "ARAB"
  CAE = "CAE"
  HSBC = "HSBC"
  QNB = "QNB"
  SCB = "SCB"
  EGB = "EGB"
  HDB = "HDB"
  UB = "UB"
  EBE = "EBE"
  ABK = "ABK"
  AUB = "AUB"
  AGB = "AGB"
  AI = "AI"
  BBE = "BBE"
  ARIB = "ARIB"
  SC = "SC"
  EALB = "EALB"
  NBK = "NBK"
  ABC = "ABC"
  FAB = "FAB"
  MIDB = "MIDB"
  IDB = "IDB"
  MASH = "MASH"
  ENBD = "ENBD"
  SAIB = "SAIB"
  AIB = "AIB"
  ABRK = "ABRK"
  NBG = "NBG"
  NSB = "NSB"
  PDAC = "PDAC"
  POST = "POST"


@dataclass
class BankAccount:
    """Definition of the BankAccount entity"""

    id: UUID
    partner_id: UUID
    bank_name: BankName
    branch_name: str
    beneficiary_name: str
    iban: str
    swift_code: str
    account_number: str
    created_at: datetime = None
    updated_at: datetime = None

    def __init__(
        self,
        partner_id: UUID,
        bank_name: BankName,
        branch_name: str,
        beneficiary_name: str,
        iban: str,
        swift_code: str,
        account_number: str,
        id: UUID = None,
    ):
        self.id = uuid4() if id is None else id
        self.partner_id = partner_id
        self.bank_name = bank_name
        self.branch_name = branch_name
        self.beneficiary_name = beneficiary_name
        self.iban = iban
        self.swift_code = swift_code
        self.account_number = account_number
        self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def to_dict(self):
        result = asdict(self, dict_factory=asdict_factory)
        return result
