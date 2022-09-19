import React, { useRef } from 'react';


export const usePromise = () => {

  const resolveRef = useRef(null);
  const rejectRef = useRef(null);

  const promiseRef = useRef(
    new Promise((resolve, reject) => {

      resolveRef.current = resolve;
      rejectRef.current = reject;

    })
  );

  return [promiseRef.current, resolveRef.current, rejectRef.current];

}
