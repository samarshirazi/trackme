# 📊 Supabase Setup - Step-by-Step Guide

## Your Project Details

- **Project ID**: `dozinjiiihlkmquouyop`
- **Project URL**: `https://dozinjiiihlkmquouyop.supabase.co`
- **Dashboard URL**: https://supabase.com/dashboard/project/dozinjiiihlkmquouyop

✅ Your `.env` file has been corrected with the right URL!

---

## Step 1: Navigate to SQL Editor

1. Open your Supabase dashboard: https://supabase.com/dashboard/project/dozinjiiihlkmquouyop

2. In the left sidebar, click on **"SQL Editor"** (icon looks like `</> `)

3. Click the **"+ New query"** button

---

## Step 2: Copy the Database Schema

1. Open the file: `packages/database/schema.sql`

2. **Select ALL** the content (Cmd/Ctrl + A)

3. **Copy** it (Cmd/Ctrl + C)

The file is **~400 lines** and includes:
- Table creation statements
- Index creation
- RLS policies
- Triggers and functions

---

## Step 3: Run the Schema

1. **Paste** the entire content into the SQL Editor (Cmd/Ctrl + V)

2. Click **"Run"** button (or press Cmd/Ctrl + Enter)

3. Wait for execution (should take 2-5 seconds)

4. You should see a success message like:
   ```
   Success. No rows returned
   ```

⚠️ **Important**: Make sure the ENTIRE file was pasted and executed!

---

## Step 4: Verify Tables Were Created

### Method 1: Table Editor
1. Click **"Table Editor"** in the left sidebar
2. You should see 9 new tables in the list
3. Click on each to verify they exist

### Method 2: SQL Query
1. In SQL Editor, run this query:
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;
   ```

2. You should see these 9 tables:
   - `activity_sessions`
   - `auto_projects`
   - `categorization_rules`
   - `checkin_settings`
   - `checkin_templates`
   - `daily_summaries`
   - `manual_checkins`
   - `profiles`
   - `user_preferences`

---

## Step 5: Verify RLS Policies

1. Go to **"Table Editor"**

2. Click on `activity_sessions` table

3. Look for **RLS indicator** (shield icon or text saying "RLS enabled")

4. Click on the shield icon to see policies

5. You should see policies like:
   - "Users can view own sessions"
   - "Users can insert own sessions"
   - "Users can update own sessions"
   - "Users can delete own sessions"

**Why this matters**: RLS ensures users can ONLY see their own data!

---

## Step 6: Configure Authentication (Optional)

### For Testing (Recommended):

1. Go to **"Authentication"** → **"Settings"**

2. Under **"Email Auth"**, find **"Confirm email"**

3. **Disable** it temporarily for easier testing
   - This lets you sign up without email confirmation
   - You can re-enable it later

4. Click **"Save"**

### For Production:

Keep email confirmation **enabled** and configure:
- Email templates (optional)
- SMTP settings (optional, uses Supabase default)

---

## Step 7: Get Your API Credentials (Already Done!)

Your credentials are already in `.env`:

```env
VITE_SUPABASE_URL=https://dozinjiiihlkmquouyop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ These are correct! The URL has been fixed.

---

## Visual Checklist

```
┌─────────────────────────────────────────┐
│ Supabase Setup Checklist                │
├─────────────────────────────────────────┤
│ [ ] Opened SQL Editor                   │
│ [ ] Copied schema.sql (ALL 400+ lines)  │
│ [ ] Pasted into SQL Editor              │
│ [ ] Clicked Run                         │
│ [ ] Saw "Success" message               │
│ [ ] Verified 9 tables exist             │
│ [ ] Checked RLS is enabled              │
│ [ ] (Optional) Disabled email confirm   │
│ [ ] Verified .env file is correct       │
└─────────────────────────────────────────┘
```

---

## Common Mistakes to Avoid

### ❌ Mistake 1: Using Dashboard URL
**Wrong**: `https://supabase.com/dashboard/project/dozinjiiihlkmquouyop`
**Right**: `https://dozinjiiihlkmquouyop.supabase.co`

✅ **Fixed!** Your .env now has the correct URL.

### ❌ Mistake 2: Only running part of schema.sql
- You must run the ENTIRE file
- All 400+ lines
- Don't run it in parts

### ❌ Mistake 3: Skipping RLS verification
- If RLS is not enabled, data won't be private
- The schema.sql file enables it automatically
- Just verify it worked

### ❌ Mistake 4: Wrong anon key
- Make sure you copied the **anon** key, not the **service_role** key
- Anon key is safe for client-side use
- Service role key should NEVER be in client code

---

## How to Verify Everything Worked

### Quick Test Query

Run this in SQL Editor:

```sql
-- Should return 0 rows (table exists but is empty)
SELECT COUNT(*) FROM activity_sessions;

-- Should return 0 rows (table exists but is empty)
SELECT COUNT(*) FROM profiles;

-- Should show RLS is enabled (returns 'true')
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'activity_sessions';
```

Expected results:
1. First query: `0` (table empty - normal)
2. Second query: `0` (table empty - normal)
3. Third query: `rowsecurity = true` (RLS enabled - important!)

---

## What Each Table Does

| Table | Purpose |
|-------|---------|
| `profiles` | User profile information (extends auth.users) |
| `activity_sessions` | Automatic activity tracking data |
| `manual_checkins` | User-reported activities (check-ins) |
| `checkin_templates` | Pre-configured activity templates |
| `checkin_settings` | Per-user check-in configuration |
| `categorization_rules` | Rules for auto-categorizing apps |
| `auto_projects` | Auto-detected project names |
| `user_preferences` | User settings (work hours, etc.) |
| `daily_summaries` | Pre-computed daily statistics |

---

## Security Features Enabled

✅ **Row Level Security (RLS)**
- Users can ONLY see their own data
- Enforced at database level
- Cannot be bypassed

✅ **Encrypted Connections**
- All API calls use HTTPS
- Data encrypted in transit

✅ **Authentication**
- Supabase Auth handles user management
- Passwords hashed with bcrypt
- JWT tokens for sessions

---

## Next: Test the Connection

After completing all steps above, you can test the connection:

```bash
# Install dependencies (if not done yet)
npm install

# Run the Supabase test
npm run test:supabase
```

This will verify:
1. ✅ Environment variables are correct
2. ✅ Database connection works
3. ✅ All 9 tables exist
4. ✅ Authentication is configured

---

## Troubleshooting

### "relation does not exist" error
**Cause**: Tables weren't created
**Solution**: Re-run the entire schema.sql file

### "permission denied" error
**Cause**: RLS policies not created
**Solution**: Re-run the entire schema.sql file

### "Invalid API key" error
**Cause**: Wrong anon key in .env
**Solution**:
1. Go to Settings → API in Supabase dashboard
2. Copy the **anon** key (not service_role)
3. Update .env file

### Connection timeout
**Cause**: Project might be paused
**Solution**: Go to dashboard, project should auto-wake

---

## Summary

```
Setup Flow:
1. Create Supabase project ✅ (Done)
2. Get URL and anon key ✅ (Done)
3. Update .env file ✅ (Done - I fixed it!)
4. Run schema.sql → YOU ARE HERE
5. Verify tables created
6. Test connection
7. Run the app
```

**Current Status**:
- ✅ Steps 1-3 complete
- ⏳ Step 4: Please run the schema.sql file now
- ⏳ Steps 5-7: Will do after schema is applied

---

Ready to continue? Apply the schema.sql file and then run:

```bash
npm install
npm run test:supabase
```

This will tell us if everything is set up correctly! 🚀
