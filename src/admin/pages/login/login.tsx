import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useState, useEffect } from "react";
import { apiFetch } from "../../utils/api-fetch";
import { useNavigate } from "react-router-dom";
import Logo from "../../icons/Logo";

export default function LoginPage() {
  const [loadingSignIn, setLoadingSignIn] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check if we already tried the silent redirect on this load to prevent loops
    const silentChecked = sessionStorage.getItem("catcher24_silent_checked");
    if (silentChecked === "1") {
      sessionStorage.removeItem("catcher24_silent_checked");
      setCheckingSession(false);
      return;
    }

    const checkSession = async () => {
      // Set the flag to prevent infinite loops before redirecting
      sessionStorage.setItem("catcher24_silent_checked", "1");

      try {
        // @ts-ignore
        const response = await window.fetch(`${catcher24Connector.apiUrl}/accounts/signin?silent=1`, {
          headers: {
            // @ts-ignore
            "X-WP-Nonce": catcher24Connector.nonce || "",
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.redirect_url) {
            // Perform top-level silent redirect to Keycloak (bypasses third-party cookie restrictions)
            window.location.href = data.redirect_url;
            return;
          }
        }
      } catch (error) {
        console.error("Top-level silent check failed", error);
      }
      
      // If signin request failed or returned no redirect URL, disable loader
      sessionStorage.removeItem("catcher24_silent_checked");
      setCheckingSession(false);
    };

    checkSession();
  }, [navigate]);

  const handleSignIn = async () => {
    setLoadingSignIn(true);
    try {
      // @ts-ignore
      const response = await apiFetch(`${catcher24Connector.apiUrl}/accounts/signin`);
      const data = await response.json();

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        console.error("No redirect URL received");
        setLoadingSignIn(false);
      }
    } catch (error) {
      console.error("Sign-in request failed", error);
      setLoadingSignIn(false);
    }
  };

  const handleRegister = async () => {
    setLoadingRegister(true);
    try {
      // @ts-ignore
      const response = await apiFetch(`${catcher24Connector.apiUrl}/accounts/register`);
      const data = await response.json();

      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        console.error("No redirect URL received");
        setLoadingRegister(false);
      }
    } catch (error) {
      console.error("Register request failed", error);
      setLoadingRegister(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex flex-col min-h-[600px] py-12 w-full items-center justify-center bg-gray-50 border border-gray-200 rounded-xl">
        <div className="mb-8 animate-pulse">
          <Logo className="h-10 w-auto" />
        </div>
        <div className="flex flex-col items-center gap-4 text-center p-8 bg-white rounded-xl border border-gray-200 shadow-sm max-w-sm w-full">
          <i className="pi pi-spin pi-spinner text-primary-500 text-3xl"></i>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Checking for active session...</h3>
            <p className="text-sm text-gray-500 mt-1">Connecting to Catcher24 security gateway</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[600px] py-12 w-full items-center justify-center bg-gray-50 border border-gray-200 rounded-xl">
      <div className="mb-8">
        <Logo className="h-10 w-auto" />
      </div>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 p-4">

        {/* Register / Sales Front */}
        <Card className="shadow-sm border border-gray-200 rounded-xl p-2 bg-white flex flex-col h-full">
          <div className="mb-6 flex flex-col">
            <div className="bg-primary-50 text-primary-500 rounded-full w-12 h-12 flex items-center justify-center mb-4 border border-primary-100">
              <i className="pi pi-shield text-xl"></i>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">New to Catcher24?</h2>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Protect your WordPress site with enterprise-grade security. Join Catcher24 to get continuous vulnerability scanning, automated reports, and instant threat alerts.
            </p>

            <ul className="mt-6 space-y-3">
              <li className="flex items-center text-sm text-gray-700">
                <i className="pi pi-check-circle text-green-500 mr-2"></i> Continuous Vulnerability Scanning
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <i className="pi pi-check-circle text-green-500 mr-2"></i> Automated Security Reports
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <i className="pi pi-check-circle text-green-500 mr-2"></i> Instant Threat Alerts
              </li>
            </ul>
          </div>

          <div className="mt-auto pt-6">
            <Button
              label="Create an Account"
              icon="pi pi-user-plus"
              className="w-full p-button-lg"
              onClick={handleRegister}
              loading={loadingRegister}
              disabled={loadingSignIn}
            />
          </div>
        </Card>

        {/* Sign In / Connect */}
        <Card className="shadow-sm border border-gray-200 rounded-xl p-2 bg-white flex flex-col h-full">
          <div className="mb-6 flex flex-col">
            <div className="bg-gray-100 text-gray-600 rounded-full w-12 h-12 flex items-center justify-center mb-4 border border-gray-200">
              <i className="pi pi-link text-xl"></i>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Already have an account?</h2>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Connect this WordPress site to your existing Catcher24 dashboard to manage it alongside your other protected environments.
            </p>
          </div>

          <div className="mt-auto pt-6">
            <Button
              label="Sign In & Connect"
              icon="pi pi-arrow-right"
              iconPos="right"
              severity="secondary"
              outlined
              className="w-full p-button-lg bg-white"
              onClick={handleSignIn}
              loading={loadingSignIn}
              disabled={loadingRegister}
            />
          </div>
        </Card>

      </div>
    </div>
  );
}
