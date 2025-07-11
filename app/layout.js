import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProductProvider } from "./context/productcontext";
import { AuthProvider } from "./context/authContext";
import { CartProvider } from "./context/cartContext";
import Footer from "./components/footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata = {
  title: "Hassnain Store - Your One Stop Shop!",
  description: "Welcome to Hassnain Store – Discover amazing deals on fashion, gadgets, and more.",
  keywords: ["ecommerce", "shopping", "hassnain", "online store", "buy online", "pakistan shopping"],
  authors: [{ name: "Hassnain" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.png",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
        <CartProvider>
        <ProductProvider>{children}<Footer /></ProductProvider>
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
