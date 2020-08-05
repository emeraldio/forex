import { useState, useEffect } from "react";
import Head from "next/head";
import styled, { createGlobalStyle } from "styled-components";
import GoogleFonts from "next-google-fonts";

const Global = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Space Mono', monospace;
  }
`;

const Column = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex-wrap: row wrap;
`;

const FullHeightColumn = styled(Column)`
  height: 100vh;
`;

const Row = styled(Column)`
  flex-direction: row;
  @media only screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

const Padding = styled.div`
  padding: 16px;
`;

const Big = styled.div`
  font-size: 3em;
`;

const Input = `
  font-family: "Space Mono", monospace;
  outline: 0;
  border: 0;
  text-align: center;
  transition: all 0.1s ease;
  border: 1px solid transparent;
  text-overflow: ellipsis ellipsis;
  :hover {
    background: #eee;
  }
  :focus {
    border-color: #eee;
  }
`;

const Amount = styled.input`
  ${Input}
  font-size: 3em;
  margin: 16px 32px;
  width: 100%;
  box-sizing: border-box;
`;

const Currency = styled.select`
  ${Input}
  font-size: 1.2em;
`;

async function getCurrencies() {
  const res = await fetch("https://api.exchangeratesapi.io/latest");
  const json = await res.json();
  return Object.keys(json.rates).sort();
}

async function getHistoricalRates(from, to) {
  const res = await fetch(
    `https://api.exchangeratesapi.io/history?start_at=2020-01-01&end_at=2020-06-04&base=${from}&symbols=${to}`
  );
  const json = await res.json();
  const days = Object.keys(json.rates).sort();
  return days.reduce((map, day) => {
    map[day] = json.rates[day][to];
    return map;
  }, {});
}

export async function getStaticProps(context) {
  return {
    props: {
      currencies: await getCurrencies(),
    },
  };
}

const Layout = ({ children }) => (
  <FullHeightColumn>
    <Head>
      <title>Currency Exchange Rates</title>
      <meta
        name="viewport"
        content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"
      />
    </Head>
    <GoogleFonts href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" />
    <Global />
    {children}
  </FullHeightColumn>
);

export default function Home({ currencies }) {
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState({ currency: "USD", amount: 1 });
  const [to, setTo] = useState({ currency: "GBP", amount: "" });
  const [rates, setRates] = useState(null);

  useEffect(() => {
    setLoading(true);
    getHistoricalRates(from.currency, to.currency).then((rates) => {
      setRates(rates);
      setLoading(false);
    });
  }, [from.currency, to.currency]);

  useEffect(() => {
    if (!rates) {
      return;
    }
    const today = Object.keys(rates).sort().pop();
    const amount = rates[today] * from.amount;
    setTo({ ...to, amount });
  }, [rates, to.amount, from.amount]);

  return (
    <Layout>
      <Row>
        <Column>
          <Amount
            type="number"
            value={from.amount}
            onChange={(e) => setFrom({ ...from, amount: e.target.value })}
          />
          <Currency
            value={from.currency}
            onChange={(e) => setFrom({ ...from, currency: e.target.value })}
          >
            {currencies.map((currency) => (
              <option key={currency}>{currency}</option>
            ))}
          </Currency>
        </Column>

        <Padding>
          <Big>=</Big>
        </Padding>

        <Column>
          <Amount
            readOnly
            disabled={loading}
            value={to.amount}
            onFocus={(e) => e.target.select()}
          />
          <Currency
            value={to.currency}
            onChange={(e) => setTo({ ...to, currency: e.target.value })}
            disabled={loading}
          >
            {currencies.map((currency) => (
              <option key={currency}>{currency}</option>
            ))}
          </Currency>
        </Column>
      </Row>
    </Layout>
  );
}
