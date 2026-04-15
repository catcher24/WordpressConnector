import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${catcher24WordpressConnector.apiUrl}/accounts/signin`);
      const data = await response.json();

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        console.error("No redirect URL received");
        setLoading(false);
      }
    } catch (error) {
      console.error("Sign-in request failed", error);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="w-full max-w-md shadow-lg border border-secondary-light text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Welcome</h2>
          <p className="text-muted-foreground mt-2">Sign in to access your dashboard</p>
        </div>

        <Button
          label="Sign In"
          icon="pi pi-external-link"
          className="w-full mt-2"
          onClick={handleSignIn}
          loading={loading}
        />
      </Card>
    </div>
  );
}
