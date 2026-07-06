import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const raw = localStorage.getItem('coletaqui_user');

  if (!raw) {
    return router.parseUrl('/admin/login');
  }

  try {
    const user = JSON.parse(raw) as { role?: string };
    return user.role === 'ADMIN' ? true : router.parseUrl('/admin/login');
  } catch {
    return router.parseUrl('/admin/login');
  }
};
