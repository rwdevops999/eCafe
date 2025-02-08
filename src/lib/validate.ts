import { Data } from "@/types/ecafe"
import { mapConflictsToData } from "./mapping"

type AccessPath = {
    path: string[]
}

export type AccessResultType = {
    action: string,
    allowed: AccessPath[],
    denied: AccessPath[]
}

export type AccessType = {
    path: string[],
    action: string
}

let allowedActionsArray: AccessType[] = [];
let deniedActionsArray: AccessType[] = [];

const resetValidationArrays = () => {
  allowedActionsArray = [];
  deniedActionsArray = [];
}

const validateData = (_data: Data[], _path: string[]) => {
    _data.forEach(element => {
      if (element.children && element.children.length === 0) {
        const item: AccessType = {
          path: [..._path],
          action: element.name
        }

        if (element.other?.access === "Allow") {
          allowedActionsArray.push(item);
        } else {
          deniedActionsArray.push(item);
        }
        // We reached the action
      } else {
        _path.push(element.name);
        if (element.children) {
          validateData(element.children, _path);
        }
        const index = _path.findIndex((_element) => _element === element.name);
        if (index !== -1) {
          _path.splice(index, 1);
        }
      }
    });
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
const intersection = (source: AccessType[], destination: AccessType[]): AccessResultType[] => {
  return operation(source, destination);
}

export const validateMappedData = (data: Data[]): Data[] => {
    resetValidationArrays();
    validateData(data, []);
    let result: AccessResultType[] = intersection(allowedActionsArray, deniedActionsArray);
    return mapConflictsToData(result);
};
