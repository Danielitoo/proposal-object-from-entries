if (!('fromEntries' in Object)) {
  Object.fromEntries = iter => {
    const pairs = [ ...iter ]; // calls GetIterator (Array.from would coerce)

    const obj = {};

    for (const [ index, pair ] of pairs.entries()) {
      if (Object(pair) !== pair) {
        // Consistent messaging to Chrome when initializing a Map:
        throw new TypeError(`Iterator value ${ index } is not an entry object`);
      }

      // Consistency with Map: object need not be technically iterable:

      const { 0: key, 1: val } = pair;

      // Such that Object.entries(Object.fromEntries(obj)) always yield the
      // "same" list of entries, symbols are prohibited (along with any other
      // non-string keys):

      if (typeof key !== 'string') {
        throw new TypeError(`Entry object key must be a string`);
      }

      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: val,
      });
    }

    return obj;
  };
}
