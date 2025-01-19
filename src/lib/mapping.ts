import { ActionType, PolicyType, RoleType, ServiceStatementType, ServiceType, UserType } from "@/data/iam-scheme";
import { log } from "@/lib/utils";
import { z } from "zod";

const additionalScheme = z.object({
    managed: z.boolean().optional(),
    access: z.string().optional(),
    serviceId: z.number().optional(),
    serviceName: z.string().optional(),
});

const dataScheme = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    children: z.array(z.any()),
    other : additionalScheme.optional()
});
export type Data = z.infer<typeof dataScheme>

const debug: boolean = false;

export const mapServiceActionsToData = (services: ServiceType[]): Data[] => {
    let result: Data[] = [];

    log(debug, "MAPPING", "Level", "ServiceActions");

    result = services.flatMap(service => {
        return (service.actions.map(action => {
            let data: Data = {
                id: action.id,
                name: action.name,
                description: action.name,
                children: []
            }

            return data;
        }));
    });

    return result;
}

export const mapActionsToData = (actions: ActionType[], level: number, permission: string): Data[] => {
    let result: Data[] = [];

    log(debug, "MAPPING", "Actions", actions, true);
    log(debug, "MAPPING", "at level", Number(level));

    if (actions && level >= 0) {
        log(debug, "MAPPING", "Level", "Actions");
        level -= 1;

        actions.map(action => {
            let data: Data = {
                id: action.id,
                name: action.name,
                description: action.name,
                children: [],
                other: {
                    access: permission
                }
            }

            result.push(data);
        })
    }

    return result;
}

const getServiceName = (serviceId: Number, services: any[]): string => {
    const service = services.find((s) => s.id === serviceId)
    if (service) {
      return service.name;
    }

    return '';
  }

export const mapServicesToData = (_services: ServiceType[]): Data[] => {
    const dataArray: Data[] = _services.map(service => {
        return {
            id: service.id,
            name: service.name,
            description: service.name,
            children: service.actions
        };
    });

    return dataArray;
}

export const mapStatementsToData = (statements: ServiceStatementType[], level: number = 1, services?: any[]): Data[] => {
    let result: Data[] = [];

    log(debug, "MAPPING", "Statements", statements, true);
    log(debug, "MAPPING", "at level", Number(level));

    if  (statements && level >= 0) {
        log(debug, "MAPPING", "Level", "Statements");

        level -= 1;
        statements.map(statement => {
            let data: Data = {
            id: statement.id,
            name: statement.sid,
            description: statement.description,
            children: mapActionsToData(statement.actions, level, statement.permission),
            other: {
                serviceId: statement.serviceId,
                serviceName: (services ? getServiceName(statement.serviceId, services) : ""),
                managed: statement.managed,
                access: statement.permission
            }
        };

        result.push(data);
    });
    }

    return result;
}

export const mapPoliciesToData = (policies: PolicyType[], level: number = 1, services?: any[]): Data[] => {
    let data: Data[] = [];

    log(debug, "MAPPING", "Policies", policies, true);
    log(debug, "MAPPING", "at level", Number(level));

    if (policies && level >= 0) {
        log(debug, "MAPPING", "Level", "Policies");
        level -= 1;
        data = policies.map(policy => {
            return {
                id: policy.id,
                name: policy.name,
                description: policy.description,
                children: mapStatementsToData(policy.statements, level, services),
                other: {
                    managed: policy.managed
                }
            }
        })
    }

    log(debug, "MAPPING", "Mapped Policies", data, true);

    return data;
}

export const mapRolesToData = (roles: RoleType[] ): Data[] => {
    let data: Data[] = [];

    data = roles.map(role => {
        return {
            id: role.id,
            name: role.name,
            description: role.description,
            managed: role.managed,
            children: mapPoliciesToData(role.policies)
        }
    })

    return data;
}

export const mapUsersToData = (users:  UserType[], level: number): Data[] => {
    let data: Data[] = [];

    data = users.map(user => {
        return {
            id: user.id,
            name: user.name,
            description: user.firstname,
            children: []
        }
    })

    return data;
}
