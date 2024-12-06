import { useEffect } from "react";

/**
 * Sets a var `--visual-viewport-height` to the `<html>` element.
 */
export function useVisualViewportHeightEffect(): void {
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) {
      document.documentElement.style.removeProperty("--visual-viewport-height");
      return;
    }

    const f = () =>
      document.documentElement.style.setProperty(
        "--visual-viewport-height",
        `${vv.height}px`
      );

    vv.addEventListener("resize", f);
    f();
    return () => vv.removeEventListener("resize", f);
  }, []);
}
