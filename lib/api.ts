export const getCurrencies = async () => {
  const res = await fetch("https://api.exchangeratesapi.io/latest");
  const json = await res.json();
  return Object.keys(json.rates).sort();
};

export const getHistoricalRates = async (from, to) => {
  const res = await fetch(
    `https://api.exchangeratesapi.io/history?start_at=2020-01-01&end_at=2020-06-04&base=${from}&symbols=${to}`
  );
  const json = await res.json();
  const days = Object.keys(json.rates).sort();
  return days.reduce((map, day) => {
    map[day] = json.rates[day][to];
    return map;
  }, {});
};
