"use client";

import { useEffect, useState } from "react";

const MD_MIN = 768;

/** True when viewport is `md` or wider (Tailwind `md:`). Used to show desktop-only form sections. */
export function useIsMdUp(): boolean {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${MD_MIN}px)`);
    function sync() {
      setOk(mql.matches);
    }
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  return ok;
}
