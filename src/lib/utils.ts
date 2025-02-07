import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import jsonStringifySafe from "json-stringify-safe"
import crypto from 'crypto';

import * as  fs from 'fs';
import * as path from 'path';
import { Country, Data } from "@/types/ecafe";



/**
 * log info
 * 
 * @param debug : true will actually log
 * @param caller : the calling method
 * @param message : a message
 * @param object : an object (primitive or JSON object)
 * @param isJSON : object is a JSON object
 */
const log = (
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
      console.log(new Date() + `[${caller}]: ${message}: => ${object}`);
    }
  }
};

/**
 * Generate uuidv4 with '{prefix}-' ahead
 * 
 * @returns 
 */
function uuidv4(prefix:string): string {
  return prefix+'-'+'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c)=> {
    const r = (Math.random() * 16) | 0;
    const v = c ==='x'? r :(r & 0x3) | 0x8;
    return v.toString(16);
  })
}

function serviceUUID(): string {
  return uuidv4("srv");
}

function resourceUUID(): string {
  return uuidv4("res");
}

function actionUUID(): string {
  return uuidv4("act");
}

function statementUUID(): string {
  return uuidv4("stmt");
}

function policyUUID(): string {
  return uuidv4("pol");
}

const showObjectArray = (caption: string, array: any[]): void => {
  log(true, "INFO", caption, array, true);
}

const differenceBySomeType = (original: any[], selected: any[]): number[] => {
  const originalIds: number[] = original.map((original) => original.id);
  const selectedIds: number[] = selected.map((selected) => selected.id);

  return originalIds.filter(id => selectedIds.indexOf(id) < 0); 
}

const addActionToResult = (_result: AccessResultType[], _action: string, _allowedPath: string[], _deniedPath: string[]): AccessResultType[] => {

  let art: AccessResultType|undefined = _result.find((item) => item.action === _action);
  if (art) {
    art.allowed.push({path: _allowedPath});
    art.denied.push({path: _deniedPath});
  } else {
    _result.push({
      action: _action,
      allowed: [{path: _allowedPath}],
      denied: [{path: _deniedPath}] 
    })
  }

  return _result;
}

const operation = (allowed: AccessType[], denied: AccessType[]): AccessResultType[] => {
  let result: AccessResultType[] = [];

  for (let i = 0; i < allowed.length; i++) {
      let item1 = allowed[i],
          found = false;
      for (let j = 0; j < denied.length && !found; j++) {
        let item2 = denied[j],
        found = item1.action === item2.action;
        if  (found) {
          result = addActionToResult(result, item1.action, item1.path, item2.path);
        }
      }
  }

  return result;
}

const intersection = (source: AccessType[], destination: AccessType[]): AccessResultType[] => {
  return operation(source, destination);
}






/******** NEW FROM HERE */
export const loadCountriesFromFile = (filename: string): Country[] => {
    const csvFilePath = path.resolve(filename);
    const fileContent = fs.readFileSync(csvFilePath);
    var decoder = new TextDecoder("utf-8");
    let str = decoder.decode(fileContent);

    let countries: Country[] = JSON.parse(str);

    return countries;
};

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

/**
 * ClassName merge
 * 
 * @returns 
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cloneObject = (_o: any): any => {
  return Object.assign(Object.create(_o), _o);
};

export const difference = (original: Data[], selected: Data[]): number[] => {
  const originalIds: number[] = original.map((original) => original.id);
  const selectedIds: number[] = selected.map((selected) => selected.id);

  return originalIds.filter(id => selectedIds.indexOf(id) < 0); 
}

export const isNumber = (n: string | Number): boolean => !isNaN(parseFloat(String(n))) && isFinite(Number(n));

