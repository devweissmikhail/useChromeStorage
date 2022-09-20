import React, { useState, useEffect } from 'react';
import { usePromise } from './usePromise';


export const useChromeStorage = (key, initialValue, { sync = false, validator = () => true } = {}) => {

  const [value, setValue] = useState(initialValue);
  const [initPromise, initResolve] = usePromise();


  useEffect(() => {

    try {

      chrome.storage[sync === true ? 'sync' : 'local']
        .get(key)
        .then((result) => {

          if (result[key] !== undefined) {
            if (validator(result[key])) {
              setValue(result[key]);
            }
          }

        })
        .catch(() => console.warn('useChromeStorage: Get error - ' + key))
        .finally(() => initResolve());

    } catch (error) {

      console.warn('useChromeStorage: Chrome storage API error');
      initResolve();

    }

  }, []);


  const set = (val) => {

    return new Promise((resolve, reject) => {

      initPromise.then(() => {

        if (validator(val)) {

          setValue(val);

          try {

            chrome.storage[sync === true ? 'sync' : 'local']
              .set({ [key]: val })
              .then(() => resolve())
              .catch((error) => {

                console.warn('useChromeStorage: Set error - ' + key);
                reject(error);

              });

          } catch (error) {
            reject('Chrome storage API error');
          }

        } else {
          reject('Validator rejected this value');
        }

      });

    });

  }


  return [value, set];

}
