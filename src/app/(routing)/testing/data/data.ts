import { Data } from "@/components/iam/policies/view/data/data";
import { intersection, log, PushResultType, PushType } from "@/lib/utils";
import { z } from "zod";

let allowedActions: PushType[] = [];
let deniedActions: PushType[] = [];

const validationValues = ["ok", "warning", "error", "no"] as const;

const validationScheme = z.object({
    result: z.enum(validationValues),
    message: z.string().optional()
});
export type ValidationType = z.infer<typeof validationScheme>;

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

    return {
        result: "ok"
    }
};

export const validateData = (_data: Data[], _originator?: string, _access?: string, _validation?: ValidationType | undefined, _level?: number): ValidationType => {
    if (_level === undefined) {
        _level = 0;
    }

    if (_validation === undefined) {
        _validation = resetValidation();
    }

    log(true, `VALIDATION ${_level}`, "handle", _data, true);
    log(true, "VALIDATION", "originator", _originator);
    log(true, "VALIDATION", "access", _access);

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
                log(true, "VALIDATION", "PUSH(allow)", d.name);
                push(allowedActions, _originator, d);
            } else {
                log(true, "VALIDATION", "PUSH(deny)", d.name);
                push(deniedActions, _originator, d);
            }
        }
    }
    ))

    if (_level === 0) {
        log(true, "VALIDATE", "ALLOWED", allowedActions, true);
        log(true, "VALIDATE", "DENIED", deniedActions, true);

        const intersect: PushResultType[] = intersection(allowedActions, deniedActions);

        log(true, "VALIDATE", "INTERSECT", intersect, true);
    }

    return _validation;
}
