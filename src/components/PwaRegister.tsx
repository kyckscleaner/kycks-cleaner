"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // enregistrement du service worker échoué, l'app reste utilisable en ligne
      });
    }
  }, []);

  return null;
}
