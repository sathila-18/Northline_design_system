'use client';

// Build-check fixture, not a component and never exported. scripts/check-directives.mjs builds
// this file with the library settings and checks that 'use client' is still the first statement
// of its output file (DESIGN.md §7.4).
import { useState } from 'react';

export function DirectiveProbe() {
  const [count, setCount] = useState(0);
  return (
    <button
      type="button"
      onClick={() => {
        setCount(count + 1);
      }}
    >
      {count}
    </button>
  );
}
