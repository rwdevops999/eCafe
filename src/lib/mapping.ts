import { Data, GroupType, ServiceType, TaskData, TaskType, UserType } from "@/types/ecafe";
import { z } from "zod";

/* ============ NEW VERSION ================= */
const prettify = (path: any[]): string => {
    return path.join(" > ");
}

const mapConflictChildren = (allowed: any[], denied: any): Data[] => {
    let result: Data[] = [];

    for (let i = 0; i < allowed.length; i++) {
      let d:Data = {
        id: i,
        name: prettify(allowed[i].path),
        description: prettify(denied[i].path),
        children: []
      }

      result.push(d);
    }

    return result;
  }

export const mapConflictsToData = (conflicts: any[]): Data[] => {
    let result: Data[] = [];

    let _id: number = 0;
    result = conflicts.map((conflict) => {
      return {
        id: _id++,
        name: conflict.action,
        description: "ERROR",
        children: mapConflictChildren(conflict.allowed, conflict.denied)
      }
    })

    return result;
  }

  const mapActionsToData = (actions: any[], permission: string): Data[] => {
    let result: Data[] = [];

    result = actions.map((action) => {
      return {
        id: action.id,
        name: action.name,
        description: "",
        children: [],
        other: {
          access: permission,
        }
      }
    })
    return result;
  }

  const mapSubjectChildren = (subject: any): Data[] => {
    let result: Data[] = [];

    let roles: Data[] = [];
    let policies: Data[] = [];
    let groups: Data[] = [];

    if (subject.roles?.original) {
      roles = mapRolesToData(subject.roles?.original);
    }

    if (subject.policies?.original) {
      policies = mapPoliciesToData(subject.policies?.original);
    }

    if (subject.groups?.original) {
      groups = mapGroupsToData(subject.groups?.original);
    }

    // HIER MOETEN POLICIES EN ROLES BEHANDELD WORDEN

    result = [...roles, ...policies, ...groups];

    return result;
  }

const fullMapSubjectToData = (subject: any): Data[] => {
    let result: Data[] = [];

    const subjectData: Data = {
      id: subject.id,
      name: subject.name!,
      description: "",
      children: mapSubjectChildren(subject)
    }

    result.push(subjectData);

    return result;
  }




/****** NEW FROM HERE */
export const mapDependenciesToData = (dependencies: any[]|undefined): Data[] => {
  let result: Data[] = [];

  if (dependencies) {
    result = dependencies.map((dependency: any) => {
      const data: Data = {
        id: dependency.id,
        name: dependency.name,
        description: dependency.description,
        children: []
      }

      return data;
    });
  }

  return result;
}

export const fullMapNoSubjectToData = (data: any, policies: any[], roles: any[], groups?: any[]): Data[] => {
  let result: Data[] = [];

  if (roles) {
      data.roles.original = roles;
  }   

  if (policies) {
      data.policies.original = roles;
  }   

  if (groups) {
      data.groups.original = roles;
  }   

  const subjectData: Data = {
    id: data.id,
    name: data.name!,
    description: "",
    children: mapSubjectChildren(data)
  }

  result.push(subjectData);

  return result;
}

export const mapGroupsToData = (groups: GroupType[]): Data[] => {
  let data: Data[] = [];

  if (groups.length > 0) {
      data = groups.map((group: GroupType) => {
        const _data: Data = {
          id: group.id!,
          name: group.name,
          description: group.description,
          children: []
        }
  
        return _data;
      })
  }

  return data;
}

const getServiceName = (serviceId: Number, services: any[]): string => {
  const service = services.find((s) => s.id === serviceId)
  if (service) {
    return service.name;
  }

  return '';
}

export const mapStatementsToData = (statements: any[] | undefined, services?: any[]): Data[] => {
  let result: Data[] = [];

  if (statements) {
    result = statements.map((statement) => {
      return {
        id: statement.id,
        name: statement.sid,
        description: statement.description,
        children: mapActionsToData(statement.actions, statement.permission),
        other: {
          serviceId: statement.serviceId,
          serviceName: (services ? getServiceName(statement.serviceId, services) : ""),
          managed: statement.managed,
          access: statement.permission
          }
      }
    })
  }

  return result;
};

export const mapPoliciesToData = (policies: any[] | undefined): Data[] => {
  let result: Data[] = [];

  if (policies) {
    result = policies.map((policy) => {
      return {
        id: policy.id,
        name: policy.name!,
        description: policy.description!,
        children: mapStatementsToData(policy.statements),
        other: {
          managed: policy.managed
        }
      }
    })
  }

  return result;
};

export const mapRolesToData = (roles: any[]|undefined): Data[] => {
  let result: Data[] = [];

  if (roles) {
    result = roles.map((role) => {
      return {
        id: role.id,
        name: role.name!,
        description: role.description!,
        children: mapPoliciesToData(role.policies),
        other: {
          managed: role.managed
        }
      }
    });
  }

  return result;
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

export const mapServiceActionsToData = (services: ServiceType[]): Data[] => {
  let result: Data[] = [];
  
  result = services.flatMap(service => {
    if (service.actions) {
      return (service.actions?.map(action => {
        let data: Data = {
              id: action.id,
              name: action.name,
              description: action.name,
              children: []
        }

        return data;
      }));
    }

    return [];
  });

  return result;
}

export const mapUsersToData = (users: UserType[]): Data[] => {
  let data: Data[] = [];

  data = users.map(user => {
      return {
          id: user.id!,
          name: user.name,
          description: user.firstname,
          children: []
      }
  })

  return data;
}


export const mapTasksToData = (tasks: TaskType[]|undefined): TaskData[] => {
  let result: TaskData[] = [];

  if (tasks) {
    let slicedTasks: TaskType[] = tasks.slice(0, 5);

    result = slicedTasks.map((task: any) => {
      const data: TaskData = {
        id: task.id,
        name: task.name,
        description: task.description,
        type: task.subject,
        status: task.status,
        children: []
      }

      return data;
    });
  }

  return result;
}
