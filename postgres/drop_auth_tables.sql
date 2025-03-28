DELETE FROM accounts;
DELETE FROM sessions;
DELETE FROM profiles;
DELETE FROM users;
DELETE FROM verification_token;



DROP TABLE accounts;
DROP TABLE sessions;
DROP TABLE profiles;
DROP TABLE users;
DROP TABLE verification_token;



-- ALTER SEQUENCE accounts_id_seq RESTART WITH 1;
-- ALTER SEQUENCE sessions_id_seq RESTART WITH 1;
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;
