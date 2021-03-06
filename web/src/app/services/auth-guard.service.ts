import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { OAuthService } from 'angular-oauth2-oidc';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private oAuthService: OAuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Check for valid tokens
    const hasAccessToken = this.oAuthService.hasValidAccessToken();
    const canActivate = hasAccessToken;

    if (!canActivate) {
      // Store the proposed path
      sessionStorage.setItem(
        environment.signInCompleteReturnPathKey,
        state.url
      );

      // Log the user in
      this.oAuthService.initLoginFlow();
    }

    return canActivate;
  }
}
