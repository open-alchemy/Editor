"""Tests for spec controller."""

import pytest

import json


POST_TESTS = [
    pytest.param(
        "/v1/spec/validate-managed",
        "",
        {"X-LANGUAGE": "YAML"},
        {"result": {"valid": False, "reason": "specification must be a dictionary"}},
        id="/v1/spec/validate-managed",
    ),
    pytest.param(
        "/v1/spec/validate-un-managed",
        "",
        {"X-LANGUAGE": "YAML"},
        {"result": {"valid": False, "reason": "specification must be a dictionary"}},
        id="/v1/spec/validate-managed",
    ),
]


@pytest.mark.parametrize("path, data, headers, expected_result", POST_TESTS)
def test_validate(client, path, data, headers, expected_result):
    """
    GIVEN data and headers
    WHEN POST /v1/spec/validate is called with the language header and spec body
    THEN a 200 response with the expected result is returned.
    """

    respose = client.post(path, headers=headers, data=data)

    assert respose.status_code == 200
    assert json.loads(respose.data.decode()) == expected_result
