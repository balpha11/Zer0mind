/* ─────────────────────────────────────────────────────────────
 *  src/services/api.js  –  universal fetch helpers
 *  UPDATED:
 *  - Added bulkUpdatePlans() helper for PUT /api/admin/plans/bulk-update
 *  - Added settings endpoints for general, notifications, security, maintenance
 *  - Added fetchPaymentSettings and savePaymentSettings for payment gateway
 *  - Added deletePlan for DELETE /api/admin/plans/:id
 *  - Ensured consistency with backend routes for plans and settings
 * ──────────────────────────────────────────────────────────── */

/* ------------------------------------------------------------
 *  Robust base-URL resolution
 * ---------------------------------------------------------- */
const RAW_ENV = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, ""); // trim trailing “/”
let GENERAL_BASE = "/api";
let ADMIN_BASE = "/api/admin";

if (RAW_ENV) {
  if (RAW_ENV.endsWith("/admin")) {
    ADMIN_BASE = RAW_ENV;
    GENERAL_BASE = RAW_ENV.replace(/\/admin$/, "");
  } else {
    GENERAL_BASE = RAW_ENV;
    ADMIN_BASE = `${RAW_ENV}/admin`;
  }
}

const FETCH_TIMEOUT = 10_000;

/* ------------------------------------------------------------
 *  Core helpers
 * ---------------------------------------------------------- */
const getToken = () => localStorage.getItem("admin_token");

const buildHeaders = (extra = {}, attachAuth = true) => {
  const headers = { ...extra };
  if (attachAuth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res, url) => {
  if (res.status === 401 || res.status === 403)
    throw new Error(`Auth required (${res.status}) for ${url}`);

  if (!res.ok) {
    let msg = `Error ${res.status} @ ${url}`;
    try { msg = (await res.json()).detail || msg; } catch { /* ignore */ }
    throw new Error(msg);
  }
  return res.status === 204 ? null : res.json();
};

const apiRequest = async (path, opts = {}, admin = true) => {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT);
  const base = admin ? ADMIN_BASE : GENERAL_BASE;

  try {
    const res = await fetch(`${base}${path}`, { ...opts, signal: ctrl.signal });
    clearTimeout(timeout);
    return await handleResponse(res, `${base}${path}`);
  } catch (err) {
    if (err.name === "AbortError")
      throw new Error(`Timeout (${FETCH_TIMEOUT / 1000}s) for ${base}${path}`);
    throw err;
  }
};

/* ─────────────────────────────────────────────────────────────
 *  Thin wrappers
 * ───────────────────────────────────────────────────────────── */
const apiGet = (u, a = true) => apiRequest(u, { headers: buildHeaders() }, a);
const apiPost = (u, d, a = true) =>
  apiRequest(u, {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(d)
  }, a);
const apiPut = (u, d, a = true) =>
  apiRequest(u, {
    method: "PUT",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(d)
  }, a);
const apiPatch = (u, d, a = true) =>
  apiRequest(u, {
    method: "PATCH",
    headers: buildHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(d)
  }, a);
const apiDelete = (u, a = true) => apiRequest(u, { method: "DELETE", headers: buildHeaders() }, a);

/* ======================================================================
 *  AUTH
 * ==================================================================== */
export const adminLogin = (email, password) => {
  const body = new URLSearchParams({ username: email, password });
  return apiRequest("/login", {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/x-www-form-urlencoded" }, false),
    body
  }, true);
};

export const userLogin = (email, password) => {
  const body = new URLSearchParams({ username: email, password });
  return apiRequest("/user-login", {
    method: "POST",
    headers: buildHeaders({ "Content-Type": "application/x-www-form-urlencoded" }, false),
    body
  }, false);
};

/* ======================================================================
 *  AGENTS
 * ==================================================================== */
export const fetchAgents = () => apiGet("/agents");
export const createAgent = (d) => apiPost("/agents", d);
export const updateAgent = (id, d) => apiPut(`/agents/${id}`, d);
export const deleteAgent = (id) => apiDelete(`/agents/${id}`);
export const searchAgents = (q) => apiGet(`/agents/search?q=${encodeURIComponent(q)}`);
export const runAgent = (id, input) => apiPost(`/agents/${id}/run`, { input });

/* ======================================================================
 *  FLOWS
 * ==================================================================== */
export const fetchFlows = () => apiGet("/flows");
export const createFlow = (d) => apiPost("/flows", d);
export const updateFlow = (id, d) => apiPut(`/flows/${id}`, d);
export const deleteFlow = (id) => apiDelete(`/flows/${id}`);
export const associateAgentWithFlows = (agentId, flowIds) =>
  apiPut(`/agents/${agentId}/flows`, { flow_ids: flowIds });

/* ======================================================================
 *  TOOLS
 * ==================================================================== */
export const fetchTools = () => apiGet("/tools");
export const createTool = (d) => apiPost("/tools", d);
export const updateTool = (id, d) => apiPut(`/tools/${id}`, d);
export const deleteTool = (id) => apiDelete(`/tools/${id}`);
export const fetchAvailableFunctions = () => apiGet("/tools/functions");
export const fetchHostedTools = () => apiGet("/tools/hosted");
export const fetchFunctionDescription = (fn) => apiGet(`/tools/functions/${encodeURIComponent(fn)}/description`);

/* ======================================================================
 *  PROMPTS
 * ==================================================================== */
export const fetchPrompts = () => apiGet("/prompts");
export const createPrompt = (d) => apiPost("/prompts", d);
export const updatePrompt = (id, d) => apiPut(`/prompts/${id}`, d);
export const deletePrompt = (id) => apiDelete(`/prompts/${id}`);

/* ======================================================================
 *  GUARDRAILS
 * ==================================================================== */
export const fetchGuardrails = () => apiGet("/guardrails", false);
export const createGuardrail = (d) => apiPost("/guardrails", d, false);
export const updateGuardrail = (id, d) => apiPut(`/guardrails/${id}`, d, false);
export const deleteGuardrail = (id) => apiDelete(`/guardrails/${id}`, false);
export const toggleGuardrail = (id, enabled) => apiPatch(`/guardrails/${id}`, { enabled }, false);

/* ======================================================================
 *  LOGS / FEEDBACK / USERS / KEYS
 * ==================================================================== */
export const fetchRunLogs = () => apiGet("/logs");
export const fetchLogById = (id) => apiGet(`/logs/${id}`);
export const fetchFeedback = () => apiGet("/feedback");
export const deleteFeedback = (id) => apiDelete(`/feedback/${id}`);

export const fetchUsers = () => apiGet("/users");
export const createUser = (d) => apiPost("/users", d);
export const updateUser = (id, d) => apiPut(`/users/${id}`, d);
export const deleteUser = (id) => apiDelete(`/users/${id}`);

export const fetchApiKeys = () => apiGet("/api-keys");
export const createApiKey = (d) => apiPost("/api-keys", d);
export const deleteApiKey = (id) => apiDelete(`/api-keys/${id}`);

/* ======================================================================
 *  PLANS – Public + Admin
 * ==================================================================== */
export const fetchPlans = () => apiGet("/plans", false); // GET /api/plans

// 🛠️ Admin-only endpoints
export const createPlan = (d) => apiPost("/plans", d, true); // POST /api/admin/plans
export const updatePlan = (id, d) => apiPut(`/plans/${id}`, d, true); // PUT /api/admin/plans/:id
export const deletePlan = (id) => apiDelete(`/plans/${id}`, true); // DELETE /api/admin/plans/:id
export const bulkUpdatePlans = (plans) => apiPut("/plans/bulk-update", plans, true); // PUT /api/admin/plans/bulk-update

/* ======================================================================
 *  SETTINGS – Admin-only
 * ==================================================================== */
export const fetchGeneralSettings = () => apiGet("/settings/general", true); // GET /api/admin/settings/general
export const saveGeneralSettings = (d) => apiPost("/settings/general", d, true); // POST /api/admin/settings/general

export const fetchNotificationSettings = () => apiGet("/settings/notifications", true); // GET /api/admin/settings/notifications
export const saveNotificationSettings = (d) => apiPost("/settings/notifications", d, true); // POST /api/admin/settings/notifications

/**
 * Fetches the current security settings
 * @returns {Promise<Object>} The security settings
 */
export const fetchSecuritySettings = async () => {
  try {
    const response = await fetch('/api/admin/settings/security');
    if (!response.ok) throw new Error('Failed to fetch security settings');
    return await response.json();
  } catch (error) {
    console.error('Error fetching security settings:', error);
    throw error;
  }
};

/**
 * Saves the security settings
 * @param {Object} settings - The security settings to save
 * @param {boolean} settings.twoFactorEnabled - Whether 2FA is enabled
 * @param {boolean} settings.ipWhitelistEnabled - Whether IP whitelisting is enabled
 * @param {string[]} settings.ipWhitelist - List of whitelisted IP addresses
 * @param {boolean} settings.googleAuthEnabled - Whether Google Auth is enabled
 * @param {string} settings.googleAuthClientId - Google OAuth client ID
 * @param {string} settings.googleAuthClientSecret - Google OAuth client secret
 * @param {boolean} settings.auditTrailEnabled - Whether audit trail is enabled
 * @param {number} settings.auditRetentionDays - Number of days to retain audit logs
 * @returns {Promise<Object>} The saved security settings
 */
export const saveSecuritySettings = async (settings) => {
  try {
    const response = await fetch('/api/admin/settings/security', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    
    if (!response.ok) throw new Error('Failed to save security settings');
    return await response.json();
  } catch (error) {
    console.error('Error saving security settings:', error);
    throw error;
  }
};

export const fetchMaintenanceSettings = () => apiGet("/settings/maintenance", true); // GET /api/admin/settings/maintenance
export const saveMaintenanceSettings = (d) => apiPost("/settings/maintenance", d, true); // POST /api/admin/settings/maintenance

export const fetchPaymentSettings = () => apiGet("/settings/payments", true); // GET /api/admin/settings/payments
export const savePaymentSettings = (d) => apiPost("/settings/payments", d, true); // POST /api/admin/settings/payments