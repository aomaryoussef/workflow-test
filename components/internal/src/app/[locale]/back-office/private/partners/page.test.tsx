import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import PartnersPage from "./page.tsx";

describe("Partners", () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  it("renders partners page", () => {
    const { container } = render(<PartnersPage />);
    expect(container).toMatchSnapshot()
  });
});
