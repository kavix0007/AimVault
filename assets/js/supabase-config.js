// AimVault Supabase configuration.
// This file uses only the public publishable/anon key. Never put a service_role/secret key here.
window.AIMVAULT_SUPABASE = {
  url: 'https://njaizvkazcvtxdirrvjz.supabase.co',
  anonKey: 'sb_publishable_fJFR8UdW_E0TT_eSRsuRWw_YEb_bBja'
};

window.AimVaultSupabaseConfig = {
  getClient: function () {
    const cfg = window.AIMVAULT_SUPABASE || {};
    const url = String(cfg.url || '').trim().replace(/\/$/, '');
    const key = String(cfg.anonKey || '').trim();
    if (!url || !key || url.includes('YOUR-PROJECT') || key.includes('YOUR-PUBLISHABLE')) return null;
    if (!window.supabase || typeof window.supabase.createClient !== 'function') return null;
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.supabase.co')) return null;
    } catch (_) { return null; }
    return window.supabase.createClient(url, key);
  },
  isConfigured: function () { return !!this.getClient(); }
};
