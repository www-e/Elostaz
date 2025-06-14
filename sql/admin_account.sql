-- Create admin user in auth.users
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
)
VALUES (
    '4dba45ee-33a6-41cd-b0da-af7c1f7d9870',
    '00000000-0000-0000-0000-000000000000',
    'admin@alostaz.edu',
    crypt('admin123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"username":"adminedu"}',
    false,
    'authenticated'
)
ON CONFLICT (id) DO UPDATE
SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    updated_at = EXCLUDED.updated_at,
    raw_app_meta_data = EXCLUDED.raw_app_meta_data,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- Create admin identity
INSERT INTO auth.identities (
    provider_id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
)
VALUES (
    'admin@alostaz.edu',  -- Added missing provider_id
    '4dba45ee-33a6-41cd-b0da-af7c1f7d9870',
    '{"sub":"4dba45ee-33a6-41cd-b0da-af7c1f7d9870","email":"admin@alostaz.edu"}',
    'email',
    now(),
    now(),
    now()
)
ON CONFLICT (provider_id, provider) DO UPDATE
SET
    identity_data = EXCLUDED.identity_data,
    last_sign_in_at = EXCLUDED.last_sign_in_at,
    updated_at = EXCLUDED.updated_at;