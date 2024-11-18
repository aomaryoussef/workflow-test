package http_client

// Comment from Sid:
// This test always needs internet connection.
// Must be replaced with something like a WireMock
// Commented this on flight ;)

//func TestCustomHttpClient_GetWithoutBody_NoErrors(t *testing.T) {
//	err := logging.InitLogger("DEBUG", "TEST", "UNIT_TEST")
//	assert.Nil(t, err)
//	req, err := http.NewRequest(http.MethodGet, "https://www.httpbin.org/get", nil)
//	assert.Nil(t, err)
//	client := GetCustomHttpClient(req.Context())
//	resp, err := client.Do(req)
//	assert.Nil(t, err)
//	assert.NotNil(t, resp)
//}
//
//func TestCustomHttpClient_PostWithJSONBody_NoErrors(t *testing.T) {
//	err := logging.InitLogger("DEBUG", "TEST", "UNIT_TEST")
//	assert.Nil(t, err)
//	buf, err := json.Marshal(`{ "TEST": true }`)
//	assert.Nil(t, err)
//	body := bytes.NewReader(buf)
//	req, err := http.NewRequest(http.MethodPost, "https://www.httpbin.org/post", body)
//	assert.Nil(t, err)
//	client := GetCustomHttpClient(req.Context())
//	resp, err := client.Do(req)
//	assert.Nil(t, err)
//	assert.NotNil(t, resp)
//}
