import { LogLevel, PublicClientApplication } from "@azure/msal-browser";

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MS_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${
      import.meta.env.VITE_MS_TENANT_ID
    }`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Info,
      loggerCallback: (_level, message) => {
        console.log(message);
      },
    },
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
