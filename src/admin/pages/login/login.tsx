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
    <div className="flex min-h-[500px] py-12 w-full items-center justify-center bg-gray-50 border border-gray-200 rounded-xl">
      <Card className="w-full max-w-md shadow-sm border border-gray-200 text-center rounded-xl p-2 bg-white">
        <div className="mb-8 flex flex-col items-center">
          <div className="bg-primary-50 text-primary-500 rounded-full w-16 h-16 flex items-center justify-center mb-4 border border-primary-100">
            <i className="pi pi-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Welcome to Catcher24</h2>
          <p className="text-gray-500 mt-2 text-sm">Securely connect your WordPress site to the platform.</p>
        </div>

        <Button
          label="Sign In to Dashboard"
          icon="pi pi-arrow-right"
          iconPos="right"
          className="w-full p-button-lg"
          onClick={handleSignIn}
          loading={loading}
        />
      </Card>
    </div>
  );
}
