CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);
INSERT INTO blogs (author, url, title, likes) VALUES
('Dan Abramov', 'https://overreacted.io', 'Writing Resilient Components', 12),
('Martin Fowler', 'https://martinfowler.com', 'Microservices', 5);