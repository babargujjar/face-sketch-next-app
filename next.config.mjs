const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Apply middleware to all routes
  matcher: ["/((?!_next|favicon.ico|auth).*)"],
};

export default nextConfig;
