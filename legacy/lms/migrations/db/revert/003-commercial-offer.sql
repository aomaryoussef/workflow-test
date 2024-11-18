-- Revert lms-lite:003-commercial-offer from pg

BEGIN;

DROP TABLE public.commercial_offer;

COMMIT;
