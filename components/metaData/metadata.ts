// components/metaData/metadata.ts
import { Metadata, Viewport } from "next";

interface SiteConfig {
  name: string;
  shortName?: string;
  url: string;
  ogImage: string;
  description: string;
  keywords: string[];
  twitterHandle: string;
  googleVerification?: string;
  yandexVerification?: string;
  bingVerification?: string;
  facebookAppId?: string;
  themeColor?: string;
  backgroundColor?: string;
  supportEmail?: string;
  supportPhone?: string;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "GamersBD - Your Ultimate Gaming Destination",
  shortName: "GBD",
  url: "https://gamersbd.com",
  ogImage: "https://gamersbd.com/og-image.jpg",
  description:
    "Your ultimate destination for gaming products, accessories, and collectibles in Bangladesh",
  keywords: [
    "gaming",
    "video games",
    "gaming accessories",
    "PlayStation",
    "Xbox",
    "Nintendo",
    "PC gaming",
    "gaming chair",
    "gaming headset",
    "Bangladesh",
  ],
  twitterHandle: "@gamersbd",
  googleVerification: "your-google-verification-code",
  yandexVerification: "your-yandex-verification-code",
  bingVerification: "your-bing-verification-code",
  facebookAppId: "your-facebook-app-id",
  themeColor: "#191919",
  backgroundColor: "#ffffff",
  supportEmail: "support@gamersbd.com",
  supportPhone: "+880123456789",
  address: {
    street: "123 Gaming Street",
    city: "Dhaka",
    region: "Dhaka",
    postalCode: "1000",
    country: "Bangladesh",
  },
};

// ✅ Separate viewport export (required for Next.js 15+)
export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

// ✅ Metadata without themeColor, colorScheme, and viewport
export const metadata: Metadata = {
  // Basic Metadata
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords.join(", "),
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  generator: "Next.js",
  applicationName: siteConfig.name,

  // Format Detection
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Base URL
  metadataBase: new URL(siteConfig.url),

  // Canonical URL
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-us",
      "bn-BD": "/bn-bd",
    },
  },

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: "en_US",
    type: "website",
    countryName: siteConfig.address?.country || "Bangladesh",
    emails: [siteConfig.supportEmail || "support@gamersbd.com"],
    phoneNumbers: [siteConfig.supportPhone || "+880123456789"],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: siteConfig.themeColor,
      },
    ],
  },

  // Manifest for PWA
  manifest: "/manifest.json",

  // Apple Web App
  appleWebApp: {
    capable: true,
    title: siteConfig.shortName || siteConfig.name,
    statusBarStyle: "black-translucent",
    startupImage: [
      {
        url: "/apple-splash-2048-2732.png",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },

  // Verification
  verification: {
    google: siteConfig.googleVerification,
    yandex: siteConfig.yandexVerification,
    other: {
      "facebook-domain-verification": "your-facebook-domain-verification",
    },
  },

  // Category (for robots)
  category: "gaming",

  // Classification
  classification: "Business",

  // Referrer
  referrer: "origin-when-cross-origin",

  // Other useful meta
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "msapplication-TileColor": siteConfig.themeColor || "#191919",
    "msapplication-TileImage": "/ms-icon-144x144.png",
    "msapplication-config": "/browserconfig.xml",
    "og:country-name": siteConfig.address?.country || "Bangladesh",
    "og:region": siteConfig.address?.region || "BD",
    "og:postal-code": siteConfig.address?.postalCode || "1000",
    "og:locality": siteConfig.address?.city || "Dhaka",
    "og:street-address": siteConfig.address?.street || "",
    "og:phone_number": siteConfig.supportPhone || "",
    "og:email": siteConfig.supportEmail || "",
  },
};

// Helper function for dynamic page metadata
export function generatePageMetadata(
  title: string,
  description?: string,
  path?: string,
  image?: string,
): Metadata {
  const url = path ? `${siteConfig.url}${path}` : siteConfig.url;

  return {
    title: `${title} | ${siteConfig.name}`,
    description: description || siteConfig.description,
    alternates: {
      canonical: path || "/",
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description: description || siteConfig.description,
      url: url,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      title: `${title} | ${siteConfig.name}`,
      description: description || siteConfig.description,
      images: image ? [image] : undefined,
    },
  };
}

// Helper for category pages
export function generateCategoryMetadata(
  categoryName: string,
  categoryDescription: string,
  categoryPath: string,
): Metadata {
  return {
    title: `${categoryName} | ${siteConfig.name}`,
    description: categoryDescription,
    alternates: {
      canonical: categoryPath,
    },
    openGraph: {
      title: `${categoryName} | ${siteConfig.name}`,
      description: categoryDescription,
      url: `${siteConfig.url}${categoryPath}`,
      images: [
        {
          url: `${siteConfig.url}/images/categories/${categoryName.toLowerCase().replace(/\s+/g, "-")}.jpg`,
          width: 1200,
          height: 630,
          alt: categoryName,
        },
      ],
    },
  };
}

// Helper for product pages
export function generateProductMetadata(
  productName: string,
  productDescription: string,
  productPath: string,
  productImage?: string,
): Metadata {
  return {
    title: `Buy ${productName} | ${siteConfig.name}`,
    description: productDescription.substring(0, 160),
    alternates: {
      canonical: productPath,
    },
    openGraph: {
      title: `${productName} | ${siteConfig.name}`,
      description: productDescription.substring(0, 160),
      url: `${siteConfig.url}${productPath}`,
      images: productImage ? [{ url: productImage }] : undefined,
    },
  };
}
