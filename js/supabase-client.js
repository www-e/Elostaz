let supabaseInstance = null;

async function initializeSupabase() {
    // Wait for the script to be loaded
    if (typeof window.supabase === 'undefined') {
        console.warn('Waiting for Supabase script to load...');
        await new Promise(resolve => {
            const checkSupabase = () => {
                if (typeof window.supabase !== 'undefined') {
                    resolve();
                } else {
                    setTimeout(checkSupabase, 100);
                }
            };
            checkSupabase();
        });
    }

    const { createClient } = window.supabase;
    const supabaseUrl = 'https://hzcuypdjxslgifigjofl.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6Y3V5cGRqeHNsZ2lmaWdqb2ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDA0NjYsImV4cCI6MjA2MzUxNjQ2Nn0.buO4qGzdvRRIWYoH6ZPgs_UqlrbcLPI0mAcYz1YbozY';

    if (!supabaseInstance) {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`
            },
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        });
    }
    return supabaseInstance;
}

// Initialize and export the client
export const supabase = async () => {
    if (!supabaseInstance) {
        await initializeSupabase();
    }
    return supabaseInstance;
}; 