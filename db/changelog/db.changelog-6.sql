CREATE TABLE IF NOT EXISTS public."Resource"
(
    id integer NOT NULL DEFAULT nextval('"Resource_id_seq"'::regclass),
    uuid text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    sdescription text COLLATE pg_catalog."default" NOT NULL,
    mdescription text COLLATE pg_catalog."default" NOT NULL,
    "createDate" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createUser" text COLLATE pg_catalog."default" NOT NULL DEFAULT 'admin'::text,
    "updateDate" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateUser" text COLLATE pg_catalog."default" NOT NULL DEFAULT 'admin'::text,
    CONSTRAINT "Resource_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Resource"
    OWNER to postgres;