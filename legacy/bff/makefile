deploy-dev:
	helm upgrade --install --create-namespace --timeout 0s   --insecure-skip-tls-verify --dependency-update -n default ol-bff deployment-old/helm

deploy-stg:
	helm upgrade --install --create-namespace --timeout 0s   --insecure-skip-tls-verify --dependency-update -n default ol-bff deployment/stg/helm

run-gh-wf-pr:
	act pull_request -s GITHUB_TOKEN="$(gh auth token)" --container-architecture linux/amd64