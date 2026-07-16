import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Batasi tracing root ke parent directory (monorepo root) agar sama dengan turbopack.root
  outputFileTracingRoot: path.resolve(__dirname, '..'),
  ...(process.env.NODE_ENV === 'development' && {
    turbopack: {
      root: path.resolve(__dirname, '..')
    }
  })
};

export default nextConfig;
