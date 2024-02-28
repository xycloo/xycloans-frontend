import { Inter } from "next/font/google";
import "./globals.css";
import { CookiesProvider } from 'next-client-cookies/server';
import AppNavbar from "./components/nav";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "xycLoans WebApp",
  description: "Interface for the xycLoans protocol on Soroban.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CookiesProvider>
          <AppNavbar />
          {children}
        </CookiesProvider>
      </body>
    </html>
  );
}

export const runtime = 'edge'