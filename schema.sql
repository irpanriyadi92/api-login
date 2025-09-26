-- Table: public.users

CREATE TABLE IF NOT EXISTS public.users
(
    userid character varying(20) NOT NULL,
    userpwd character varying(128) NOT NULL,
    usernm character varying(100),
    loginyn character(1) DEFAULT 'Y',
    usergroup character varying(10),
    levelgroup character varying(10),
    sysyn character(1),
    frompwd character varying(8),
    topwd character varying(8),
    fromsys character varying(8),
    tosys character varying(8),
    custcd character varying(20),
    orgid character varying(20),
    deptcd character varying(20),
    deptnm character varying(100),
    email character varying(100),
    emailcompany character varying(100),
    signature text,
    profilepicture text,
    phonenumber character varying(30),
    otpyn character(1),
    newyn character(1),
    faccd character varying(20),
    updateuser character varying(50),
    updatedt character varying(8),
    updatetm character varying(6),
    CONSTRAINT users_pkey PRIMARY KEY (userid)
);
