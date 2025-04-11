import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service'; // Path matches services/

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Typed as AuthService
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};