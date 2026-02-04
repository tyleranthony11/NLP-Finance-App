import { msalInstance } from "./msalConfig";

const API_SCOPES = [
  "api://9c8d440e-be06-46ad-b07e-9497fe694cc9/access_as_user",
];

export async function authFetch(url, options = {}) {
  const accounts = msalInstance.getAllAccounts();
  const account = accounts[0];

  if (!account) {
    throw new Error("No signed-in account found");
  }

  let tokenResponse;
  try {
    tokenResponse = await msalInstance.acquireTokenSilent({
      account,
      scopes: API_SCOPES,
    });
  } catch {
    await msalInstance.acquireTokenRedirect({
      account,
      scopes: API_SCOPES,
    });
    return;
  }

  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${tokenResponse.accessToken}`);

  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, { ...options, headers });
}
