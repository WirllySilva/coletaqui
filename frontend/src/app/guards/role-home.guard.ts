import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

interface StoredUser {
  role?: 'COMMON_USER' | 'COLLECTOR' | 'ADMIN';
  status?: 'ACTIVE' | 'PENDING_APPROVAL' | 'INACTIVE' | 'BLOCKED';
}

export const commonHomeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = currentUser();
  const role = user?.role ?? null;

  if (!role) {
    return router.parseUrl('/loginselectionpage');
  }

  if (role === 'COLLECTOR') {
    return user?.status === 'ACTIVE' ? router.parseUrl('/collector-home') : router.parseUrl('/collector-pending');
  }

  if (role === 'ADMIN') {
    return router.parseUrl('/admin/dashboard');
  }

  return true;
};

export const commonUserGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = currentUser();
  const role = user?.role ?? null;

  if (!role) {
    return router.parseUrl('/loginselectionpage');
  }

  if (role === 'ADMIN') {
    return router.parseUrl('/admin/dashboard');
  }

  if (role === 'COLLECTOR') {
    return user?.status === 'ACTIVE' ? router.parseUrl('/collector-home') : router.parseUrl('/collector-pending');
  }

  return user?.status === 'ACTIVE' ? true : router.parseUrl('/loginselectionpage');
};

export const collectorHomeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = currentUser();
  const role = user?.role ?? null;

  if (!role) {
    return router.parseUrl('/loginselectionpage');
  }

  if (role && role !== 'COLLECTOR') {
    return router.parseUrl(role === 'ADMIN' ? '/admin/dashboard' : '/home');
  }

  if (role === 'COLLECTOR' && user?.status !== 'ACTIVE') {
    return router.parseUrl('/collector-pending');
  }

  return true;
};

export const collectorAccountGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = currentUser();
  const role = user?.role ?? null;

  if (!role) {
    return router.parseUrl('/loginselectionpage');
  }

  if (role === 'ADMIN') {
    return router.parseUrl('/admin/dashboard');
  }

  if (role === 'COMMON_USER') {
    return router.parseUrl('/home');
  }

  return true;
};

export const authenticatedAppGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = currentUser();
  const role = user?.role ?? null;

  if (!role) {
    return router.parseUrl('/loginselectionpage');
  }

  if (role === 'ADMIN') {
    return router.parseUrl('/admin/dashboard');
  }

  if (role === 'COLLECTOR' && user?.status !== 'ACTIVE') {
    return router.parseUrl('/collector-pending');
  }

  return true;
};

function currentUser(): StoredUser | null {
  const storedUser = localStorage.getItem('coletaqui_user');

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as StoredUser;
  } catch {
    return null;
  }
}
