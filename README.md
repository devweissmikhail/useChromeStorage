# useChromeStorage
API Chrome Storage Local/Sync - React Hook


### Usage example

```javascript
import React, { useEffect } from 'react';
import { useChromeStorage } from './useChromeStorage';


export default const app = () => {

  const [value, setValue, init] = useChromeStorage('testKey', {
    initValue: 'testValue',
    sync: false,
    validator: (val) => {
      if (val === undefined) {
        return false;
      }
      return true;
    }
  });

  useEffect(() => {

    if (init) {
      console.log('Initialized');
    }

    console.log(value);

  }, [value]);

  useEffect(() => {

    setValue('newTestValue');

  }, []);

}
```

### Default validator function

```javascript
const validator = () => true;
```
