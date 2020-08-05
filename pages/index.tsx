import { useState, useEffect } from "react";
import styled from "styled-components";
import Layout, { Row, Column } from "components/layout";
import { getHistoricalRates, getCurrencies } from "lib/api";

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

export const getStaticProps = async (context) => ({
  props: {
    currencies: await getCurrencies(),
  },
});

export default function Home({ currencies }) {
  const params = new URLSearchParams(
    typeof window !== "undefined" && window.location.search
  );
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState({
    currency: params.get("from") || "USD",
    amount: params.get("amount") || 1,
  });
  const [to, setTo] = useState({
    currency: params.get("to") || "GBP",
    amount: "",
  });
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

  useEffect(() => {
    const params = new URLSearchParams({
      from: from.currency,
      to: to.currency,
      amount: from.amount,
    });
    window.history.pushState(
      null,
      "",
      decodeURIComponent(`${window.location.pathname}?${params}`)
    );
  }, [from.currency, to.currency, from.amount]);

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
