import React, { useState, useEffect } from 'react';
import { usePromise } from './usePromise';


export const useChromeStorage = (key, initialValue, validator, sync) => {

  const [value, setValue] = useState(initialValue);
  const [initPromise, initResolve] = usePromise();


  useEffect(() => {

    try {

      chrome.storage[sync === true ? 'sync' : 'local']
        .get(key)
        .then((result) => {

          try {

            if (validator(result[key])) {
              setValue(result[key]);
            }

          } catch (error) {
            console.warn('useChromeStorage: Validator error');
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
              .catch(() => {

                console.warn('useChromeStorage: Set error - ' + key);
                reject('Most likely the quota is full');

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
