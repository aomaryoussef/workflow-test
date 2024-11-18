DO $$
BEGIN
    -- Check if the scenario column type is not VARCHAR(20), then alter it
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = '_services'
        AND table_name = 'requests' 
        AND column_name = 'scenario' 
        AND (data_type != 'character varying' OR character_maximum_length IS DISTINCT FROM 50)
    ) THEN
        ALTER TABLE _services.requests
        ALTER COLUMN scenario TYPE VARCHAR(50);
    END IF;

    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
		WHERE table_schema = '_services'
        AND table_name = 'scoring_output' 
        AND column_name = 'cwf' 
        AND data_type != 'double precision'
    ) THEN
        ALTER TABLE _services.scoring_output
        ALTER COLUMN cwf TYPE FLOAT;
    END IF;
END $$;