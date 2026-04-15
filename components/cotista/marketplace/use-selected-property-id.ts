"use client";

import { useEffect, useState } from "react";

export function useSelectedPropertyId(): string | null {
  const [propertyId, setPropertyId] = useState<string | null>(null);

  useEffect(() => {
    const read = () => setPropertyId(localStorage.getItem("selectedPropertyId"));
    read();
    const onEvt = () => read();
    window.addEventListener("propertyChanged", onEvt);
    window.addEventListener("storage", onEvt);
    return () => {
      window.removeEventListener("propertyChanged", onEvt);
      window.removeEventListener("storage", onEvt);
    };
  }, []);

  return propertyId;
}
