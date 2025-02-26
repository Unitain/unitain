-- Create chat functions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS chat_functions;

-- Create type for message roles if it doesn't exist
DO $$ BEGIN
    CREATE TYPE message_role AS ENUM ('user', 'assistant');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create chat_history table with timezone support
CREATE TABLE IF NOT EXISTS chat_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    messages jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    user_timezone text DEFAULT 'UTC',
    CONSTRAINT messages_valid CHECK (jsonb_typeof(messages) = 'array'),
    CONSTRAINT messages_not_empty CHECK (jsonb_array_length(messages) > 0)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_created_at ON chat_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_history_messages_gin ON chat_history USING GIN (messages);

-- Enable RLS
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Create function to get chat history with timezone support
CREATE OR REPLACE FUNCTION chat_functions.get_chat_history(
    p_user_id uuid,
    p_timezone text DEFAULT 'UTC'
) RETURNS TABLE (
    id uuid,
    role text,
    content text,
    timestamp timestamptz
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    -- Update user's timezone preference
    UPDATE chat_history
    SET user_timezone = p_timezone
    WHERE user_id = p_user_id;

    RETURN QUERY
    SELECT 
        (m->>'id')::uuid,
        m->>'role',
        m->>'content',
        (m->>'timestamp')::timestamptz AT TIME ZONE COALESCE(p_timezone, 'UTC')
    FROM chat_history ch,
    jsonb_array_elements(ch.messages) as m
    WHERE ch.user_id = p_user_id
    ORDER BY (m->>'timestamp')::timestamptz ASC;
END;
$$;

-- Create function to add message with timezone support
CREATE OR REPLACE FUNCTION chat_functions.add_chat_message(
    p_user_id uuid,
    p_role text,
    p_content text,
    p_timezone text DEFAULT 'UTC'
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_chat_id uuid;
    v_message_id uuid;
BEGIN
    -- Generate new message ID
    v_message_id := gen_random_uuid();
    
    -- Try to update existing chat history first
    UPDATE chat_history
    SET 
        messages = messages || jsonb_build_object(
            'id', v_message_id,
            'role', p_role,
            'content', p_content,
            'timestamp', now() AT TIME ZONE COALESCE(p_timezone, 'UTC')
        ),
        user_timezone = p_timezone
    WHERE user_id = p_user_id
    RETURNING id INTO v_chat_id;
    
    -- If no existing chat history, create new one
    IF v_chat_id IS NULL THEN
        INSERT INTO chat_history (
            user_id,
            messages,
            user_timezone
        ) VALUES (
            p_user_id,
            jsonb_build_array(
                jsonb_build_object(
                    'id', v_message_id,
                    'role', p_role,
                    'content', p_content,
                    'timestamp', now() AT TIME ZONE COALESCE(p_timezone, 'UTC')
                )
            ),
            p_timezone
        )
        RETURNING id INTO v_chat_id;
    END IF;
    
    RETURN v_chat_id;
END;
$$;

-- Create function to clear chat history
CREATE OR REPLACE FUNCTION chat_functions.clear_chat_history(p_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM chat_history
    WHERE user_id = p_user_id;
END;
$$;

-- Create RLS policies
CREATE POLICY "Users can manage their own chat history"
    ON chat_history
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Grant access to functions
GRANT USAGE ON SCHEMA chat_functions TO authenticated;
GRANT EXECUTE ON FUNCTION chat_functions.get_chat_history TO authenticated;
GRANT EXECUTE ON FUNCTION chat_functions.add_chat_message TO authenticated;
GRANT EXECUTE ON FUNCTION chat_functions.clear_chat_history TO authenticated;

-- Add comments
COMMENT ON TABLE chat_history IS 'Stores chat messages with timezone support';
COMMENT ON COLUMN chat_history.user_timezone IS 'User''s preferred timezone';
COMMENT ON FUNCTION chat_functions.get_chat_history IS 'Retrieves chat history with timezone support';
COMMENT ON FUNCTION chat_functions.add_chat_message IS 'Adds a message with timezone support';
COMMENT ON FUNCTION chat_functions.clear_chat_history IS 'Clears chat history';