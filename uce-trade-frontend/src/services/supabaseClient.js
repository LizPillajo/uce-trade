import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zoxtcheqhlhvznjsarsg.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpveHRjaGVxaGxodnpuanNhcnNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MTM0NzYsImV4cCI6MjA4NDA4OTQ3Nn0.yqGZto86gA5dpvWjuP9eQdB2n3uBCUsabneaa1aMcIw';

export const supabase = createClient(supabaseUrl, supabaseKey);