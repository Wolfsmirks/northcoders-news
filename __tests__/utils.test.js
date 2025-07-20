const { convertTimestampToDate, formatData } = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("formatData", () => {
  test("returns a new array", () => {
    const input = [{ key: "value" }];
    const result = formatData(input);
    expect(result).not.toBe(input);
    expect(result).toBeArray();
  });
  test("returns a multidimensional array", () => {
    const input = [
      { key1: "value1", key2: "value2" },
      { key1: "value1", key2: "value2" },
    ];
    const result = formatData(input);
    expect(result.every(Array.isArray)).toBe(true);
  });
  test("formats data into arrays of property values", () => {
    const input = [
      { key1: "value1", key2: "value2" },
      { key1: "value1", key2: "value2" },
    ];
    const expected = [
      ["value1", "value2"],
      ["value1", "value2"],
    ];
    const result = formatData(input);
    expect(expected).toEqual(result);
  });
  test("does not mutate the input", () => {
    const input = [{ key: "value" }];
    formatData(input);
    const control = [{ key: "value" }];
    expect(input).toEqual(control);
  });
});
