SET check_function_bodies = false;
INSERT INTO connectors.connector (id, name, created_at, provider, config) VALUES ('eyJQcm92aWRlciI6IkdFTkVSSUMiLCJSZWZlcmVuY2UiOiJhN2RjYWM2Zi0xZWRjLTQ4MGYtYTBmNi04MmFkYzZjNmU1NzAifQ', 'mylo', '2024-09-02 13:05:32.147086+00', 'GENERIC', '\xc30d04090302380b482b239b47217cd28801b8206c7095feae6ba995c530ea0576159bfa82cc532dcd549aa102ce48128fb98eda80cdd53f1fc43c97cf1027e50332456296529ee425d4702d9214817a1a07bd6b8fded610bf3bf1f7aaab3140986b7ecf004e6034b16484cc3adbe2a2168bb3be6e4fbb44e17d8bfd7b9abd5ccd26aed57da4703bb55f7397c737926913bb433bbbaa7dc342');
INSERT INTO accounts.account (id,created_at,reference,"type",raw_data,default_currency,account_name,connector_id,metadata) VALUES ('eyJDb25uZWN0b3JJRCI6eyJQcm92aWRlciI6IkdFTkVSSUMiLCJSZWZlcmVuY2UiOiJhN2RjYWM2Zi0xZWRjLTQ4MGYtYTBmNi04MmFkYzZjNmU1NzAifSwiUmVmZXJlbmNlIjoiV09STEQifQ','2023-01-01 02:00:00+02','WORLD','INTERNAL'::public.account_type,'{"reference":"WORLD","connectorID":"eyJQcm92aWRlciI6IkdFTkVSSUMiLCJSZWZlcmVuY2UiOiJhN2RjYWM2Zi0xZWRjLTQ4MGYtYTBmNi04MmFkYzZjNmU1NzAifQ","createdAt":"2023-01-01T00:00:00Z","defaultAsset":"EGP/2","accountName":"World","type":"INTERNAL","metadata":{"description":"World Account"}}','EGP/2','World','eyJQcm92aWRlciI6IkdFTkVSSUMiLCJSZWZlcmVuY2UiOiJhN2RjYWM2Zi0xZWRjLTQ4MGYtYTBmNi04MmFkYzZjNmU1NzAifQ','{"description": "World Account"}');