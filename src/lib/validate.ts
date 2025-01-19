import { intersection, log, PushResultType, PushType } from "@/lib/utils";
import { z } from "zod";
import { Data } from "./mapping";

let allowedActions: PushType[] = [];
let deniedActions: PushType[] = [];

const validationValues = ["ok", "warning", "error", "no"] as const;

const validationScheme = z.object({
    result: z.enum(validationValues),
    message: z.string().optional()
});
export type ValidationType = z.infer<typeof validationScheme>;

export const okValidation: ValidationType = {result: "ok"}
export const noValidation: ValidationType = {result: "no"}

const debug: boolean = true;

const push = (_actionArray: PushType[], _originator: string | undefined, _action: Data) => {
    let push: PushType = {
        originator: (_originator ? _originator : ""),
        name: _action.name
    };
  
    _actionArray.push(push)
}
  
const resetValidation = (): ValidationType => {
    allowedActions = [];
    deniedActions = [];

    return okValidation;
};

export const validateData = (_data: Data[], _originator?: string, _access?: string, _validation?: ValidationType | undefined, _level?: number): ValidationType => {
    if (_level === undefined) {
        _level = 0;
    }

    if (_validation === undefined) {
        _validation = resetValidation();
    }

    log(debug, `VALIDATION ${_level}`, "handle", _data, true);
    log(debug, "VALIDATION", "originator", _originator);
    log(debug, "VALIDATION", "access", _access);

    if (_data.length > 0) {
        _data.map((d => {
            if  (d.children.length > 0) {
                if (! _originator || _level === 0) {
                    _originator = d.name;
                }

                if (d.other?.access) {
                    _access = d.other.access;
                }

                return validateData(d.children, _originator, _access, _validation, (_level+1));
            } else {
                if (_access === "Allow") {
                    log(debug, "VALIDATION", "PUSH(allow)", d.name);
                    push(allowedActions, _originator, d);
                } else {
                    log(debug, "VALIDATION", "PUSH(deny)", d.name);
                    push(deniedActions, _originator, d);
                }
            }
        }
        ))
    }

    if (_level === 0) {
        log(debug, "VALIDATE", "ALLOWED", allowedActions, true);
        log(debug, "VALIDATE", "DENIED", deniedActions, true);

        const intersect: PushResultType[] = intersection(allowedActions, deniedActions);

        log(debug, "VALIDATE", "INTERSECT", intersect, true);

        if (intersect.length > 0) {
            _validation.result = "error";
            _validation.message = `${intersect[0].name} conflicts in ${intersect[0].originator1} and ${intersect[0].originator2}`;
        }
        }

    return _validation;
}
