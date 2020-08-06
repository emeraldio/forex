import { useRef, useState, useMemo } from "react";
import styled from "styled-components";
import moment from "moment";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Bar,
  Brush,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Row, Column } from "components/layout";
import { API_DATE, RateWindow } from "lib/api";

const MaxWidth = styled(Column)`
  width: 512px;
  @media (max-width: 512px) {
    width: 100%;
    box-sizing: border-box;
    padding-right: 2em;
  }
`;

const RateWindowPill = styled.div`
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

const CustomTooltip = ({ from, to }) => ({ active, payload }) =>
  active && (
    <small>
      On {payload[0].payload.day}, 1 {from} = {payload[0].value} {to}
    </small>
  );

const Graph = ({ from, to, rates, rateWindow, setRateWindow }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(512);

  const graphData = useMemo(() => {
    if (!rates) {
      return null;
    }
    const days = Object.keys(rates);
    return days.reduce((data, day) => {
      data.push({
        day,
        value: rates[day],
      });
      return data;
    }, []);
  }, [rates]);

  return (
    <MaxWidth>
      <h3>Historical value</h3>

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
        {Object.keys(RateWindow).map((rw) => (
          <RateWindowPill
            active={rateWindow === RateWindow[rw]}
            key={rw}
            onClick={() => setRateWindow(RateWindow[rw])}
          >
            {rw}
          </RateWindowPill>
        ))}
      </Row>
    </MaxWidth>
  );
};

export default Graph;
