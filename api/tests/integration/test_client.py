"""Tests for spec controller."""

import json
from urllib import parse

import pytest
from library import config

OPTIONS_TESTS = [
    pytest.param("/v1/spec/validate-managed", id="/v1/spec/validate-managed"),
    pytest.param("/v1/spec/validate-un-managed", id="/v1/spec/validate-un-managed"),
    pytest.param("/v1/artifact/calculate", id="/v1/artifact/calculate"),
]


@pytest.mark.parametrize("path", OPTIONS_TESTS)
def test_endpoint_options(client, path):
    """
    GIVEN path
    WHEN OPTIONS {path} is called with the CORS POST Method and X-LANGUAGE Headers
    THEN Access-Control-Allow-Headers is returned with x-language.
    """
    respose = client.options(
        path,
        headers={
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "x-language",
        },
    )

    assert "Access-Control-Allow-Headers" in respose.headers
    assert (
        respose.headers["Access-Control-Allow-Headers"]
        == config.get_env().access_control_allow_headers
    )


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
        id="/v1/spec/validate-un-managed",
    ),
    pytest.param(
        "/v1/artifact/calculate",
        "",
        {"X-LANGUAGE": "YAML"},
        {},
        id="/v1/artifact/calculate",
    ),
]


@pytest.mark.parametrize("path, data, headers, expected_result", POST_TESTS)
def test_endpoint_post(client, path, data, headers, expected_result):
    """
    GIVEN path, data and headers
    WHEN POST {path} is called with the language header and spec body
    THEN a 200 response with the expected result is returned.
    """
    respose = client.post(path, headers=headers, data=data)

    assert respose.status_code == 200
    assert json.loads(respose.data.decode()) == expected_result
    assert "Access-Control-Allow-Origin" in respose.headers
    assert (
        respose.headers["Access-Control-Allow-Origin"]
        == config.get_env().access_control_allow_origin
    )


def test_seed_get(client, default_seed):
    """
    GIVEN default seed is set
    WHEN GET /v1/seed is called
    THEN the default seed is returned.
    """
    _, value = default_seed

    respose = client.get("/v1/seed")

    assert respose.status_code == 200
    assert respose.data.decode() == value
    assert "Access-Control-Allow-Origin" in respose.headers
    assert (
        respose.headers["Access-Control-Allow-Origin"]
        == config.get_env().access_control_allow_origin
    )


def test_seeds_get(client, single_seed):
    """
    GIVEN single seed is set
    WHEN GET /v1/seeds is called
    THEN defined seed names are returned.
    """
    name, _ = single_seed

    respose = client.get("/v1/seeds")

    assert respose.status_code == 200
    assert json.loads(respose.data.decode()) == [{"name": name, "path": name}]
    assert "Access-Control-Allow-Origin" in respose.headers
    assert (
        respose.headers["Access-Control-Allow-Origin"]
        == config.get_env().access_control_allow_origin
    )


def test_seeds_seed_path_get(client, single_seed):
    """
    GIVEN single seed is set
    WHEN GET /v1/seeds/{seed_path} is called
    THEN the seed value is returned.
    """
    name, value = single_seed

    respose = client.get(f"/v1/seeds/{name}")

    assert respose.status_code == 200
    assert respose.data.decode() == value


def test_seeds_seed_path_get_nested(client, single_nested_seed):
    """
    GIVEN single seed is set
    WHEN GET /v1/seeds/{seed_path} is called
    THEN the seed value is returned.
    """
    name, value = single_nested_seed

    respose = client.get(f"/v1/seeds/{parse.quote_plus(name)}")

    assert respose.status_code == 200
    assert respose.data.decode() == value
