# tests/integration/test_score_api.py
import pytest


@pytest.fixture
def valid_input_data():
    """Fixture to provide valid input data."""
    return {
        "booking_time": "2023-01-01T00:00:00",
        "scenario": "SCORING",
        "data": {
            "address_area": "Sidi Gaber",
            "address_city": "Sidi Gaber",
            "address_governorate": "Alexandria",
            "children_count": 2,
            "client_id": "9a16b606-a29c-4472-92a1-ce8627a1401e",
            "contract_date": "2019-02-06T00:00:00",
            "flag_is_mc_customer": 1,
            "house_type": "owner",
            "insurance_type": "ios",
            "job_name_map": "healthcare",
            "job_type": "prime-entities",
            "marital_status": "married",
            "mobile_os_type": "ios",
            "net_burden": 0,
            "net_income": 34500,
            "phone_number_1": "01000000000",
            "phone_number_2": "01000000000",
            "ssn": "12345678912345",
        },
    }


def test_get_score_success(client, valid_input_data):
    """
    Test the /score endpoint with valid input data.
    """

    response = client.post("/score", json=valid_input_data)
    assert response.status_code == 200
    print("response:", response.json())
    response_data = response.json()
    assert "score" in response_data
    assert isinstance(response_data["score"], int)
    assert response_data["user_id"] == "12345"


def test_get_score_invalid_data(client):
    """
    Test the /score endpoint with invalid input data.
    """
    input_data = {
        "user_id": "12345"
        # Missing other required fields
    }

    response = client.post("/score", json=input_data)
    assert response.status_code == 422
    response_data = response.json()
    assert response_data["error_code"] == "validation_error"
