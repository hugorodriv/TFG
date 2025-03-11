DELETE FROM accounts;
DELETE FROM sessions;
DELETE FROM users;
DELETE FROM verification_token;

ALTER SEQUENCE accounts_id_seq RESTART WITH 1;
ALTER SEQUENCE sessions_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
