import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";

export default function DashboardAuth({ children }) {
  return (
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      loadingComponent={() => <div>Loading...</div>}
    >
      {children}
    </MsalAuthenticationTemplate>
  );
}
