# useChromeStorage
API Chrome Storage Local/Sync - React Hook


### Usage example

```javascript
import React, { useEffect } from 'react';
import { useChromeStorage } from './useChromeStorage';


export default const app = () => {

	const [value, setValue, init] = useChromeStorage('testKey', { initValue: 'testValue', sync: false, validator: () => true });

	useEffect(() => {

    init.promise.then(() => console.log('init promise'));
  
    setValue('newTestValue');

	}, []);

	useEffect(() => {

    if (!init.state) {
      return;
    }

    console.log(init.state);
    console.log(value);

	}, [value]);

}

```
