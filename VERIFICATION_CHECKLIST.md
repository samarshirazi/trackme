# TrackMe Setup Verification Checklist

Follow these steps to verify your Supabase setup is working correctly.

## ✅ Step 1: Verify Environment Configuration

Your `.env` file should look like this:

```
VITE_SUPABASE_URL=https://dozinjiiihlkmquouyop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **Status**: Completed - I've already corrected your URL!

---

## ✅ Step 2: Apply Database Schema

1. Go to your Supabase project: https://supabase.com/dashboard/project/dozinjiiihlkmquouyop

2. Navigate to: **SQL Editor** (in the left sidebar)

3. Click: **New Query**

4. Copy the ENTIRE contents of: `packages/database/schema.sql`

5. Paste into the SQL Editor

6. Click: **Run** (or press Cmd/Ctrl + Enter)

7. You should see: "Success. No rows returned"

### What This Creates:
- ✅ 9 database tables
- ✅ Row Level Security policies
- ✅ Indexes for performance
- ✅ Triggers for automatic updates
- ✅ Functions for user creation

---

## ✅ Step 3: Verify Tables Were Created

1. In Supabase dashboard, go to: **Table Editor**

2. You should see these 9 tables:
   - [ ] `profiles`
   - [ ] `activity_sessions`
   - [ ] `manual_checkins`
   - [ ] `checkin_templates`
   - [ ] `checkin_settings`
   - [ ] `categorization_rules`
   - [ ] `auto_projects`
   - [ ] `user_preferences`
   - [ ] `daily_summaries`

---

## ✅ Step 4: Verify RLS (Row Level Security) is Enabled

1. Click on any table (e.g., `activity_sessions`)

2. Look for a shield icon or "RLS enabled" indicator

3. All tables should have RLS **ENABLED**

---

## ✅ Step 5: Verify Authentication is Enabled

1. Go to: **Authentication** → **Providers**

2. Verify: **Email** provider is enabled

3. (Optional) For testing: Go to **Authentication** → **Settings** → **Email Auth**
   - You can temporarily disable "Confirm email" for easier testing
   - Re-enable it later for production

---

## ✅ Step 6: Install Node.js Dependencies

In your terminal, from the `trackMe` directory:

```bash
npm install
```

This will install all dependencies for:
- Root workspace
- Desktop app
- Shared packages

Expected output: Should complete without errors

---

## ✅ Step 7: Run Supabase Connection Test

```bash
npm run test:supabase
```

### Expected Output:

```
🔍 TrackMe Supabase Connection Test

═══════════════════════════════════════════════════════

1️⃣  Checking environment variables...
✅ Supabase URL: https://dozinjiiihlkmquouyop.supabase.co
✅ Anon Key: eyJhbGciOiJIUzI1NiI...

2️⃣  Creating Supabase client...
✅ Client created successfully

3️⃣  Testing database connection...
✅ Database connection successful!

4️⃣  Checking if required tables exist...
✅ Table 'profiles' exists
✅ Table 'activity_sessions' exists
✅ Table 'manual_checkins' exists
✅ Table 'checkin_templates' exists
✅ Table 'checkin_settings' exists
✅ Table 'categorization_rules' exists
✅ Table 'auto_projects' exists
✅ Table 'user_preferences' exists
✅ Table 'daily_summaries' exists

5️⃣  Testing authentication...
✅ Authentication system is working
   (No active session - this is normal)

═══════════════════════════════════════════════════════

✅ All tests passed! Your Supabase setup is correct.

🚀 You can now run the app with: npm run desktop
```

---

## ❌ Common Issues & Solutions

### Issue 1: "Table not found" errors

**Solution**: You didn't run the schema.sql file
- Go back to Step 2
- Make sure you copy the ENTIRE file
- Run it in SQL Editor

### Issue 2: "Auth session missing" error

**Solution**: This is actually NORMAL! It just means you're not logged in yet.
- This error is expected when no user is logged in
- The test will still pass

### Issue 3: "Database connection failed"

**Solutions**:
1. Check your `.env` file has the correct URL and key
2. Verify URL is: `https://dozinjiiihlkmquouyop.supabase.co` (not the dashboard URL)
3. Check that your Supabase project is active (not paused)

### Issue 4: "RLS policy violation"

**Solution**: Row Level Security policies not created
- Re-run the entire schema.sql file
- Make sure ALL SQL commands executed successfully

---

## ✅ Step 8: Run the Desktop App

```bash
npm run desktop
```

### Expected Behavior:

1. Vite development server starts
2. Electron window opens
3. You see the login screen
4. Can sign up with email/password
5. After login, see empty dashboard (no data yet)

### First Time Permissions (macOS only):

When you first run the app, macOS will ask for:

1. **Screen Recording Permission**
   - System Preferences → Security & Privacy → Privacy → Screen Recording
   - Add the app and restart

---

## ✅ Step 9: Create Test Account

1. Click "Don't have an account? Sign up"
2. Enter email: `test@example.com`
3. Enter password: `password123`
4. Click "Sign Up"

**If email confirmation is enabled:**
- Check your email inbox
- Click the confirmation link
- Return to app and sign in

**If email confirmation is disabled:**
- You'll be logged in immediately

---

## ✅ Step 10: Verify Tracking Works

After logging in:

1. **Check System Tray**: You should see the TrackMe icon
2. **Check Dashboard**: Should show "0h 0m" (no data yet)
3. **Let it Run**: Leave app open for 5-10 minutes
4. **Refresh Dashboard**: You should now see some activity!

### What to Look For:

- Total time increases
- Apps appear in "Top Apps" section
- Activity timeline shows recent activities
- Activities are auto-categorized

---

## 🎉 Success Indicators

You'll know everything is working when:

- ✅ Test script passes all checks
- ✅ App launches without errors
- ✅ You can sign up and log in
- ✅ Dashboard loads (even if empty)
- ✅ After 5-10 minutes, you see tracked activities
- ✅ Check-in prompt appears when you return from idle (15+ min)

---

## 🆘 Still Having Issues?

### Debug Steps:

1. **Check Browser Console** (in Electron app):
   - Right-click → Inspect Element
   - Go to Console tab
   - Look for errors (red text)

2. **Check Terminal Output**:
   - Look for errors when running `npm run desktop`
   - Any red error messages?

3. **Check Supabase Logs**:
   - Go to your project dashboard
   - Logs & Monitoring → Logs Explorer
   - Look for failed requests

4. **Verify Database**:
   - Table Editor → Select `activity_sessions`
   - Should be empty initially
   - After tracking, should show rows

---

## 📝 Quick Verification Summary

Run these commands in order:

```bash
# 1. Install dependencies
npm install

# 2. Test Supabase connection
npm run test:supabase

# 3. Run the app
npm run desktop
```

If all three work without errors, you're good to go! 🚀

---

## Next Steps After Verification

Once everything is working:

1. ✅ Read `QUICK_REFERENCE.md` for usage tips
2. ✅ Review `SETUP.md` for detailed documentation
3. ✅ Start tracking and review your dashboard daily
4. ✅ Respond to check-in prompts honestly
5. ✅ Customize settings as needed

---

**Need Help?**
- Re-read this checklist carefully
- Check the error messages
- Verify each step was completed
- Most issues are from skipping the schema.sql step!
