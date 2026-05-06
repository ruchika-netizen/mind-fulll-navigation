import { createClient } from '@supabase/supabase-js'

const supabaseUrs = "https://esfmcrpslwwmjysbloqf.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzZm1jcnBzbHd3bWp5c2Jsb3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0ODQ0NjMsImV4cCI6MjA5MzA2MDQ2M30.RkHZhCheRsoYVskSHP1c2BvivUrzIsR1CK6edx4VZyA"

export const supabase = createClient(supabaseUrs, supabaseKey)