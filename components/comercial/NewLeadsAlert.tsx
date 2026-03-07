"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { beep } from "@/lib/ui/beep";

const STORAGE_LAST_SEEN = "crm:lastSeenLeadCreatedAt";
const STORAGE_SOUND = "crm:soundEnabled";
const POLL_MS = 15000;

type LeadItem = { id: string; createdAt: string };

function getStoredLastSeen(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_LAST_SEEN);
}

function setStoredLastSeen(iso: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_LAST_SEEN, iso);
}

function getStoredSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_SOUND) === "true";
}

function setStoredSoundEnabled(on: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_SOUND, String(on));
}

export function NewLeadsAlert() {
  const [newCount, setNewCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const prevCountRef = useRef(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    setSoundEnabled(getStoredSoundEnabled());
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchAndCount = async () => {
      try {
        const res = await fetch("/api/crm/leads?status=ACTIVE&limit=20&sort=createdAt");
        if (!res.ok || !mounted) return;
        const data = (await res.json()) as LeadItem[];
        const leads = Array.isArray(data) ? data : [];
        const lastSeen = getStoredLastSeen();

        if (!initializedRef.current) {
          initializedRef.current = true;
          const maxCreated = leads.length
            ? new Date(Math.max(...leads.map((l) => new Date(l.createdAt).getTime()))).toISOString()
            : new Date().toISOString();
          setStoredLastSeen(maxCreated);
          prevCountRef.current = 0;
          setNewCount(0);
          return;
        }

        if (!lastSeen) {
          const maxCreated = leads.length
            ? new Date(Math.max(...leads.map((l) => new Date(l.createdAt).getTime()))).toISOString()
            : new Date().toISOString();
          setStoredLastSeen(maxCreated);
          setNewCount(0);
          return;
        }

        const lastSeenTime = new Date(lastSeen).getTime();
        const count = leads.filter((l) => new Date(l.createdAt).getTime() > lastSeenTime).length;
        setNewCount(count);

        if (count > 0 && soundEnabled && count > prevCountRef.current) {
          beep();
          try {
            await fetch("/api/crm/track-client-event", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "crm.new_leads.alerted", meta: { count } }),
            });
          } catch {
            // ignore
          }
        }
        prevCountRef.current = count;
      } catch {
        // ignore
      }
    };

    fetchAndCount();
    const interval = setInterval(fetchAndCount, POLL_MS);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [soundEnabled]);

  const handleMarkSeen = async () => {
    try {
      const res = await fetch("/api/crm/leads?status=ACTIVE&limit=20&sort=createdAt");
      if (!res.ok) return;
      const data = (await res.json()) as LeadItem[];
      const leads = Array.isArray(data) ? data : [];
      const maxCreated = leads.length
        ? new Date(Math.max(...leads.map((l) => new Date(l.createdAt).getTime()))).toISOString()
        : new Date().toISOString();
      setStoredLastSeen(maxCreated);
      setNewCount(0);
      prevCountRef.current = 0;
    } catch {
      // ignore
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    setStoredSoundEnabled(next);
    if (next) toast.success("Som ativado");
  };

  return (
    <div className="flex items-center gap-2">
      {newCount > 0 && (
        <>
          <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-medium text-white">
            Novos: {newCount}
          </span>
          <Button type="button" variant="ghost" size="sm" className="h-8 text-xs" onClick={handleMarkSeen}>
            Marcar como vistos
          </Button>
        </>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={toggleSound}
        title={soundEnabled ? "Desativar som de novos leads" : "Ativar som de novos leads"}
      >
        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
      </Button>
    </div>
  );
}
