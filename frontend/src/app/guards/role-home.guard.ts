import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

interface StoredUser {
  role?: 'COMMON_USER' | 'COLLECTOR' | 'ADMIN';
}

export const commonHomeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const role = currentRole();

  if (role === 'COLLECTOR') {
    return router.parseUrl('/collector-home');
  }

  return true;
};

export const collectorHomeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const role = currentRole();

  if (role && role !== 'COLLECTOR') {
    return router.parseUrl('/home');
  }

  return true;
};

function currentRole(): StoredUser['role'] | null {
  const storedUser = localStorage.getItem('coletaqui_user');

  if (!storedUser) {
    return null;
  }

  try {
    return (JSON.parse(storedUser) as StoredUser).role ?? null;
  } catch {
    return null;
  }
}
