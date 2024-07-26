import { writeFile } from 'fs';
import { getDistance } from 'geolib';
import { AddressObject } from '../V2/fetchData/fetch-Addresse/address';

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Function to save data to a file
export const saveDataToFile = (data: any, filename: string): void => {
  // Convert the data to a JSON string
  const dataString: string = JSON.stringify(data, null, 2);

  // Write the string to a file
  writeFile(filename, dataString, 'utf8', (err: NodeJS.ErrnoException | null) => {
    if (err) {
      console.error('An error occurred while writing JSON to file:', err);
    } else {
      console.log(`Data successfully saved to ${filename}`);
    }
  });
};

// Define a function 'filterObjects' that takes two parameters:
// 'data' (an array of objects) and 'keysToKeep' (an array of strings representing keys to keep).
export function filterObjectKeys(arrayOfObjects: any[], keysToKeep: string[]) {
  return arrayOfObjects.map((obj) => {
    return Object.keys(obj).reduce((newObj, key) => {
      if (keysToKeep.includes(key)) {
        newObj[key] = obj[key];
      }
      return newObj;
    }, {} as any);
  });
}


export function parseDateString(dateString: string): Date {
  const [day, month, year] = dateString.split('/');
  return new Date(`${year}-${month}-${day}`);
}

export function sortObject(events: any[], keyToSort: string) {
  return events.sort((a, b) => {
    const dateA = parseDateString(a[keyToSort]);
    const dateB = parseDateString(b[keyToSort]);
    return dateA.getTime() - dateB.getTime();
  });
}

export function getDistanceBetweenTwoPoint(lat1:number,lat2:number,lon1:number,lon2:number):number{
  return getDistance({latitude: lat1, longitude: lon1}, {latitude: lat2, longitude: lon2});
}

export function getCoordinatesAsString(addressObj: AddressObject): string {
  return addressObj.geometry.coordinates.join(',')
}

export function getFormattedDateYearsAgoAsString(yearsAgo: number): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - yearsAgo);

  // Ensuring month and day are in 'MM' and 'DD' format
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
