import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('coletaqui_token');
  const raw = localStorage.getItem('coletaqui_user');

  if (!token || !raw) {
    return router.parseUrl('/admin/login');
  }

  try {
    const user = JSON.parse(raw) as { role?: string; status?: string };
    return user.role === 'ADMIN' && user.status === 'ACTIVE' ? true : router.parseUrl('/admin/login');
  } catch {
    return router.parseUrl('/admin/login');
  }
};
