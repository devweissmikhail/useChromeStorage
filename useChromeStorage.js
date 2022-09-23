import React, { useState, useRef, useEffect } from 'react';


export const useChromeStorage = (key, { initValue, sync = false, validator = () => true } = {}) => {

  const [init, setInit] = useState(false);
  const [value, setValue] = useState({});

  const notInitSetRequest = useRef(false);
  const isFirstRender = useRef(true);


  useEffect(() => {

    try {

      chrome.storage[sync ? 'sync' : 'local']
        .get(key)
        .then((result) => {

          if (validator(result[key])) {
            setValueManager(result[key]);
            return;
          }

          setValueManager(initValue);

        })
        .catch(() => {

          console.warn('useChromeStorage: Get error');
          setValueManager(initValue);

        });

    } catch (e) {

      console.warn('useChromeStorage: API error');
      setValueManager(initValue);

    }

  }, []);

  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!init) {
      setInit(true);
    }

  }, [value]);


  const setValueManager = (val, setRequest = false) => {

    if (notInitSetRequest.current) {
      if (!setRequest) {
        return;
      }
    }

    setValue(val);

  }

  const getValue = () => {
    
    if (init) {
      return value;
    }
    return initValue;

  }

  const set = (val) => {

    if (!init) {
      notInitSetRequest.current = true;
    }

    return new Promise((resolve, reject) => {

      if (validator(val)) {

        setValueManager(val, true);

        try {

          chrome.storage[sync ? 'sync' : 'local']
            .set({ [key]: val })
            .then(() => resolve())
            .catch((e) => {

              console.warn('useChromeStorage: Set error');
              reject(e);

            });

        } catch (e) {
          reject('API error');
        }

      } else {
        reject('Validator rejected this value');
      }

    });

  }


  return [getValue(), set, init];

}
