import { createClient } from '@supabase/supabase-js'

const supabaseUrs = "https://iwozpnxuzwchgraagqhv.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3b3pwbnh1endjaGdyYWFncWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1NjA0NjYsImV4cCI6MjA5NDEzNjQ2Nn0.f4Jf8KAyPVeHnN1BOi3hAgObmsZ9aFV9UawZP7gGkuk"

export const supabase = createClient(supabaseUrs, supabaseKey)


