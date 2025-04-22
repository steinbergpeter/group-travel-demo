import { type Express } from 'express';
import {
  setupKinde,
  protectRoute,
  getUser,
  type GrantType,
} from '@kinde-oss/kinde-node-express';

export { protectRoute, getUser };

export function configureKinde(app: Express) {
  const config = {
    clientId: process.env.KINDE_CLIENT_ID!,
    issuerBaseUrl: process.env.KINDE_ISSUER_BASE_URL!,
    siteUrl: process.env.KINDE_SITE_URL!, // should be http://localhost:5173
    secret: process.env.KINDE_CLIENT_SECRET!,
    callbackPath: process.env.KINDE_CALLBACK_PATH || '/kinde_callback',
    redirectUrl:
      process.env.KINDE_REDIRECT_URL ||
      `${process.env.KINDE_SITE_URL}/kinde_callback`,
    postLogoutRedirectUrl:
      process.env.KINDE_POST_LOGOUT_REDIRECT_URL || process.env.KINDE_SITE_URL!,
    unAuthorisedUrl:
      process.env.KINDE_UNAUTHORISED_URL || process.env.KINDE_SITE_URL!,
    grantType: 'AUTHORIZATION_CODE' as GrantType.AUTHORIZATION_CODE,
    scope: process.env.KINDE_SCOPE || 'openid profile email',
  };
  setupKinde(config, app);
}
