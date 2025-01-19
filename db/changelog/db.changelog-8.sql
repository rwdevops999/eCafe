CREATE SEQUENCE IF NOT EXISTS public."Resource_id_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public."Resource_id_seq"
    OWNED BY public."Resource".id;

ALTER SEQUENCE public."Resource_id_seq"
    OWNER TO postgres;