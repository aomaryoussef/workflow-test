# tests/integration/test_score_api.py
def test_list_models(client):
    """
    Test the /score endpoint with valid input data.
    """
    response = client.get("/models")
    assert response.status_code == 200
    response_data = response.json()
    assert "score" in response_data
    assert isinstance(response_data["score"], int)
    assert response_data["user_id"] == "12345"
