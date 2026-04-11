import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PropertyDetailImageViewer } from "./PropertyDetailImageViewer";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} data-testid="viewer-img" />
  ),
}));

describe("PropertyDetailImageViewer", () => {
  const images = ["/a.jpg", "/b.jpg", "/c.jpg"];
  const title = "Test Villa";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("renders nothing in the document tree when closed", () => {
    const { container } = render(
      <PropertyDetailImageViewer
        open={false}
        onOpenChange={() => {}}
        images={images}
        title={title}
        index={0}
        onIndexChange={() => {}}
      />,
    );
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });

  it("shows the current image and dialog title when open", () => {
    render(
      <PropertyDetailImageViewer
        open
        onOpenChange={() => {}}
        images={images}
        title={title}
        index={1}
        onIndexChange={() => {}}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /full screen photos/i }),
    ).toBeInTheDocument();
    const img = screen.getByRole("img", { name: /photo 2 of 3/i });
    expect(img).toHaveAttribute("src", "/b.jpg");
  });

  it("calls onOpenChange(false) when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <PropertyDetailImageViewer
        open
        onOpenChange={onOpenChange}
        images={images}
        title={title}
        index={0}
        onIndexChange={() => {}}
      />,
    );

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("advances index when Next is activated", async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    render(
      <PropertyDetailImageViewer
        open
        onOpenChange={() => {}}
        images={images}
        title={title}
        index={0}
        onIndexChange={onIndexChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /next photo/i }));
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it("returns null when images array is empty", () => {
    const { container } = render(
      <PropertyDetailImageViewer
        open
        onOpenChange={() => {}}
        images={[]}
        title={title}
        index={0}
        onIndexChange={() => {}}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});
