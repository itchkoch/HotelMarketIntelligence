/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
    // make sure the report data ships with the PDF function on Vercel
    outputFileTracingIncludes: { '/reports/[file]': ['./data/**/*', './assets/fonts/**/*'] },
  },
};
