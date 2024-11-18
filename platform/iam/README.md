# Mylo IAM (Identity and Access Management)

## Getting Started

```
git clone git@github.com:btechlabs/ol-iam.git
docker compose up -d
```


## Ory

### Kratos

Related configuration:
- `deployment/ory-values/kratos-values.yml`
- `deployment/ory-dependancy-configs/conf/kratos`

### Oathkeeper

Related configuration:
- `deployment/ory-values/oathkeeper-values.yml`
- `deployment/ory-dependancy-configs/conf/oathkeeper`

### Keto

Related configuration:
- `deployment/ory-values/keto-values.yml`
- `deployment/ory-dependancy-configs/conf/keto`



When the system is deployed for the first time, only the `namespaces` defined in the `deployment/ory-dependancy-configs/conf/keto/namespaces.keto.ts` are created, nothing else is there. It's the administrators responsibility to create the rest of permissions logic.
The inial set of permissions are defined in the file `deployment/ory-dependancy-configs/conf/keto/initial-policy.json`, relations in that file should be imported into Keto, ex `keto relation-tuple create /home/ory/initial-policy.json --insecure-disable-transport-security`

Then to add a `back office employee`, you first create an `identity` in `Kratos` and use the provided `id` to make a request similar to this.

```
curl --location 'http://localhost:4434/admin/identities' \
--header 'Content-Type: application/json' \
--data-raw '{
    "schema_id": "email_schema_v0",
    "traits": {
        "email": "backoffice_employee@btech.com"
    },
    "credentials": {
        "password": {
            "config": {
                "password": "123456"
            }
        }
    },
    "verifiable_addresses": [
        {
            "value": "backoffice_employee@btech.com",
            "verified": true,
            "via": "email"
        }
    ]
}'
```

You'll get back the identity ID, use that in the following request

Add Employee to relationshipManagers Group

```
curl --location --request PUT 'http://localhost:4467/admin/relation-tuples' \
--header 'Content-Type: application/json' \
--data '{
    "namespace": "Group",
    "object": "relationshipManagers",
    "relation": "members",
    "subject_id": "9328ef91-b4ee-4c15-9a5c-b748e0d0b8d2"
}'
```