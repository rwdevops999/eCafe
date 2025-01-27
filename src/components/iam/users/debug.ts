import { MetaBase } from "@/data/meta";
import { FieldValues } from "react-hook-form";

export const doLoggie = <T extends FieldValues,>(sender: string, _meta:MetaBase<T>) => {
    if (_meta.items && _meta.items.loggie) {
        _meta.items.loggie(sender);
    }
}