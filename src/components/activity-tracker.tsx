"use client";

import { useEffect } from "react";

import { saveActivity, type ActivitySeed } from "@/lib/watchlist-db";

export function ActivityTracker({ entry }: { entry: ActivitySeed }) {
  useEffect(() => {
    void saveActivity(entry);
  }, [entry]);

  return null;
}