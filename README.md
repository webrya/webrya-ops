# Webrya Ops (MVP)

Lightweight operations platform for short-term rental management (Airbnb / Booking style).

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create a Supabase project at https://supabase.com
   - Copy your project URL and anon key
   - Create a `.env.local` file in the root directory:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

3. **Run database schema:**
   - Open your Supabase dashboard
   - Go to SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Run the SQL to create tables and RLS policies

4. **Run the app:**
   ```bash
   npm run dev
   ```

## Database Schema

- **properties**: Property listings with name and address
- **bookings**: Bookings linked to properties with check-in/out dates
- **tasks**: Tasks (auto-created when bookings are created) linked to properties and bookings

## Features

- **Properties**: Create and view properties
- **Bookings**: Create bookings with automatic task generation (cleaning tasks created on check-out date)
- **Tasks**: View all tasks with property relationships

## Security

- RLS (Row Level Security) is enabled on all tables
- Public access (anon) with SELECT and INSERT permissions
- No authentication required for MVP
