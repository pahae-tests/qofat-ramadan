import "@/styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

export default function MyApp({ Component, pageProps }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if(theme) setDark(theme === 'dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <>
      <Header dark={dark} setDark={setDark} />
      <Component {...pageProps} dark={dark} />
      <Footer dark={dark} />
    </>
  );

}
