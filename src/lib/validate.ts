import { Data, mapConflictsToData } from "./mapping"
import { intersection } from "./utils"

/* ============== NEW VERSION ============= */
type AccessPath = {
    path: string[]
}

type AccessResultType = {
    action: string,
    allowed: AccessPath[],
    denied: AccessPath[]
}

type AccessType = {
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
      if (element.children.length === 0) {
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
        validateData(element.children, _path);
        const index = _path.findIndex((_element) => _element === element.name);
        if (index !== -1) {
          _path.splice(index, 1);
        }
      }
    });
}

export const validateMappedData = (data: Data[]): Data[] => {
    resetValidationArrays();
    validateData(data, []);
    let result: AccessResultType[] = intersection(allowedActionsArray, deniedActionsArray);
    return mapConflictsToData(result);
};
