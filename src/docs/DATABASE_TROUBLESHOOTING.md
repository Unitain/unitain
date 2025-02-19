# Database Connection Troubleshooting Guide

## Error Details

### Error Message
```
Database connection not configured. Your responses cannot be saved at this time.
```

### When It Occurs
This error appears when:
- Submitting the eligibility check form
- The application cannot establish a connection to the Supabase database
- The required environment variables are missing or invalid

## System Configuration

### Database Type
- Supabase (PostgreSQL)
- Version: Latest
- Hosting: Supabase Cloud Platform

### Server Details
- Frontend: Vite + React
- Backend: Supabase Edge Functions
- Authentication: Supabase Auth

## Recent System Changes
1. Implementation of eligibility checker feature
2. Addition of Supabase client initialization
3. Integration of user authentication
4. Implementation of database error handling

## Current Database Connection Settings
The application expects the following environment variables:
```env
VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

## Troubleshooting Steps

### 1. Verify Environment Variables
1. Check if `.env` file exists in the project root
2. Ensure both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present
3. Verify the values are not empty strings
4. Confirm the values match your Supabase project settings

### 2. Connect to Supabase
1. Click the "Connect to Supabase" button in the top right corner
2. Follow the setup wizard to create or connect to a Supabase project
3. Wait for the environment variables to be automatically configured

### 3. Verify Database Access
1. Check Supabase Dashboard for project status
2. Ensure the database is active and accessible
3. Verify Row Level Security (RLS) policies are correctly configured
4. Test database connection using Supabase Dashboard

### 4. Check Authentication Status
1. Ensure you're signed in to the application
2. Verify the authentication token is valid
3. Check browser console for authentication-related errors

### 5. Common Solutions
1. **Missing Environment Variables**
   - Click "Connect to Supabase" to set up the connection
   - Wait for the environment variables to be configured
   - Restart the development server

2. **Authentication Issues**
   - Sign out and sign back in
   - Clear browser cache and cookies
   - Try using a different browser

3. **Database Access Issues**
   - Verify Supabase project is active
   - Check RLS policies in Supabase Dashboard
   - Ensure the database tables exist

## Relevant Error Logs

Check the following locations for error details:
1. Browser Console (F12 > Console tab)
2. Network Tab for failed API requests
3. Supabase Dashboard > Logs

## Support Resources

1. [Supabase Documentation](https://supabase.com/docs)
2. [Supabase Status Page](https://status.supabase.com)
3. Contact support: support@taxexempt.pt

## Prevention

To prevent this error in the future:
1. Always use the "Connect to Supabase" button for initial setup
2. Keep environment variables secure and properly configured
3. Monitor Supabase service status
4. Implement proper error handling in the application
5. Regularly test database connectivity

## Technical Details

### Database Schema
```sql
CREATE TABLE eligibility_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_eligible boolean,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Connection Code
```typescript
// src/lib/supabase.ts
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null as unknown as SupabaseClient;
```