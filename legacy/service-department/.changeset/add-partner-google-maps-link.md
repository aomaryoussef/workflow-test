---
"@partner/v1.2.0": minor
---

adds a google maps link support in the partner domain (branch).
To adjust to this change, the following SQL needs to be run in the environment

`ALTER TABLE public.partner_branch ADD google_maps_link varchar(255) null default '';`
