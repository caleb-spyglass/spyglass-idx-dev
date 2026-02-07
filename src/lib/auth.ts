export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
}

const STORAGE_KEY = 'spyglass-user';

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

export function saveUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const fullUser: User = {
    id: crypto.randomUUID(),
    email: user.email,
    name: user.name,
    phone: user.phone,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fullUser));
  return fullUser;
}

export function clearUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}
