// The check runs in a copy of this folder (see scripts/nextjs-check.mjs); keep Next.js inside that folder.
const config = {
  turbopack: { root: import.meta.dirname },
  outputFileTracingRoot: import.meta.dirname,
};

export default config;
