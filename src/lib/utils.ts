import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jsonStringifySafe from "json-stringify-safe"
import sha256 from 'crypto-js/sha256';


/**
 * ClassName merge
 * 
 * @returns 
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * log info
 * 
 * @param debug : true will actually log
 * @param caller : the calling method
 * @param message : a message
 * @param object : an object (primitive or JSON object)
 * @param isJSON : object is a JSON object
 */
export const log = (
  debug: boolean,
  caller: string,
  message: string,
  object?: Object,
  isJSON?: boolean
) => {
  if (debug) {
    if (object) {
      if (object !== undefined) {
        if (isJSON) {
          console.log(new Date() + `[${caller}]: ${message} => ${jsonStringifySafe(object)}`);
        } else {
          console.log(new Date() + `[${caller}]: ${message} => ${object}`);
        }
      } else {
        console.log(new Date() + `[${caller}]: ${message} => Object is  undefined`);
      }
    } else {
      if  (object) {
        console.log(new Date() + `[${caller}]: ${message}: => ${object}`);
      } else {
        console.log(new Date() + `[${caller}]: ${message}`);
      }
    }
  }
};

/**
 * Generate uuidv4 with '{prefix}-' ahead
 * 
 * @returns 
 */
export function uuidv4(prefix:string): string {
  return prefix+'-'+'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=> {
    const r = (Math.random() * 16) | 0;
    const v = c ==='x'? r :(r & 0x3) | 0x8;
    return v.toString(16);
  })
}

export function serviceUUID(): string {
  return uuidv4("srv");
}

export function resourceUUID(): string {
  return uuidv4("res");
}

export function actionUUID(): string {
  return uuidv4("act");
}

export function statementUUID(): string {
  return uuidv4("stmt");
}

export function policyUUID(): string {
  return uuidv4("pol");
}

export const valueInArray = (value: string, arr: string[]): string[] => {
    return arr.filter((str) => str === value);
}

export type PushType = {
  originator: string,
  name: string
}

export type PushResultType = {
  originator1: string,
  originator2: string,
  name: string
}

function operation(list1: PushType[], list2: PushType[]): PushResultType[] {
    let result: PushResultType[] = [];
  
    for (var i = 0; i < list1.length; i++) {
        var item1 = list1[i],
            found = false;
        for (var j = 0; j < list2.length && !found; j++) {
            found = item1.name === list2[j].name;
            if  (found) {
              const push: PushResultType = {
                originator1: item1.originator,
                originator2: list2[j].originator,
                name: item1.name
              }
              if (found) { // isUnion is coerced to boolean
                result.push(push);
              }
            }
        }

    }
    return result;
}
  
export const intersection = (source: PushType[], destination: PushType[]): PushResultType[] => {
  return operation(source, destination);
}

export const showObjectArray = (caption: string, array: any[]): void => {
  log(true, "INFO", caption, array, true);
}

export const isNumber = (n: string | Number): boolean => 
  !isNaN(parseFloat(String(n))) && isFinite(Number(n));


import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCODING = 'hex';
const IV_LENGTH = 16;
const KEY = "azertyuiopqsdfghjkl&éjgfljgFLUg";

export const encrypt = (data: string) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, new Buffer(KEY), iv);
  return Buffer.concat([cipher.update(data,), cipher.final(), iv]).toString(ENCODING);
}

export const decrypt = (data: string) => {
  const binaryData = new Buffer(data, ENCODING);
  const iv = binaryData.slice(-IV_LENGTH);
  const encryptedData = binaryData.slice(0, binaryData.length - IV_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, new Buffer(KEY), iv);

  return Buffer.concat([decipher.update(encryptedData), decipher.final()]).toString();
}