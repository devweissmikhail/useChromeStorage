# useChromeStorage
API Chrome Storage Local/Sync - React Hook


Usage:

const [value, setValue] = useChromeStorage('testKey', 'testValue', validator);

const validator = (val) => {
  if (typeof val === 'string') {
    return true;
  }
  return false;
}
