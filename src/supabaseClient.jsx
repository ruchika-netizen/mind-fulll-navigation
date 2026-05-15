import { createClient } from '@supabase/supabase-js'

const supabaseUrs = "https://yqvevufukdoeyhxizbtb.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWlndWZybHNvb3B4anh1Y3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMzE1ODUsImV4cCI6MjA5MzYwNzU4NX0.y8EKZfE2L5Eyz_QbxvEMBGlhuag5tXsHs5zQoyFixgE"

export const supabase = createClient(supabaseUrs, supabaseKey)
