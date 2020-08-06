import { useMemo, ReactElement, Dispatch, SetStateAction } from "react";
import styled from "styled-components";
import moment from "moment";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
} from "recharts";
import { Row, Column } from "components/layout";
import { API_DATE, RateWindow, RateWindows, Rates } from "lib/api";
import { Currency } from "lib/currency";

const MaxWidth = styled(Column)`
  width: 512px;
  @media (max-width: 512px) {
    width: 100%;
    box-sizing: border-box;
    padding-right: 2em;
  }
`;

const RateWindowPill = styled.div<{ active: boolean }>`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 4px;
  margin: 0 4px;
  transition: all 0.1s ease;
  cursor: pointer;
  :hover {
    background: rgba(0, 57, 39, 0.1);
  }

  ${(props) => props.active && `background: rgba(0, 57, 39, 0.2);`}
`;

const CustomTooltip = ({ from, to }: { from: Currency; to: Currency }) => ({
  payload,
}: TooltipProps) =>
  payload &&
  payload[0] && (
    <small>
      On {payload[0].payload.day}, 1 {from} = {payload[0].value} {to}
    </small>
  );

const Graph = ({
  from,
  to,
  rates,
  rateWindow,
  setRateWindow,
}: {
  from: Currency;
  to: Currency;
  rates: Rates;
  rateWindow: RateWindow;
  setRateWindow: Dispatch<SetStateAction<RateWindow>>;
}): ReactElement | null => {
  const graphData = useMemo(() => {
    const days = Object.keys(rates);
    return days.reduce((data, day) => {
      data.push({
        day,
        value: rates[day],
      });
      return data;
    }, [] as { day: string; value: number }[]);
  }, [rates]);

  return (
    <MaxWidth>
      <ResponsiveContainer aspect={4}>
        <AreaChart data={graphData}>
          <Tooltip content={CustomTooltip({ from, to })} />
          <YAxis tick={{ fontSize: "12px" }} />
          <XAxis
            dataKey="day"
            tickFormatter={(date) => moment(date, API_DATE).format("MMM D")}
            tick={{ fontSize: "12px" }}
          />
          <Area
            dataKey="value"
            stroke="rgba(0, 57, 39, 0.8)"
            fill="rgba(0, 57, 39, 0.2)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <Row>
        {Object.keys(RateWindows).map((rw) => (
          <RateWindowPill
            active={rateWindow === RateWindows[rw]}
            key={rw}
            onClick={() => setRateWindow(RateWindows[rw])}
          >
            {rw}
          </RateWindowPill>
        ))}
      </Row>
    </MaxWidth>
  );
};

export default Graph;
