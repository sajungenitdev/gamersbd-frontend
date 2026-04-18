import { Geist, Lato, Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/shared/Header";
import { ThemeProvider } from "../providers/theme-provider";
import Footer from "../components/shared/footer/Footer";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "react-hot-toast";
import { CartDebug } from "../components/CartDebug";
import { WishlistProvider } from "./contexts/WishlistContext";
import { OrderProvider } from "./contexts/OrderContext";
import { CurrencyProvider } from "./contact/CurrencyContext";
// One line to import and export metadata
export { metadata, viewport } from "../components/metaData/metadata";

// Configure Lato (with multiple weights)
const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
});

// Configure Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${lato.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider>
          <UserAuthProvider>
            <CartProvider>
              <WishlistProvider>
                <OrderProvider>
                  <CurrencyProvider>
                    <Header />
                    {children}
                    <Footer />
                    <Toaster
                      position="bottom-right"
                      toastOptions={{
                        style: {
                          background: "#2A2A2A",
                          color: "#fff",
                          border: "1px solid #3f3f46",
                          borderRadius: "12px",
                        },
                        success: {
                          duration: 3000,
                          iconTheme: {
                            primary: "#10b981",
                            secondary: "#fff",
                          },
                        },
                        error: {
                          duration: 4000,
                          iconTheme: {
                            primary: "#ef4444",
                            secondary: "#fff",
                          },
                        },
                      }}
                    />
                  </CurrencyProvider>
                </OrderProvider>
              </WishlistProvider>
            </CartProvider>
          </UserAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
