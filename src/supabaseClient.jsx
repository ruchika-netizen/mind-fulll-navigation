
import { createClient } from '@supabase/supabase-js'

const supabaseUrs = "https://yqvevufukdoeyhxizbtb.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxdmV2dWZ1a2RvZXloeGl6YnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MDkwODUsImV4cCI6MjA4OTM4NTA4NX0.r-1T_yaE2DgZj4Ys3lT3vAMWLwFGR3UvGzT9SHFlZpI"

export const supabase = createClient(supabaseUrs, supabaseKey)
