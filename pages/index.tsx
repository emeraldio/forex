import { ReactElement, useState, useEffect, useCallback } from "react";
import Head from "next/head";
import styled from "styled-components";
import { validateFloat } from "lib/util";
import { getHistoricalRates, RateWindow, RateWindows, Rates } from "lib/api";
import CURRENCIES, { Currency } from "lib/currency";
import Layout, { Row, Column } from "components/layout";
import Graph from "components/graph";

const Logo = styled.span`
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
  border-radius: 4px;
  text-overflow: ellipsis ellipsis;
  :hover {
    background: rgba(0, 57, 39, 0.1);
  }
  :focus {
    background: rgba(0, 57, 39, 0.2);
  }
`;

const AmountInput = styled.input`
  ${Input}
  font-size: 2em;
  margin: 16px 32px;
  width: 256px;
  box-sizing: border-box;
`;

const CurrencyDropdown = styled.select`
  ${Input}
  font: inherit;
  appearance: none;
  cursor: pointer;
  :focus {
    background: none;
  }
`;

type Side = {
  currency: Currency;
  amount: number | null;
};

const Home = (): ReactElement => {
  const params = new URLSearchParams(
    typeof window === "undefined" ? {} : window.location.search
  );
  const [rates, setRates] = useState<Rates | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [from, setFrom] = useState<Side>({
    currency: (params.get("from") || "USD") as Currency,
    amount: parseFloat(params.get("amount") || "1"),
  });
  const [to, setTo] = useState<Side>({
    currency: (params.get("to") || "GBP") as Currency,
    amount: null,
  });
  const [rateWindow, setRateWindow] = useState<RateWindow>(
    (params.get("rateWindow") as RateWindow) || RateWindows.Year
  );

  useEffect(() => {
    setLoading(true);
    getHistoricalRates(from.currency, to.currency, rateWindow).then((rates) => {
      setRates(rates);
      setLoading(false);
    });
  }, [from.currency, to.currency, rateWindow]);

  useEffect(() => {
    if (!rates || !from.amount) {
      return;
    }
    const today = Object.keys(rates).sort().pop();
    const rawAmount = rates[today as string] * from.amount;
    // if the number is whole, use that
    // otherwise truncate to 4 decimal points
    const amount =
      Math.ceil(rawAmount) === rawAmount
        ? rawAmount
        : parseFloat(rawAmount.toFixed(4));
    setTo({ ...to, amount });
  }, [rates, to.amount, from.amount]);

  useEffect(() => {
    const params = new URLSearchParams({
      from: from.currency,
      to: to.currency,
      amount: String(from.amount),
      rateWindow,
    });
    window.history.pushState(
      null,
      "",
      decodeURIComponent(`${window.location.pathname}?${params}`)
    );
  }, [from.currency, to.currency, from.amount, rateWindow]);

  const handleFlip = useCallback(() => {
    const newFrom = to.currency;
    setTo({ ...to, currency: from.currency });
    setFrom({ ...from, currency: newFrom });
  }, [from, to]);

  return (
    <Layout>
      <Head>
        <title>
          Convert {from.currency} to {to.currency}
        </title>
      </Head>
      <Column>
        <Logo>💸</Logo>
        <h2>Currency Converter</h2>
      </Column>

      <Column>
        <Row>
          <Column>
            <AmountInput
              value={from.amount || ""}
              onChange={(e) =>
                validateFloat(e.target.value) &&
                setFrom({ ...from, amount: parseFloat(e.target.value) })
              }
            />
            <CurrencyDropdown
              value={from.currency}
              onChange={(e) =>
                setFrom({ ...from, currency: e.target.value as Currency })
              }
            >
              {Object.keys(CURRENCIES).map((currency) => (
                <option key={currency} value={currency}>
                  {currency} {CURRENCIES[currency as Currency]}
                </option>
              ))}
            </CurrencyDropdown>
          </Column>

          <Flip onClick={handleFlip}>≈</Flip>

          <Column>
            <AmountInput
              readOnly
              disabled={loading}
              value={to.amount || ""}
              onFocus={(e) => e.target.select()}
            />
            <CurrencyDropdown
              value={to.currency}
              onChange={(e) =>
                setTo({ ...to, currency: e.target.value as Currency })
              }
              disabled={loading}
            >
              {Object.keys(CURRENCIES).map((currency) => (
                <option key={currency} value={currency}>
                  {currency} {CURRENCIES[currency as Currency]}
                </option>
              ))}
            </CurrencyDropdown>
          </Column>
        </Row>
      </Column>

      {rates && (
        <Graph
          from={from.currency}
          to={to.currency}
          rates={rates}
          rateWindow={rateWindow}
          setRateWindow={setRateWindow}
        />
      )}
    </Layout>
  );
};

export default Home;
