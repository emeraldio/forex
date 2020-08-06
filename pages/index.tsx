import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import styled from "styled-components";
import { validateFloat } from "lib/util";
import { getHistoricalRates, getCurrencies } from "lib/api";
import CURRENCIES from "lib/currency";
import Layout, { Row, Column } from "components/layout";
import Graph from "components/graph";

const Logo = styled.h1`
  font-size: 3em;
  margin-bottom: 0;
`;

const Flip = styled.div`
  padding: 16px;
  font-size: 2em;
  cursor: ew-resize;
  user-select: none;
`;

const Input = `
  font-family: "Space Mono", monospace;
  color: rgba(0, 0, 0, 0.8);
  outline: 0;
  border: 0;
  text-align: center;
  transition: all 0.1s ease;
  border: 1px solid transparent;
  text-overflow: ellipsis ellipsis;
  :hover {
    background: rgba(0, 0, 0, 0.05);
  }
  :focus {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const Amount = styled.input`
  ${Input}
  font-size: 2em;
  margin: 16px 32px;
  width: 256px;
  box-sizing: border-box;
`;

const Currency = styled.select`
  ${Input}
  font: inherit;
  appearance: none;
  cursor: pointer;
`;

const Home = () => {
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

  const handleFlip = useCallback(() => {
    const newFrom = to.currency;
    setTo({ ...to, currency: from.currency });
    setFrom({ ...from, currency: newFrom });
  }, [from, to]);

  return (
    <Layout>
      <Column>
        <Logo>💸</Logo>
        <h2>Currency Converter</h2>
      </Column>

      <Column>
        <Row>
          <Column>
            <Amount
              value={from.amount}
              onChange={(e) =>
                validateFloat(e.target.value) &&
                setFrom({ ...from, amount: e.target.value })
              }
            />
            <Currency
              value={from.currency}
              onChange={(e) => setFrom({ ...from, currency: e.target.value })}
            >
              {Object.keys(CURRENCIES).map((currency) => (
                <option key={currency} value={currency}>
                  {currency} {CURRENCIES[currency]}
                </option>
              ))}
            </Currency>
          </Column>

          <Flip onClick={handleFlip}>=</Flip>

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
              {Object.keys(CURRENCIES).map((currency) => (
                <option key={currency} value={currency}>
                  {currency} {CURRENCIES[currency]}
                </option>
              ))}
            </Currency>
          </Column>
        </Row>
      </Column>

      {rates && <Graph from={from.currency} to={to.currency} rates={rates} />}
    </Layout>
  );
};

export default Home;
export const getStaticProps = async (context) => ({
  props: {
    currencies: await getCurrencies(),
  },
});
