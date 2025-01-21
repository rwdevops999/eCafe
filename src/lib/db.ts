import { LanguageType } from "@/app/api/languages/data/scheme";
import { CallbackFunctionDefault, CallbackFunctionSubjectLoaded } from "@/data/types";

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
const loadLanguages = async (callback: CallbackFunctionSubjectLoaded) => {
  let data: LanguageType[]= [];
  
  await fetch("http://localhost:3000/api/languages")
    .then((response) => response.json())
    .then((response) =>callback(response));
  
  return data;
}

export const handleLoadLanguages = async (callback: CallbackFunctionSubjectLoaded) => {
  await loadLanguages(callback);
}

/**
 * COUNTRIES
 */
const loadCountries = async (callback: CallbackFunctionSubjectLoaded) => {
  await fetch("http://localhost:3000/api/db?table=country")
    .then((response) => response.json())
    .then((response) => callback(response));
}

export const handleLoadCountries = async (callback: CallbackFunctionSubjectLoaded) => {
  await loadCountries(callback);
}

/**
 * SERVICES
 */
const loadServices = async (callback: CallbackFunctionSubjectLoaded) => {
  await fetch("http://localhost:3000/api/iam/services?service=*&depth=0")
    .then((response) => response.json())
    .then((response) => callback(response));
}

export const handleLoadServices = async (callback: CallbackFunctionSubjectLoaded) => {
  await loadServices(callback);
}

const loadServicesWithService = async (_service: string, callback: CallbackFunctionSubjectLoaded) => {
  await fetch(`http://localhost:3000/api/iam/services?service=${_service}&depth=1`)
    .then((response) => response.json())
    .then((response) => {
      callback(response);
    });
}

export const handleLoadServicesWithService = async (_service: string, callback: CallbackFunctionSubjectLoaded) => {
  await loadServicesWithService(_service, callback);
}

/**
 * STATEMENTS
 */
const loadStatements = async (_serviceId: number, _sid: string, callback: CallbackFunctionSubjectLoaded) => {
    await fetch("http://localhost:3000/api/iam/statements?serviceId=" + _serviceId + "&sid=" + _sid)
      .then((response) => response.json())
      .then((response) => {
        callback(response);
      });
}

export const handleLoadStatements = async (_serviceId: number, _sid: string, callback: CallbackFunctionSubjectLoaded) => {
  await loadStatements(_serviceId, _sid, callback);
}

export const handleDeleteStatement = async (id: number, callback: CallbackFunctionDefault) => {
  await fetch("http://localhost:3000/api/iam/statements?statementId="+id,{
      method: 'DELETE',
  }).then((response: Response) => callback());
}

export const createStatement = async (_statement: ServiceStatementType, callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/statements',
    {
      method: 'POST',
      body: JSON.stringify(_statement),
      headers: {
        'content-type': 'application/json'
        }
    }).then(response => callback());
}

/**
 * POLICIES
 */
const loadPolicies = async (callback: CallbackFunctionSubjectLoaded) => {
    await fetch("http://localhost:3000/api/iam/policies")
      .then((response) => response.json())
      .then((response) => {
        callback(response);
      });
}

export const handleLoadPolicies = async (callback: CallbackFunctionSubjectLoaded) => {
    await loadPolicies(callback);
}

const loadPoliciesWithName = async (_policy: string, callback: CallbackFunctionSubjectLoaded) => {
  await fetch("http://localhost:3000/api/iam/policies?policy=" + _policy)
    .then((response) => response.json())
    .then((response) => {
        callback(response);
    });
}

export const handleLoadPoliciesWithName = async (_policy: string, callback: CallbackFunctionSubjectLoaded) => {
  await loadPoliciesWithName(_policy, callback);
}

export const handleDeletePolicy = async (id: number, callback: CallbackFunctionDefault) => {
  const res = await fetch("http://localhost:3000/api/iam/policies?policyId="+id,{
      method: 'DELETE',
  }).then((response: Response) => callback());
}

export const createPolicy = async (_policy: PolicyType, callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/policies',
    {
      method: 'POST',
      body: JSON.stringify(_policy),
      headers: {
        'content-type': 'application/json'
      }
    }).then((response) => callback());
}

/**
 * ROLES
 */
const loadRoles = async (callback: CallbackFunctionSubjectLoaded) => {
  await fetch("http://localhost:3000/api/iam/roles")
      .then((response) => response.json())
      .then((response) => {
          callback(response);
      });
}

export const handleLoadRoles = async (callback: CallbackFunctionSubjectLoaded) => {
  await loadRoles(callback);
}

export const handleDeleteRole = async (id: number, callback: CallbackFunctionDefault) => {
  const res = await fetch("http://localhost:3000/api/iam/roles?roleId="+id,{
    method: 'DELETE',
  }).then((response: Response) => callback());
}

export const createRole = async (_role: RoleType, callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/roles',
    {
      method: 'POST',
      body: JSON.stringify(_role),
      headers: {
        'content-type': 'application/json'
      }
    }).then((response) => callback());
}

/**
 * GROUPS
 */
const loadGroups = async (callback: CallbackFunctionSubjectLoaded) => {
    await fetch("http://localhost:3000/api/iam/groups")
      .then((response) => response.json())
      .then((response) => {
        callback(response);
      });
}

export const handleLoadGroups = async (callback: CallbackFunctionSubjectLoaded) => {
    await loadGroups(callback);
}

export const handleDeleteGroup = async (id: number, callback: CallbackFunctionDefault) => {
  const res = await fetch("http://localhost:3000/api/iam/groups?groupId="+id,{
    method: 'DELETE',
  }).then((response: Response) => callback());
}

export const createGroup = async (_data: GroupType, callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/groups',
    {
      method: 'POST',
      body: JSON.stringify(_data),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => callback());
}

export const updateGroup = async (_data: GroupType, callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/groups',
    {
      method: 'PUT',
      body: JSON.stringify(_data),
      headers: {
        'content-type': 'application/json'
      }
  }).then(response => callback());
}

/**
 * USERS
 */
const loadUsers = async (callback: CallbackFunctionSubjectLoaded) => {
  await fetch("http://localhost:3000/api/iam/users")
    .then((response) => response.json())
    .then((response) => {
      callback(response);
    });
}

export const handleLoadUsers = async (callback: CallbackFunctionSubjectLoaded) => {
  await loadUsers(callback);
}

export const handleDeleteUser = async (id: number, callback: CallbackFunctionDefault) => {
  const res = await fetch("http://localhost:3000/api/iam/users?userId="+id,{
    method: 'DELETE',
  }).then((response: Response) => callback());
}

export const createUser = async (_data: UserType, callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/users',
    {
      method: 'POST',
      body: JSON.stringify(_data),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => callback());
}

export const updateUser = async (_data: UserType, callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/users',
    {
      method: 'PUT',
      body: JSON.stringify(_data),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => callback());
}

