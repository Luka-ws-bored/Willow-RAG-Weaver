import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const supabaseUrl = 'https://ykldcfioxyarulwzaxua.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbGRjZmlveHlhcnVsd3pheHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMDMzNzYsImV4cCI6MjA2NzU3OTM3Nn0.FB6ksfHvgkU6IiFXVlW3SkH73QdL0TVnhxOnWSFvJJA'

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)