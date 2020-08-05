import { useState, useEffect } from "react";
import Head from "next/head";
import styled from "styled-components";

const Flex = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const Row = styled(Flex)`
  flex-direction: row;
`;

async function getCurrencies() {
  const res = await fetch("https://api.exchangeratesapi.io/latest");
  const json = await res.json();
  return Object.keys(json.rates).sort();
}

async function getHistoricalRates(from, to, amount) {
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

export default function Home({ currencies }) {
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState({ currency: "USD", amount: 1 });
  const [to, setTo] = useState({ currency: "GBP", amount: null });
  const [rates, setRates] = useState(null);

  useEffect(() => {
    setLoading(true);
    getHistoricalRates(from.currency, to.currency, from.amount).then(
      (rates) => {
        setRates(rates);
        setLoading(false);
      }
    );
  }, [from.currency, to.currency]);

  useEffect(() => {
    if (!rates) {
      return;
    }
    const today = Object.keys(rates).sort().pop();
    const amount = rates[today];
    setTo({ ...to, amount });
  }, [rates, to.currency, from.amount]);

  return (
    <Flex>
      <Head>
        <title>Currency Exchange Rates</title>
      </Head>

      <Row>
        <div>{from.amount}</div>
        <select
          value={from.currency}
          onChange={(e) => setFrom({ ...from, currency: e.target.value })}
        >
          {currencies.map((currency) => (
            <option key={currency}>{currency}</option>
          ))}
        </select>
      </Row>

      <Row>
        <div>{to.amount}</div>
        <select
          value={to.currency}
          onChange={(e) => setTo({ ...to, currency: e.target.value })}
        >
          {currencies.map((currency) => (
            <option key={currency}>{currency}</option>
          ))}
        </select>
      </Row>
    </Flex>
  );
}
