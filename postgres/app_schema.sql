CREATE TABLE profiles (
  _id SERIAL PRIMARY KEY NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  uuid UUID UNIQUE DEFAULT gen_random_uuid(),
  username VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(20) NOT NULL,
  bio VARCHAR(500),
  img_url VARCHAR(2048)
);


CREATE TYPE friendship_status AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');
CREATE TABLE friendships (
    sender_id UUID NOT NULL,
    receiver_id UUID NOT NULL,
    status friendship_status NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (sender_id, receiver_id),
    FOREIGN KEY (sender_id) REFERENCES profiles(uuid) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES profiles(uuid) ON DELETE CASCADE
);
