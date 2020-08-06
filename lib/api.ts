import moment from "moment";
import { Currency } from "./currency";

export const API_DATE = "YYYY-MM-DD";
export type RateWindow = "year" | "month" | "week";
export const RateWindows: Record<string, RateWindow> = {
  Year: "year",
  Month: "month",
  Week: "week",
};

export type Rates = { [day: string]: number };

export const getHistoricalRates = async (
  from: Currency,
  to: Currency,
  rateWindow: RateWindow
): Promise<Rates> => {
  const begin = moment().subtract(1, rateWindow).format(API_DATE);
  const today = moment().format(API_DATE);
  const res = await fetch(
    `https://api.exchangeratesapi.io/history?start_at=${begin}&end_at=${today}&base=${from}&symbols=${to}`
  );
  const json = await res.json();
  const days = Object.keys(json.rates).sort();
  return days.reduce((map, day) => {
    map[day] = json.rates[day][to];
    return map;
  }, {} as Record<string, number>);
};
