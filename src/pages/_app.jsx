import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if(theme) setDark(theme === 'dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <>
      <Head>
        <link rel="icon" href="/logo.png" />
      </Head>
      <Header dark={dark} setDark={setDark} />
      <Component {...pageProps} dark={dark} />
      <Footer dark={dark} />
    </>
  );
}