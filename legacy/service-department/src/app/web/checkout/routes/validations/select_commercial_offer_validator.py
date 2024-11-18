from pydantic import BaseModel


class SelectCommercialOfferValidator(BaseModel):
    selected_offer_id: str
