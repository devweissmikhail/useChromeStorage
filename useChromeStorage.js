import React, { useState, useRef, useEffect } from 'react';
import { usePromise } from './usePromise';


export const useChromeStorage = (key, { initValue, sync = false, validator = () => true } = {}) => {

  const [init, setInit] = useState(false);
  const [value, setValue] = useState({});

  const isFirstRender = useRef(true);

  const [initPromise, initResolve] = usePromise();


  useEffect(() => {

    try {

      chrome.storage[sync ? 'sync' : 'local']
        .get(key)
        .then((result) => {

          if (validator(result[key])) {
            setValue(result[key]);
            return;
          }

          setValue(initValue);

        })
        .catch(() => {

          setValue(initValue);
          console.warn('useChromeStorage: Get error');

        });

    } catch (e) {

      setValue(initValue);
      console.warn('useChromeStorage: API error');

    }

  }, []);

  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!init) {
      setInit(true);
      initResolve();
    }

  }, [value]);


  const getValue = () => {
    
    if (init) {
      return value;
    }
    return initValue;

  }

  const set = (val) => {

    return new Promise((resolve, reject) => {

      initPromise.then(() => {

        if (validator(val)) {

          setValue(val);

          try {

            chrome.storage[sync ? 'sync' : 'local']
              .set({ [key]: val })
              .then(() => resolve())
              .catch(() => {

                reject('Set error');
                console.warn('useChromeStorage: Set error');

              });

          } catch (e) {
            reject('API error');
          }

        } else {
          reject('Validator rejected this value');
        }

      });

    });

  }


  return [getValue(), set, { state: init, promise: initPromise }];

}
