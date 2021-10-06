// @flow
import {useRef, useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';

export function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useDebounce(value: any, debounceTime: number = 1000) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setV(value);
    }, debounceTime);
    return () => clearTimeout(handler);
  }, [value, debounceTime, v]);
  return v;
}

export function ScrollToTop() {
  const {pathname} = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
