import moment from "moment";

export const API_DATE = "YYYY-MM-DD";
export enum RateWindow {
  Year = "year",
  Month = "month",
  Week = "week",
}

export const getHistoricalRates = async (from, to, window) => {
  const begin = moment().subtract(1, window).format(API_DATE);
  const today = moment().format(API_DATE);
  const res = await fetch(
    `https://api.exchangeratesapi.io/history?start_at=${begin}&end_at=${today}&base=${from}&symbols=${to}`
  );
  const json = await res.json();
  const days = Object.keys(json.rates).sort();
  return days.reduce((map, day) => {
    map[day] = json.rates[day][to];
    return map;
  }, {});
};
