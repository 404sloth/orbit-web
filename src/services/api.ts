import { API_URL } from "../utils/constants";

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem("copilot_token");
  const headers = {
    ...init?.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  } as HeadersInit;

  let response = await fetch(url, { ...init, headers });

  // If unauthorized, try to refresh token
  if (response.status === 401) {
    const refreshToken = localStorage.getItem("copilot_refresh_token");
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          localStorage.setItem("copilot_token", refreshData.access_token);

          // Retry the original request with new token
          const newHeaders = {
            ...init?.headers,
            Authorization: `Bearer ${refreshData.access_token}`,
          } as HeadersInit;

          response = await fetch(url, { ...init, headers: newHeaders });
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }

    if (response.status === 401) {
      // Still unauthorized, logout
      localStorage.removeItem("copilot_token");
      localStorage.removeItem("copilot_refresh_token");
      window.location.reload();
    }
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<T>;
}

export const chatApi = {
  getThreads: () => fetchJson<Record<string, unknown>[]>(`${API_URL}/chat/threads`),
  createThread: () => fetchJson<Record<string, unknown>>(`${API_URL}/chat/threads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }),
  getHistory: (threadId: string) => fetchJson<any[]>(`${API_URL}/chat/history/${encodeURIComponent(threadId)}`),
  deleteThread: (threadId: string) => fetchJson(`${API_URL}/chat/threads/${encodeURIComponent(threadId)}`, { method: "DELETE" }),
  getSuggestions: (threadId: string) => fetchJson<string[]>(`${API_URL}/chat/suggestions/${encodeURIComponent(threadId)}`),
  getReports: () => fetchJson<any[]>(`${API_URL}/reports/list`),
};

export const dashboardApi = {
  getProjects: () => fetchJson<any[]>(`${API_URL}/dashboard/projects`),
  getTimeline: (projectId: string) => fetchJson<any[]>(`${API_URL}/dashboard/projects/${projectId}/timeline`),
  simulateLifecycle: (projectId: string) => fetchJson(`${API_URL}/dashboard/projects/${projectId}/simulate-full-lifecycle`, { method: "POST" }),
  getNotifications: () => fetchJson<any[]>(`${API_URL}/dashboard/notifications`),
  handleNotificationAction: (id: number, action: string) => fetchJson(`${API_URL}/dashboard/notifications/${id}/action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  }),
  getAccessGaps: () => fetchJson<any[]>(`${API_URL}/audit/access-gaps`),
  resolveAccessGap: (id: string) => fetchJson(`${API_URL}/audit/access-gaps/${id}/resolve`, { method: "POST" }),
};

export const knowledgeApi = {
  ingest: (formData: FormData, token: string | null) => fetch(`${API_URL}/kb/documents`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    body: formData,
  }),
};
