generate-docs:
	pdoc --html src --output-dir docs --force

unit-testing:
	pytest

unit-testing-coverage:
	pytest --cov --cov-report=html

unit-testing-fail-coverage:
	pytest -v -s --cov --cov-fail-under=100 --cov-report=html

deploy:
	helm upgrade --install --create-namespace --timeout 0s   --insecure-skip-tls-verify --dependency-update -n default ol-service-department deployment-old/helm

run-gh-wf-pr:
	act pull_request -s GITHUB_TOKEN="$(gh auth token)" --container-architecture linux/amd64 --platform ubuntu-latest=lucasalt/act_base:latest

run-gh-wf-manual:
	act workflow_dispatch -s GITHUB_TOKEN="$(gh auth token)" --container-architecture linux/amd64 --platform ubuntu-latest=lucasalt/act_base:latest