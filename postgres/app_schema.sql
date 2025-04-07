CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE profiles (
    _id SERIAL PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    uuid UUID UNIQUE DEFAULT gen_random_uuid(),
    username citext UNIQUE NOT NULL,
    name VARCHAR(20) NOT NULL,
    bio VARCHAR(500),
    img_url VARCHAR(2048),
    CONSTRAINT username_length CHECK (length(username) <= 20)
);


CREATE TYPE friendship_status AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

CREATE TABLE friendships (
    sender_uuid UUID NOT NULL,
    receiver_uuid UUID NOT NULL,
    status friendship_status NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (sender_uuid, receiver_uuid),
    FOREIGN KEY (sender_uuid) REFERENCES profiles(uuid) ON DELETE CASCADE,
    FOREIGN KEY (receiver_uuid) REFERENCES profiles(uuid) ON DELETE CASCADE
);

CREATE INDEX ON friendships (receiver_id, status);
CREATE INDEX ON friendships (sender_id, status);
