import { it, describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Login from "./login";

describe("Login Page", () => {
  it("should render with required fields", () => {
    render(<Login />);
    expect(screen.getByText(/Sign In/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Username/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/)).toBeInTheDocument();
    expect(screen.getByText(/Remember me/)).toBeInTheDocument();
    expect(screen.getByText(/Forgot Password/)).toBeInTheDocument();
    expect(screen.getByText(/Sign In/)).toBeEnabled();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
