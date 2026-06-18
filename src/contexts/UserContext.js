import React, { createContext, useEffect, useState } from 'react';

const USERS_KEY = 'qaztour_users';
const CURRENT_USER_KEY = 'qaztour_current_user_id';

const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
};

const saveStoredUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const DEFAULT_USERS = [
  {
    id: 'frontend-demo-user',
    name: 'Frontend Demo User',
    email: 'demo@qaztour.local',
    password: 'demo123',
    phone: '+7 700 100 10 10',
    role: 'traveler',
    avatar: '',
    created_at: '2026-06-01T09:00:00.000Z',
  },
  {
    id: 'user-aigerim',
    name: 'Aigerim Sapar',
    email: 'aigerim@qaztour.local',
    password: '1234',
    phone: '+7 701 222 33 44',
    role: 'traveler',
    avatar: '',
    created_at: '2026-06-02T10:00:00.000Z',
  },
  {
    id: 'user-daniyar',
    name: 'Daniyar Guide',
    email: 'daniyar@qaztour.local',
    password: '1234',
    phone: '+7 702 555 66 77',
    role: 'guide',
    avatar: '',
    created_at: '2026-06-03T11:00:00.000Z',
  },
  {
    id: 'user-hotel-owner',
    name: 'Sara Hotel Owner',
    email: 'sara@qaztour.local',
    password: '1234',
    phone: '+7 705 888 99 00',
    role: 'hotel_owner',
    avatar: '',
    created_at: '2026-06-04T12:00:00.000Z',
  },
  {
    id: 'frontend-admin-user',
    name: 'Admin User',
    email: 'admin@qaztour.local',
    password: 'admin123',
    phone: '+7 777 000 00 01',
    role: 'admin',
    avatar: '',
    created_at: '2026-06-05T12:00:00.000Z',
  },
];

const ensureDemoUser = () => {
  const users = getStoredUsers();
  const usersByEmail = new Map(
    users.map((storedUser) => [storedUser.email.toLowerCase(), storedUser])
  );
  let hasChanges = false;

  DEFAULT_USERS.forEach((defaultUser) => {
    if (!usersByEmail.has(defaultUser.email.toLowerCase())) {
      usersByEmail.set(defaultUser.email.toLowerCase(), defaultUser);
      hasChanges = true;
    }
  });

  const mergedUsers = Array.from(usersByEmail.values());
  if (hasChanges || users.length === 0) {
    saveStoredUsers(mergedUsers);
  }

  return mergedUsers;
};

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const users = ensureDemoUser();
    const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
    const currentUser = users.find((storedUser) => storedUser.id === currentUserId) || null;

    if (currentUser) {
      localStorage.setItem('userId', currentUser.id);
      localStorage.setItem('authToken', `frontend-token-${currentUser.id}`);
    }

    setUser(currentUser);
    setLoading(false);
  }, []);

  const register = ({ name, email, password }) => {
    const users = ensureDemoUser();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((storedUser) => storedUser.email.toLowerCase() === normalizedEmail)) {
      throw new Error('Аккаунт с таким email уже есть');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'traveler',
      created_at: new Date().toISOString(),
    };

    saveStoredUsers([...users, newUser]);
    return newUser;
  };

  const login = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = ensureDemoUser().find(
      (storedUser) =>
        storedUser.email.toLowerCase() === normalizedEmail &&
        storedUser.password === password
    );

    if (!foundUser) {
      throw new Error('Неверный email или пароль');
    }

    localStorage.setItem(CURRENT_USER_KEY, foundUser.id);
    localStorage.setItem('userId', foundUser.id);
    localStorage.setItem('authToken', `frontend-token-${foundUser.id}`);
    setUser(foundUser);
    return foundUser;
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const updateUser = (updates) => {
    if (!user) {
      throw new Error('Сначала войдите в аккаунт');
    }

    const users = ensureDemoUser();
    const normalizedEmail = updates.email?.trim().toLowerCase();

    if (
      normalizedEmail &&
      users.some(
        (storedUser) =>
          storedUser.id !== user.id &&
          storedUser.email.toLowerCase() === normalizedEmail
      )
    ) {
      throw new Error('Аккаунт с таким email уже есть');
    }

    const updatedUser = {
      ...user,
      ...updates,
      email: normalizedEmail || user.email,
      updated_at: new Date().toISOString(),
    };

    const updatedUsers = users.map((storedUser) =>
      storedUser.id === user.id ? updatedUser : storedUser
    );

    saveStoredUsers(updatedUsers);
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, login, register, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};