export const handle = async ({ event, resolve }) => {
  // Verify env vars at runtime
  if (!process.env.PUBLIC_SUPABASE_URL) {
    console.error('PUBLIC_SUPABASE_URL is missing!');
  }
  
  return resolve(event);
};