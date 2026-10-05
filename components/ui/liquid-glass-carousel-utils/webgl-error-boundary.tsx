"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface WebGLErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
}

export class WebGLErrorBoundary extends Component<
  WebGLErrorBoundaryProps,
  WebGLErrorBoundaryState
> {
  state: WebGLErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Liquid glass carousel failed to render", error, info);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

interface WebGLFallbackProps {
  className?: string;
  message: string;
}

export function WebGLFallback({ className, message }: WebGLFallbackProps) {
  return (
    <div
      className={className}
      role="status"
      style={{ display: "grid", placeItems: "center", padding: "1rem" }}
    >
      <p>{message}</p>
    </div>
  );
}
