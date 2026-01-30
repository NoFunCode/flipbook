import { render, screen } from "@testing-library/react";

describe("Basic div component", () => {
  it("renders a div", () => {
    render(<div data-testid="basic-div">Hello</div>);
    const divElement = screen.getByTestId("basic-div");
    expect(divElement).toBeInTheDocument();
    expect(divElement).toHaveTextContent("Hello");
  });
});
