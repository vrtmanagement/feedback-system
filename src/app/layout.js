import { Inter } from "next/font/google";
import "./globals.css";
import ToastProvider from '@/components/ToastProvider';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "VRT",
  description: "VRT Management Group, LLC -Feedback and survey system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
