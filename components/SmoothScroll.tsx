"use client";

import { useEffect } from "react";
import { startSmoothScroll } from "@/lib/scroll";

/** Molette lissée, sans calage : pour les pages de cas. */
export function SmoothScroll() {
  useEffect(() => startSmoothScroll(), []);
  return null;
}
