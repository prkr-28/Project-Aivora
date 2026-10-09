import { useEffect, useRef, useState } from "react";

const GOOGLE_SCRIPT_ID = "google-identity-services";

export function GoogleSignInButton({
  onCredential,
  onUnavailable,
  disabled = false,
}) {
  const buttonRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(
    () => typeof window !== "undefined" && Boolean(window.google),
  );
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || typeof window === "undefined") {
      return undefined;
    }

    if (window.google) {
      setScriptReady(true);
      return undefined;
    }

    let script = document.getElementById(GOOGLE_SCRIPT_ID);
    const handleLoad = () => setScriptReady(true);

    if (!script) {
      script = document.createElement("script");
      script.id = GOOGLE_SCRIPT_ID;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    script.addEventListener("load", handleLoad);
    return () => script.removeEventListener("load", handleLoad);
  }, [clientId]);

  useEffect(() => {
    if (!scriptReady || !clientId || !buttonRef.current || !window.google) {
      return;
    }

    buttonRef.current.replaceChildren();
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: ({ credential }) => onCredential(credential),
    });
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rect",
      width: buttonRef.current.clientWidth || 380,
    });
  }, [clientId, onCredential, scriptReady]);

  return (
    <>
      {clientId ? (
        <div
          ref={buttonRef}
          aria-disabled={disabled}
          className={`flex min-h-10 justify-center overflow-hidden rounded-xl ${
            disabled ? "pointer-events-none opacity-60" : ""
          }`}
        />
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            onUnavailable?.(
              "Google sign-in is not configured. Add VITE_GOOGLE_CLIENT_ID to frontend/.env and restart the frontend.",
            )
          }
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-border/70 bg-background/60 text-sm font-medium shadow-sm transition-all hover:border-primary/30 hover:bg-background/80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      )}
    </>
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z"
      />
      <path
        fill="#34A853"
        d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.6Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.68A5.86 5.86 0 0 1 6.23 12c0-.58.1-1.15.31-1.68V7.79H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.21l3.24-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.29c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.37 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 8.01 9.46 6.29 12 6.29Z"
      />
    </svg>
  );
}
