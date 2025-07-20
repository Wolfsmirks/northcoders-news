const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.formatData = (data) => {
  const order = Object.keys(data[0]);
  return data.map((element) => {
    const converted = this.convertTimestampToDate(element);
    return order.map((key) => converted[key]);
  });
};

exports.generateLookup = (data, firstProp, secondProp) => {
  const lookup = {};
  data.forEach((element) => (lookup[element[firstProp]] = element[secondProp]));
  return lookup;
};
