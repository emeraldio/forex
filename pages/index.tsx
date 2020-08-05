import Head from "next/head";
import styled from "styled-components";

const Wrapper = styled.div`
  background: red;
`;

export default function Home() {
  return (
    <div>
      <Head>
        <title>Forex</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Wrapper>hello world</Wrapper>
    </div>
  );
}
