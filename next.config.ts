import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// Add next-intl plugin
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

export default withNextIntl(nextConfig);
