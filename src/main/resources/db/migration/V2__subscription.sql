CREATE TABLE user_subscription (
    id                      BIGSERIAL PRIMARY KEY,
    clerk_user_id           VARCHAR(255) NOT NULL UNIQUE,
    stripe_customer_id      VARCHAR(255),
    stripe_subscription_id  VARCHAR(255),
    plan                    VARCHAR(50)  NOT NULL DEFAULT 'FREE',
    analyses_used           INTEGER      NOT NULL DEFAULT 0,
    created_at              TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP    NOT NULL DEFAULT NOW()
);
