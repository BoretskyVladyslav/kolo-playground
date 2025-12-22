import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oolfoiktjbnhevfuxnut.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vbGZvaWt0amJuaGV2ZnV4bnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDY1MTksImV4cCI6MjA3NTQ4MjUxOX0.NCo4q-cGu-kkqELosPGZv6WEJU_iwOArJRG4sz_Jt_c';

export const supabase = createClient(supabaseUrl, supabaseKey);