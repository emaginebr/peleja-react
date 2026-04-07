export interface HttpClient {
  get: <T>(path: string, params?: Record<string, string>) => Promise<T>
  post: <T>(path: string, body?: unknown) => Promise<T>
  put: <T>(path: string, body?: unknown) => Promise<T>
  del: (path: string) => Promise<void>
}

export const createHttpClient = (
  apiUrl: string,
  tenantId: string,
  getToken: () => string | null,
): HttpClient => {
  const buildHeaders = (): HeadersInit => {
    const headers: Record<string, string> = {
      'X-Tenant-Id': tenantId,
      'Content-Type': 'application/json',
    }
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        status: response.status,
        detail: response.statusText,
      }))
      throw { status: response.status, ...error }
    }
    if (response.status === 204) return undefined as T
    return response.json()
  }

  const buildUrl = (path: string, params?: Record<string, string>): string => {
    const url = new URL(path, apiUrl)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value != null && value !== '') url.searchParams.set(key, value)
      })
    }
    return url.toString()
  }

  return {
    get: async <T>(path: string, params?: Record<string, string>) => {
      const response = await fetch(buildUrl(path, params), {
        method: 'GET',
        headers: buildHeaders(),
      })
      return handleResponse<T>(response)
    },
    post: async <T>(path: string, body?: unknown) => {
      const response = await fetch(buildUrl(path), {
        method: 'POST',
        headers: buildHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      })
      return handleResponse<T>(response)
    },
    put: async <T>(path: string, body?: unknown) => {
      const response = await fetch(buildUrl(path), {
        method: 'PUT',
        headers: buildHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      })
      return handleResponse<T>(response)
    },
    del: async (path: string) => {
      const response = await fetch(buildUrl(path), {
        method: 'DELETE',
        headers: buildHeaders(),
      })
      await handleResponse<void>(response)
    },
  }
}
