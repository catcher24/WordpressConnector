import { Button } from "primereact/button";
import { Card } from "primereact/card";

export default function LoginPage() {
  const signInUrl = `${catcher24WordpressConnector.apiUrl}/accounts/signin`;

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-md shadow-lg border border-secondary-light text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Welcome</h2>
          <p className="text-muted-foreground mt-2">Sign in to access your dashboard</p>
        </div>

        <form action={signInUrl} method="GET">
          <Button
            type="submit"
            label="Sign In with OpenID"
            icon="pi pi-external-link"
            className="w-full mt-2"
          />
        </form>
      </Card>
    </div>
  );
}
