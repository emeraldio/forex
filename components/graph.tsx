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
import { Column } from "components/layout";

const MaxWidth = styled(Column)`
  width: 512px;
`;

const CustomTooltip = ({ from, to }) => ({ active, payload }) =>
  active && (
    <small>
      On {payload[0].payload.day}, 1 {from} = {payload[0].value} {to}
    </small>
  );

const Graph = ({ from, to, rates }) => {
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
            tickFormatter={(date) => moment(date, "YYYY-MM-DD").format("MMM D")}
            tick={{ fontSize: "12px" }}
          />
          <Area
            dataKey="value"
            stroke="rgba(0, 57, 39, 0.8)"
            fill="rgba(0, 57, 39, 0.2)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </MaxWidth>
  );
};

export default Graph;
