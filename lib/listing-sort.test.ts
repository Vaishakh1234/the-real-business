import { describe, expect, it } from "vitest";
import {
  LISTING_SORT_VALUES,
  normalizeListingSortParam,
  type ListingSortValue,
} from "./listing-sort";

describe("normalizeListingSortParam", () => {
  it.each(LISTING_SORT_VALUES)(
    "accepts valid API sort value %s",
    (value: ListingSortValue) => {
      expect(normalizeListingSortParam(value)).toBe(value);
    },
  );

  it("defaults invalid or empty values to newest", () => {
    expect(normalizeListingSortParam(null)).toBe("newest");
    expect(normalizeListingSortParam(undefined)).toBe("newest");
    expect(normalizeListingSortParam("")).toBe("newest");
    expect(normalizeListingSortParam("bogus")).toBe("newest");
    expect(normalizeListingSortParam("PRICE_ASC")).toBe("newest");
  });

  it("LISTING_SORT_VALUES matches public sort options count", () => {
    expect(LISTING_SORT_VALUES).toHaveLength(4);
  });
});
