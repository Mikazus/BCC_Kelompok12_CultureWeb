const AUTH_TOKEN_COOKIE_NAME = "kalcer_auth_token";

const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 8;
const REMEMBER_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const canUseDocument = () => typeof document !== "undefined";

export const setAuthTokenCookie = (token: string, rememberMe: boolean) => {
  if (!canUseDocument()) {
    return;
  }

  const maxAge = rememberMe ? REMEMBER_COOKIE_MAX_AGE_SECONDS : SESSION_COOKIE_MAX_AGE_SECONDS;

  document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; samesite=lax`;
};

export const getAuthTokenCookie = () => {
  if (!canUseDocument()) {
    return null;
  }

  const cookieValue = document.cookie
    .split(";")
    .map((cookiePart) => cookiePart.trim())
    .find((cookiePart) => cookiePart.startsWith(`${AUTH_TOKEN_COOKIE_NAME}=`));

  if (!cookieValue) {
    return null;
  }

  return decodeURIComponent(cookieValue.split("=")[1] || "");
};

export const clearAuthTokenCookie = () => {
  if (!canUseDocument()) {
    return;
  }

  document.cookie = `${AUTH_TOKEN_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
};
