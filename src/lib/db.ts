import { LanguageType } from "@/app/api/languages/data/scheme";
import { GroupType, PolicyType, RoleType, ServiceStatementType, UserType } from "@/data/iam-scheme";
import { CallbackFunctionDefault, CallbackFunctionDependencyLoaded, CallbackFunctionSubjectLoaded, FunctionDefault } from "@/data/types";
import { Data } from "./mapping";

/**
 * DB
 */
export const initDB = async (table: string) => {
  const res = await fetch('http://localhost:3000/api/db?table='+table,{
    method: 'POST',
    body: JSON.stringify("initialise DB?"),
    headers: {
      'content-type': 'application/json'
    }
  })        
}

 /**
 * LANGUAGES
 */
// ###
const loadLanguages = async (_callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
  let data: LanguageType[]= [];
  
  await fetch("http://localhost:3000/api/languages")
    .then((response) => response.json())
    .then((response) => _callback(response, _end));
  
  return data;
}

// ###
export const handleLoadLanguages = async (_start: FunctionDefault, _callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
  _start();

  await loadLanguages(_callback, _end);
}

/**
 * COUNTRIES
 */
// ###
const loadCountries = async (_callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
  await fetch("http://localhost:3000/api/db?table=country")
    .then((response) => response.json())
    .then((response) => _callback(response, _end));
}

// ###
export const handleLoadCountries = async (_start: FunctionDefault, _callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
    _start();

    await loadCountries(_callback, _end);
}

/**
 * SERVICES
 */
// ###
const loadServices = async (_callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
  await fetch("http://localhost:3000/api/iam/services?service=*&depth=0")
    .then((response) => response.json())
    .then((response) => _callback(response, _end));
}

// ###
export const handleLoadServices = async (_start:FunctionDefault, _callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
  _start();
  await loadServices(_callback, _end);
}

// ###
const loadServicesWithService = async (_service: string, _callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
  await fetch(`http://localhost:3000/api/iam/services?service=${_service}&depth=1`)
    .then((response) => response.json())
    .then((response) => {
      _callback(response, _end);
    });
}

// ###
export const handleLoadServicesWithService = async (_service: string, _start:FunctionDefault, _callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
  _start();
  await loadServicesWithService(_service, _callback, _end);
}

/**
 * STATEMENTS
 */
// ###
const loadStatements = async (_serviceId: number, _sid: string, _callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
    await fetch("http://localhost:3000/api/iam/statements?serviceId=" + _serviceId + "&sid=" + _sid)
      .then((response) => response.json())
      .then((response) => {
        _callback(response, _end);
      });
}

// ###
export const handleLoadStatements = async (_serviceId: number, _sid: string, _start:FunctionDefault, _callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
  _start();

  await loadStatements(_serviceId, _sid, _callback, _end);
}

// ###
export const handleDeleteStatement = async (id: number, _start: FunctionDefault, _callback: CallbackFunctionDefault, _end: FunctionDefault) => {
  _start();

  await fetch("http://localhost:3000/api/iam/statements?statementId="+id,{
      method: 'DELETE',
  }).then((response: Response) => _callback(_end));
}

export const createStatement = async (_statement: ServiceStatementType, _start: FunctionDefault, _callback: CallbackFunctionDefault, _end: FunctionDefault) => {
  _start();

  await fetch('http://localhost:3000/api/iam/statements',
    {
      method: 'POST',
      body: JSON.stringify(_statement),
      headers: {
        'content-type': 'application/json'
        }
    }).then(response => _callback(_end));
}

/**
 * POLICIES
 */
// ###
const loadPolicies = async (_callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
    await fetch("http://localhost:3000/api/iam/policies")
      .then((response) => response.json())
      .then((response) => {
        _callback(response, _end);
      });
}

// ###
export const handleLoadPolicies = async (_start:FunctionDefault, _callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
  _start();
  await loadPolicies(_callback, _end);
}

// ###
const loadPoliciesWithName = async (_policy: string, _callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
  await fetch("http://localhost:3000/api/iam/policies?policy=" + _policy)
    .then((response) => response.json())
    .then((response) => {
        _callback(response, _end);
    });
}

// ###
export const handleLoadPoliciesWithName = async (_policy: string, _start:FunctionDefault, _callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
  _start();

    await loadPoliciesWithName(_policy, _callback, _end);
}

export const handleDeletePolicy = async (id: number, _start: FunctionDefault, _callback: CallbackFunctionDefault, _end: FunctionDefault) => {
  _start();

  const res = await fetch("http://localhost:3000/api/iam/policies?policyId="+id,{
      method: 'DELETE',
  }).then((response: Response) => _callback(_end));
}

export const createPolicy = async (_policy: PolicyType, _start: FunctionDefault, _callback: CallbackFunctionDefault, _end: FunctionDefault) => {
  _start();

  await fetch('http://localhost:3000/api/iam/policies',
    {
      method: 'POST',
      body: JSON.stringify(_policy),
      headers: {
        'content-type': 'application/json'
      }
    }).then((response) => _callback(_end));
}

/**
 * ROLES
 */
// ###
const loadRoles = async (_callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
  await fetch("http://localhost:3000/api/iam/roles")
      .then((response) => response.json())
      .then((response) => {
          _callback(response, _end);
      });
}

// ###
export const handleLoadRoles = async (_start:FunctionDefault, _callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
  _start();
  await loadRoles(_callback, _end);
}

export const handleDeleteRole = async (id: number, _start:FunctionDefault, _callback: CallbackFunctionDefault, _end: FunctionDefault) => {
  _start();

  const res = await fetch("http://localhost:3000/api/iam/roles?roleId="+id,{
    method: 'DELETE',
  }).then((response: Response) => _callback(_end));
}

export const createRole = async (_role: RoleType, _start: FunctionDefault, _callback: CallbackFunctionDefault, _end: FunctionDefault) => {
  _start();

  await fetch('http://localhost:3000/api/iam/roles',
    {
      method: 'POST',
      body: JSON.stringify(_role),
      headers: {
        'content-type': 'application/json'
      }
    }).then((response) => _callback(_end));
}

/**
 * GROUPS
 */
const loadGroups = async (_callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
    await fetch("http://localhost:3000/api/iam/groups")
      .then((response) => response.json())
      .then((response) => {
        _callback(response, _end);
      });
}

export const handleLoadGroups = async (_start:FunctionDefault, _callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
    _start();
    await loadGroups(_callback, _end);
}

// export const handleDeleteGroup = async (id: number, callback: CallbackFunctionDefault) => {
//   const res = await fetch("http://localhost:3000/api/iam/groups?groupId="+id,{
//     method: 'DELETE',
//   }).then((response: Response) => callback());
// }

// export const createGroup = async (_data: GroupType, callback: CallbackFunctionDefault) => {
//   await fetch('http://localhost:3000/api/iam/groups',
//     {
//       method: 'POST',
//       body: JSON.stringify(_data),
//       headers: {
//         'content-type': 'application/json'
//       }
//     }).then(response => callback());
// }

// export const updateGroup = async (_data: GroupType, callback: CallbackFunctionDefault) => {
//   await fetch('http://localhost:3000/api/iam/groups',
//     {
//       method: 'PUT',
//       body: JSON.stringify(_data),
//       headers: {
//         'content-type': 'application/json'
//       }
//   }).then(response => callback());
// }

/**
 * USERS
 */
const loadUsers = async (_callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
  await fetch("http://localhost:3000/api/iam/users")
    .then((response) => response.json())
    .then((response) => {
      _callback(response, _end);
    });
}

export const handleLoadUsers = async (_start:FunctionDefault, _callback: CallbackFunctionSubjectLoaded, _end: FunctionDefault) => {
  _start();
  await loadUsers(_callback, _end);
}

const deleteUser = async (_id: number, _callback: CallbackFunctionDefault, _end: FunctionDefault) => {
  const res = await fetch("http://localhost:3000/api/iam/users?userId="+_id,{
    method: 'DELETE',
  }).then((response: Response) => _callback(_end));
}

export const handleDeleteUser = async (_id: number, _start:FunctionDefault, _callback: CallbackFunctionDefault, _end: FunctionDefault) => {
  _start();
  await deleteUser(_id, _callback, _end);
}

export const createUser = async (_user: NewUserType, _callback: CallbackFunctionDefault, _end: FunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/users',
    {
      method: 'POST',
      body: JSON.stringify(_user),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => _callback(_end));
}

export const handleCreateUser = async (_user: NewUserType, _start:FunctionDefault, _callback: CallbackFunctionDefault, _end: FunctionDefault) => {
  _start();
  await createUser(_user, _callback, _end);
}

// export const updateUser = async (_data: UserType, callback: CallbackFunctionDefault) => {
//   await fetch('http://localhost:3000/api/iam/users',
//     {
//       method: 'PUT',
//       body: JSON.stringify(_data),
//       headers: {
//         'content-type': 'application/json'
//       }
//     }).then(response => callback());
// }

// export const loadDependencies = async (subject: any, url: string, dependencies: any[], callback: CallbackFunctionDependencyLoaded) => {
//     await fetch(url + "?ids="+JSON.stringify(dependencies))
//     .then((response) => response.json())
//     .then((response) =>callback(subject, response));
// }
