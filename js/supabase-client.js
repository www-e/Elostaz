let supabaseInstance = null;
let initializationPromise = null;

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

    try {
        if (!supabaseInstance) {
            supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            });

            // Test the connection
            const { error } = await supabaseInstance.auth.getSession();
            if (error) {
                console.error('Supabase initialization error:', error);
                supabaseInstance = null;
                throw error;
            }
        }
        return supabaseInstance;
    } catch (error) {
        console.error('Failed to initialize Supabase client:', error);
        supabaseInstance = null;
        throw error;
    }
}

// Initialize and export the client
export const supabase = async () => {
    try {
        if (!initializationPromise) {
            initializationPromise = initializeSupabase();
        }
        return await initializationPromise;
    } catch (error) {
        initializationPromise = null; // Reset on error
        throw error;
    }
}; 