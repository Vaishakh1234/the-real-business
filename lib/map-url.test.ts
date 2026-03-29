import { describe, expect, it } from "vitest";
import {
  parseLatLngFromGoogleMapsUrlString,
  propertyMapIframeSrc,
  toIframeMapSrc,
} from "./map-url";

describe("parseLatLngFromGoogleMapsUrlString", () => {
  it("reads @lat,lng from /place/ share-style URLs", () => {
    const u =
      "https://www.google.com/maps/place/Mumbai,+Maharashtra/@19.076,72.8777,15z";
    expect(parseLatLngFromGoogleMapsUrlString(u)).toEqual({
      lat: 19.076,
      lng: 72.8777,
    });
  });

  it("reads q=lat,lng", () => {
    expect(
      parseLatLngFromGoogleMapsUrlString("https://www.google.com/maps?q=12.97,77.59"),
    ).toEqual({ lat: 12.97, lng: 77.59 });
  });
});

describe("toIframeMapSrc", () => {
  it("rewrites coordinate share links to OpenStreetMap embed", () => {
    const src = toIframeMapSrc(
      "https://www.google.com/maps/place/Test/@10.5,76.25,14z",
    );
    expect(src).toContain("openstreetmap.org/export/embed.html");
    expect(src).toContain("marker=10.5%2C76.25");
  });

  it("leaves official Google embed URLs unchanged", () => {
    const embed =
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022!2d-73.98!3d40.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM0MywrDE5JzM2LjAiTiA3M8KwNTcnMjQuMCJX!5e0!3m2!1sen!2sus!4v1!5m2!1sen!2sus";
    expect(toIframeMapSrc(embed)).toBe(embed);
  });
});

describe("propertyMapIframeSrc", () => {
  it("uses listing coordinates when map URL is only a short link", () => {
    const src = propertyMapIframeSrc("https://maps.app.goo.gl/abc123", 10.85, 76.27);
    expect(src).toContain("openstreetmap.org");
  });

  it("prefers parsed map URL when it already yields OSM", () => {
    const share =
      "https://www.google.com/maps/place/Calicut/@11.2588,75.7804,12z";
    const src = propertyMapIframeSrc(share, 1, 1);
    expect(src).toContain("openstreetmap.org");
    expect(src).toContain("11.2588");
  });
});
