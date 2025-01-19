CREATE SEQUENCE IF NOT EXISTS public."Service_id_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public."Service_id_seq"
    OWNED BY public."Service".id;

ALTER SEQUENCE public."Service_id_seq"
    OWNER TO postgres;
    