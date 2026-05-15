import { useCallback, useEffect, useRef } from "react";

export function useAutoScroll<T extends HTMLElement>(deps: unknown[]) {
  const containerRef = useRef<T>(null);
  const isNearBottomRef = useRef(true);

  const checkNearBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 80;
    isNearBottomRef.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  useEffect(() => {
    if (isNearBottomRef.current) {
      scrollToBottom(deps.length > 1 ? "smooth" : "auto");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    containerRef,
    checkNearBottom,
    scrollToBottom,
  };
}
