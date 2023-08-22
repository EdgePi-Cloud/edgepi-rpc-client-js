/**
 * Takes an object containing possible configuration arguments and their associated values,
 * and then filters out any configuration argument whose value is undefined. The result is an array of
 * individual configuration argument objects, each consisting of a property and its corresponding value.
 *
 * @param {Object} obj - An object containing possible configuration arguments and values.
 * @returns {Array} An array of individual configuration argument objects with valid values.
 */
export function createConfigArgsList(obj:{[key: string]: any}): {[key: string]: any}[]{
    const argsList = Object.keys(obj)
        .filter(key => obj[key] !== undefined)
        .map(key => ({ [key]: obj[key] })); 
    return argsList
}
