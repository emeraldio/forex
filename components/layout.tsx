import Head from "next/head";
import styled, { createGlobalStyle } from "styled-components";
import GoogleFonts from "next-google-fonts";

const Global = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Space Mono', monospace;
    color: rgba(26, 57, 39, 0.9);
  }
  h1, h2, h3 {
    font-family: 'Lora', serif;
  }
`;

export const Column = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  flex-wrap: row wrap;
`;

export const Row = styled(Column)`
  flex-direction: row;
  @media only screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

const FullHeightColumn = styled(Column)`
  height: 100vh;
`;

const Layout = ({ children }) => (
  <FullHeightColumn>
    <Head>
      <title>Currency Converter</title>
      <meta
        name="viewport"
        content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"
      />
    </Head>
    <GoogleFonts href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" />
    <GoogleFonts href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap" />
    <Global />
    {children}
  </FullHeightColumn>
);

export default Layout;
