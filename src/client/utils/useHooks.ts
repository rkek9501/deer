import { useEffect, useRef } from "react";
import { createLink } from "./index";
export function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(null) as React.MutableRefObject<any>;

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function useEffectSkipFirstRender(fn: () => void, args: any[]) {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) fn();
    else isMounted.current = true;
  }, args);
}

export function useCreateLink(href: string) {
  let link: any = null;

  useEffect(() => {
    link = createLink(href);
    () => link.parentNode.removeChild(link);
  }, []);
}
