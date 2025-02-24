-- Create chat functions schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS chat_functions;

-- Create function to fetch chat history
CREATE OR REPLACE FUNCTION chat_functions.get_chat_history(p_user_id uuid)
RETURNS TABLE (
    id uuid,
    role text,
    content text,
    timestamp timestamptz
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ch.id,
        m->>'role' as role,
        m->>'content' as content,
        (m->>'timestamp')::timestamptz as timestamp
    FROM chat_history ch,
    jsonb_array_elements(ch.messages) as m
    WHERE ch.user_id = p_user_id
    ORDER BY (m->>'timestamp')::timestamptz ASC;
END;
$$;

-- Create function to add message to chat history
CREATE OR REPLACE FUNCTION chat_functions.add_chat_message(
    p_user_id uuid,
    p_role text,
    p_content text
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_chat_id uuid;
    v_message_id uuid;
BEGIN
    -- Generate new message ID
    v_message_id := gen_random_uuid();
    
    -- Try to update existing chat history first
    UPDATE chat_history
    SET messages = messages || jsonb_build_object(
        'id', v_message_id,
        'role', p_role,
        'content', p_content,
        'timestamp', now()
    )
    WHERE user_id = p_user_id
    RETURNING id INTO v_chat_id;
    
    -- If no existing chat history, create new one
    IF v_chat_id IS NULL THEN
        INSERT INTO chat_history (
            user_id,
            messages
        ) VALUES (
            p_user_id,
            jsonb_build_array(
                jsonb_build_object(
                    'id', v_message_id,
                    'role', p_role,
                    'content', p_content,
                    'timestamp', now()
                )
            )
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

-- Grant access to functions
GRANT USAGE ON SCHEMA chat_functions TO authenticated;
GRANT EXECUTE ON FUNCTION chat_functions.get_chat_history TO authenticated;
GRANT EXECUTE ON FUNCTION chat_functions.add_chat_message TO authenticated;
GRANT EXECUTE ON FUNCTION chat_functions.clear_chat_history TO authenticated;

-- Add RLS policies for function execution
CREATE POLICY "Users can execute functions on their own chat history"
    ON chat_history
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_history_messages_gin ON chat_history USING GIN (messages);

-- Add comments
COMMENT ON FUNCTION chat_functions.get_chat_history IS 'Retrieves chat history for a user';
COMMENT ON FUNCTION chat_functions.add_chat_message IS 'Adds a new message to user''s chat history';
COMMENT ON FUNCTION chat_functions.clear_chat_history IS 'Clears all chat history for a user';