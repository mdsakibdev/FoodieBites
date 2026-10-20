"use client";

import { useEffect, useState } from "react";

/**
 * The current year can only be known at render time, so it is resolved after
 * mount. Rendering it during prerendering is blocked by Cache Components.
 */
export function Copyright() {
  const [year, setYear] = useState<string>("");

  useEffect(() => {
    // Deferred so the value never blocks prerendering.
    const id = window.setTimeout(
      () => setYear(String(new Date().getFullYear())),
      0,
    );
    return () => window.clearTimeout(id);
  }, []);

  return (
    <p>© {year} FoodieBites. All rights reserved.</p>
  );
}
