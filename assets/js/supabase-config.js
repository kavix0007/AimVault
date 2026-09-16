// AimVault Supabase configuration
// Paste ONLY your Supabase Project URL and PUBLIC publishable/anon key here.
// Never put a Supabase secret/service_role key in this file.
window.AIMVAULT_SUPABASE = {
  url: 'PASTE_YOUR_SUPABASE_PROJECT_URL_HERE',
  anonKey: 'PASTE_YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY_HERE'
};

window.AimVaultSupabaseConfig = {
  getClient: function () {
    const cfg = window.AIMVAULT_SUPABASE || {};
    const url = String(cfg.url || '').trim().replace(/\/$/, '');
    const key = String(cfg.anonKey || '').trim();
    if (!url || !key || url.includes('PASTE_YOUR_') || key.includes('PASTE_YOUR_')) return null;
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.supabase.co')) return null;
    } catch (_) { return null; }
    if (!window.supabase || typeof window.supabase.createClient !== 'function') return null;
    return window.supabase.createClient(url, key);
  },
  isConfigured: function () { return !!this.getClient(); }
};
