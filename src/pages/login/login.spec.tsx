import { it, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Login from "./login";

describe("Login Page", () => {
  it("should render with required fields", () => {
    render(<Login />);
    expect(screen.getByText(/Sign in/)).toBeInTheDocument();
  });
});
