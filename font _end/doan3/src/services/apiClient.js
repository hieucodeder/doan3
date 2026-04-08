const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const ACCESS_TOKEN_KEY = 'accessToken'
const CURRENT_USER_KEY = 'currentUser'

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token) {
    if (!token) return
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAuthStorage() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(CURRENT_USER_KEY)
}

export function getStoredUser() {
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    if (!raw) return null

    try {
        return JSON.parse(raw)
    } catch {
        return null
    }
}

export function setStoredUser(user) {
    if (!user) return
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

export async function apiRequest(path, options = {}) {
    const { skipAuth = false, headers = {}, ...rest } = options

    const requestHeaders = {
        'Content-Type': 'application/json',
        ...headers,
    }

    if (!skipAuth) {
        const token = getAccessToken()
        if (token) {
            requestHeaders.Authorization = `Bearer ${token}`
        }
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        headers: requestHeaders,
    })

    let payload = null
    try {
        payload = await response.json()
    } catch {
        payload = null
    }

    return {
        ok: response.ok,
        status: response.status,
        payload,
    }
}

export function resolveImageUrl(imagePath) {
    if (!imagePath) {
        return 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200'
    }

    const raw = String(imagePath).trim()

    if (
        raw.startsWith('http://') ||
        raw.startsWith('https://') ||
        raw.startsWith('data:') ||
        raw.startsWith('blob:')
    ) {
        return raw
    }

    if (raw.startsWith('/')) {
        return `${API_BASE_URL}${raw}`
    }

    return `${API_BASE_URL}/${raw}`
}
