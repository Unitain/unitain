-- Create type for message roles
DO $$ BEGIN
    CREATE TYPE message_role AS ENUM ('user', 'assistant');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    messages jsonb NOT NULL DEFAULT '[]'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT messages_valid CHECK (jsonb_typeof(messages) = 'array'),
    CONSTRAINT messages_not_empty CHECK (jsonb_array_length(messages) > 0)
);

-- Create indexes for better performance
CREATE INDEX idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at DESC);

-- Enable RLS
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own chat history"
    ON chat_history
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own chat history"
    ON chat_history
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_chat_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_chat_history_timestamp
    BEFORE UPDATE ON chat_history
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_history_updated_at();

-- Add validation function for message structure
CREATE OR REPLACE FUNCTION validate_chat_messages()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure each message in the array has required fields
    IF NOT (
        SELECT bool_and(
            (value->>'id') IS NOT NULL AND
            (value->>'role') IS NOT NULL AND
            (value->>'content') IS NOT NULL AND
            (value->>'timestamp') IS NOT NULL AND
            (value->>'role') IN ('user', 'assistant')
        )
        FROM jsonb_array_elements(NEW.messages)
    ) THEN
        RAISE EXCEPTION 'Invalid message structure. Each message must have id, role, content, and timestamp fields.';
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER validate_chat_messages_trigger
    BEFORE INSERT OR UPDATE ON chat_history
    FOR EACH ROW
    EXECUTE FUNCTION validate_chat_messages();

-- Add comments
COMMENT ON TABLE chat_history IS 'Stores chat messages between users and AI assistant';
COMMENT ON COLUMN chat_history.messages IS 'Array of chat messages with structure {id, role, content, timestamp}';