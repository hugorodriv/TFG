CREATE EXTENSION IF NOT EXISTS citext;

-- Profiles
CREATE TABLE profiles (
    _id SERIAL PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    uuid UUID UNIQUE DEFAULT gen_random_uuid(),
    username citext UNIQUE NOT NULL,
    name VARCHAR(20) NOT NULL,
    bio VARCHAR(500),
    img_url VARCHAR(2048),
    CONSTRAINT username_length CHECK (length(username) <= 20)
);


-- Friendships
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

CREATE INDEX ON friendships (receiver_uuid, status);
CREATE INDEX ON friendships (sender_uuid, status);

CREATE FUNCTION are_friends(uuid1 UUID, uuid2 UUID) RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM friendships
        WHERE (
            (sender_uuid = uuid1 AND receiver_uuid = uuid2) OR
            (sender_uuid = uuid2 AND receiver_uuid = uuid1)
        ) AND status = 'ACCEPTED'
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;


CREATE OR REPLACE FUNCTION prevent_cross_friendship()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM friendships
    WHERE sender_uuid = NEW.receiver_uuid AND receiver_uuid = NEW.sender_uuid
  ) THEN
    RAISE EXCEPTION 'Friendship already exists in reverse';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_cross_friendship
BEFORE INSERT ON friendships
FOR EACH ROW
EXECUTE FUNCTION prevent_cross_friendship();

-- Posts
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TABLE posts (
    post_uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile UUID REFERENCES profiles(uuid),
    text VARCHAR(2048),
    resolved_location VARCHAR(300),
    created_at TIMESTAMP DEFAULT NOW(),
    location GEOMETRY(POINT, 4326),
    CONSTRAINT chk_location CHECK (ST_IsValid(location))
);

CREATE INDEX idx_posts_user_id ON posts(profile);
CREATE INDEX idx_posts_location ON posts USING GIST(location);

