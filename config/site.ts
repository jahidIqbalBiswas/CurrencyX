export const siteConfig = {
  name: "CurrencyX",
  description:
    "Professional USD to BDT currency converter with real-time exchange rates and admin-controlled manual rates.",
  url: "https://currencyx.vercel.app",
  ogImage: "/og-image.png",
  author: "CurrencyX Team",
  keywords: [
    "currency converter",
    "USD to BDT",
    "BDT to USD",
    "exchange rate",
    "Bangladesh Taka",
    "US Dollar",
    "live exchange rate",
  ],
  links: {
    github: "https://github.com/currencyx",
  },
} as const;

export type SiteConfig = typeof siteConfig;
