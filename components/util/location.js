import * as zipcodes from 'zipcodes';

// TODO: Lookup any address. Right now, assumes the address is a zipcodes
export function lookup(address) {
  const zipInfo = zipcodes.lookup(address);

  return {
    latitude: zipInfo.latitude,
    longitude: zipInfo.longitude
  }
}