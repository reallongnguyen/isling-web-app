import { AuthToken } from '../../models/auth-token.model';

const TOKEN_KEY = 'authToken';

export function insertAuthToken(authToken: AuthToken) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(authToken));
}

export function findAuthToken(): AuthToken | null {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return null;
  }

  try {
    return JSON.parse(token) as AuthToken;
  } catch {
    return null;
  }
}

export function deleteAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}
