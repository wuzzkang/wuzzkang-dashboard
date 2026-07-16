/**
 * adminApi.js — Isolated admin API client.
 *
 * SCALABILITY: This file contains ALL admin-specific API calls.
 * When migrating to a separate admin repository, copy this file
 * and only change the BASE_URL source (e.g., hardcode or use a different env var).
 *
 * All functions accept a `token` parameter (JWT access_token) so they are
 * independent of any specific auth context implementation.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper to safely extract error message from response body
function getErrorMessage(body, defaultMsg) {
  if (!body?.error) return defaultMsg;
  if (typeof body.error === 'object') {
    return body.error.message || JSON.stringify(body.error);
  }
  return body.error;
}

/**
 * Fetches platform-wide statistics for the admin dashboard overview cards.
 *
 * @param {string} token - JWT access_token from Supabase session.
 * @returns {Promise<Object>} Stats data: { totalUsers, totalTransactions, pendingTransactions, totalRevenueIdr, totalCreditsIssued }
 * @throws {Error} If the API returns a non-OK response.
 *
 * API: GET /api/admin/stats
 * Response: { success: true, data: { totalUsers, totalTransactions, ... } }
 */
export async function fetchAdminStats(token) {
  const response = await fetch(`${BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(body, `Failed to fetch stats (${response.status})`));
  }

  const result = await response.json();
  return result.data;
}

/**
 * Fetches paginated list of all transactions across all users.
 *
 * @param {string} token - JWT access_token.
 * @param {Object} [params] - Query parameters.
 * @param {string} [params.search] - Search by order_id (partial match).
 * @param {string} [params.status] - Filter: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED' | '' (all).
 * @param {string} [params.type] - Filter: 'topup' | 'deployment' | 'refund' | '' (all).
 * @param {number} [params.limit=20] - Page size (max 50).
 * @param {number} [params.offset=0] - Pagination offset.
 * @returns {Promise<{ transactions: Array, totalCount: number }>}
 * @throws {Error} If the API returns a non-OK response.
 *
 * API: GET /api/admin/transactions?search=&status=&type=&limit=20&offset=0
 * Response: { success: true, data: [...], totalCount: number }
 */
export async function fetchAdminTransactions(token, { search = '', status = '', type = '', limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (status) params.append('status', status);
  if (type) params.append('type', type);
  params.append('limit', String(limit));
  params.append('offset', String(offset));

  const response = await fetch(`${BASE_URL}/admin/transactions?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(body, `Failed to fetch transactions (${response.status})`));
  }

  const result = await response.json();
  return {
    transactions: result.data,
    totalCount: result.totalCount,
  };
}

/**
 * Manually completes (marks as PAID) a pending top-up transaction.
 *
 * @param {string} token - JWT access_token.
 * @param {string} transactionId - UUID or order_id (INV-xxx) of the transaction.
 * @returns {Promise<Object>} { success: true, message: '...', newBalance: number }
 * @throws {Error} If the API returns a response status code that is not OK.
 *
 * API: POST /api/admin/payments/:id/complete
 * Response: { success: true, message: 'Transaction completed successfully', newBalance: number }
 */
export async function completeTransaction(token, transactionId) {
  const response = await fetch(`${BASE_URL}/admin/payments/${transactionId}/complete`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(body, `Failed to complete transaction (${response.status})`));
  }

  return await response.json();
}

/**
 * Fetches paginated list of all user profiles with search.
 *
 * @param {string} token - JWT access_token.
 * @param {Object} [params] - Query parameters.
 * @param {string} [params.search] - Search by email or full_name (partial match).
 * @param {number} [params.limit=20] - Page size.
 * @param {number} [params.offset=0] - Pagination offset.
 * @returns {Promise<{ users: Array, totalCount: number }>}
 * @throws {Error} If the API returns a non-OK response.
 */
export async function fetchAdminUsers(token, { search = '', limit = 20, offset = 0 } = {}) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  params.append('limit', String(limit));
  params.append('offset', String(offset));

  const response = await fetch(`${BASE_URL}/admin/users?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(body, `Failed to fetch users (${response.status})`));
  }

  const result = await response.json();
  return {
    users: result.data,
    totalCount: result.totalCount,
  };
}

/**
 * Toggles a user's is_active status (suspend/reactivate).
 *
 * @param {string} token - JWT access_token.
 * @param {string} userId - The ID of the user to toggle.
 * @param {boolean} isActive - The status to set.
 * @returns {Promise<Object>} API response body.
 */
export async function toggleUserStatus(token, userId, isActive) {
  const response = await fetch(`${BASE_URL}/admin/users/${userId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ is_active: isActive }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(body, `Failed to update user status (${response.status})`));
  }

  return await response.json();
}

/**
 * Permanently deletes a user account from Supabase Auth and database tables.
 *
 * @param {string} token - JWT access_token.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<Object>} API response body.
 */
export async function deleteUserAccount(token, userId) {
  const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(body, `Failed to delete user (${response.status})`));
  }

  return await response.json();
}
