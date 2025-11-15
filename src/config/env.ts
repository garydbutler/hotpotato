import Constants from 'expo-constants';

interface EnvConfig {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  OPENROUTER_API_KEY: string;
  OPENROUTER_MODEL?: string;
}

// Get environment variables from expo-constants
const getEnvVars = (): EnvConfig => {
  const extra = Constants.expoConfig?.extra || {};

  return {
    SUPABASE_URL: extra.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: extra.SUPABASE_ANON_KEY || '',
    OPENROUTER_API_KEY: extra.OPENROUTER_API_KEY || '',
    OPENROUTER_MODEL: extra.OPENROUTER_MODEL || 'google/gemini-2.0-flash-exp:free',
  };
};

export default getEnvVars();
