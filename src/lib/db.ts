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
const loadLanguages = async (_callback: CallbackFunctionSubjectLoaded) => {
  let data: LanguageType[]= [];
  
  await fetch("http://localhost:3000/api/languages")
    .then((response) => response.json())
    .then((response) => _callback(response));
  
  return data;
}

export const handleLoadLanguages = async (_callback: CallbackFunctionSubjectLoaded) => {
  await loadLanguages(_callback);
}

/**
 * COUNTRIES
 */
const loadCountries = async (_callback: CallbackFunctionSubjectLoaded) => {
  await fetch("http://localhost:3000/api/db?table=country")
    .then((response) => response.json())
    .then((response) => _callback(response));
}

export const handleLoadCountries = async (_callback: CallbackFunctionSubjectLoaded) => {
    await loadCountries(_callback);
}

/**
 * SERVICES
 */
const loadServices = async (_callback: CallbackFunctionSubjectLoaded) => {
  await fetch("http://localhost:3000/api/iam/services?service=*&depth=0")
    .then((response) => response.json())
    .then((response) => _callback(response));
}

export const handleLoadServices = async (_callback: CallbackFunctionSubjectLoaded) => {
  await loadServices(_callback);
}

const loadServicesWithService = async (_service: string, _callback: CallbackFunctionSubjectLoaded) => {
  await fetch(`http://localhost:3000/api/iam/services?service=${_service}&depth=1`)
    .then((response) => response.json())
    .then((response) => {
      _callback(response);
    });
}

export const handleLoadServicesWithService = async (_service: string, _callback: CallbackFunctionSubjectLoaded) => {
  await loadServicesWithService(_service, _callback);
}

/**
 * STATEMENTS
 */
const loadStatements = async (_serviceId: number, _sid: string, _callback: CallbackFunctionSubjectLoaded) => {
    await fetch("http://localhost:3000/api/iam/statements?serviceId=" + _serviceId + "&sid=" + _sid)
      .then((response) => response.json())
      .then((response) => {
        _callback(response);
      });
}

export const handleLoadStatements = async (_serviceId: number, _sid: string, _callback: CallbackFunctionSubjectLoaded) => {
  await loadStatements(_serviceId, _sid, _callback);
}

export const handleDeleteStatement = async (id: number, _callback: CallbackFunctionDefault) => {
  await fetch("http://localhost:3000/api/iam/statements?statementId="+id,{
      method: 'DELETE',
  }).then((response: Response) => _callback());
}

export const createStatement = async (_statement: NewStatementType, _callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/statements',
    {
      method: 'POST',
      body: JSON.stringify(_statement),
      headers: {
        'content-type': 'application/json'
        }
    }).then(response => _callback());
}

/**
 * POLICIES
 */
const loadPolicies = async (_callback: CallbackFunctionSubjectLoaded) => {
    await fetch("http://localhost:3000/api/iam/policies")
      .then((response) => response.json())
      .then((response) => {
        _callback(response);
      });
}

export const handleLoadPolicies = async (_callback: CallbackFunctionSubjectLoaded) => {
  await loadPolicies(_callback);
}

const loadPoliciesWithName = async (_policy: string, _callback: CallbackFunctionSubjectLoaded) => {
  await fetch("http://localhost:3000/api/iam/policies?policy=" + _policy)
    .then((response) => response.json())
    .then((response) => {
        _callback(response);
    });
}

export const handleLoadPoliciesWithName = async (_policy: string, _callback: CallbackFunctionSubjectLoaded) => {
    await loadPoliciesWithName(_policy, _callback);
}

export const handleDeletePolicy = async (id: number, _callback: CallbackFunctionDefault) => {
  const res = await fetch("http://localhost:3000/api/iam/policies?policyId="+id,{
      method: 'DELETE',
  }).then((response: Response) => _callback());
}

export const createPolicy = async (_policy: NewPolicyType, _callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/policies',
    {
      method: 'POST',
      body: JSON.stringify(_policy),
      headers: {
        'content-type': 'application/json'
      }
    }).then((response) => _callback());
}

/**
 * ROLES
 */
const loadRoles = async (_callback: CallbackFunctionSubjectLoaded) => {
  await fetch("http://localhost:3000/api/iam/roles")
      .then((response) => response.json())
      .then((response) => {
          _callback(response);
      });
}

export const handleLoadRoles = async (_callback: CallbackFunctionSubjectLoaded) => {
  await loadRoles(_callback);
}

export const handleDeleteRole = async (id: number, _callback: CallbackFunctionDefault) => {
  const res = await fetch("http://localhost:3000/api/iam/roles?roleId="+id,{
    method: 'DELETE',
  }).then((response: Response) => _callback());
}

export const createRole = async (_role: NewRoleType, _callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/roles',
    {
      method: 'POST',
      body: JSON.stringify(_role),
      headers: {
        'content-type': 'application/json'
      }
    }).then((response) => _callback());
}

/**
 * GROUPS
 */
const loadGroups = async (_callback: CallbackFunctionSubjectLoaded) => {
    await fetch("http://localhost:3000/api/iam/groups")
      .then((response) => response.json())
      .then((response) => {
        _callback(response);
      });
}

export const handleLoadGroups = async (_callback: CallbackFunctionSubjectLoaded) => {
    await loadGroups(_callback);
}

export const handleDeleteGroup = async (id: number, callback: CallbackFunctionDefault) => {
  const res = await fetch("http://localhost:3000/api/iam/groups?groupId="+id,{
    method: 'DELETE',
  }).then((response: Response) => callback());
}

export const createGroup = async (_group: NewExtendedGroupType, _callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/groups',
    {
      method: 'POST',
      body: JSON.stringify(_group),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => _callback());
}

export const handleCreateGroup = async (_group: NewExtendedGroupType, _callback: CallbackFunctionDefault) => {
  await createGroup(_group, _callback);
}

export const updateGroup = async (_group: NewExtendedGroupType, _callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/groups',
    {
      method: 'PUT',
      body: JSON.stringify(_group),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => _callback());
}

export const handleUpdateGroup = async (_group: NewExtendedGroupType, _callback: CallbackFunctionDefault) => {
  await updateGroup(_group, _callback);
}

/**
 * USERS
 */
const loadUsers = async (_callback: CallbackFunctionSubjectLoaded) => {
  await fetch("http://localhost:3000/api/iam/users")
    .then((response) => response.json())
    .then((response) => {
      _callback(response);
    });
}

export const handleLoadUsers = async (_callback: CallbackFunctionSubjectLoaded) => {
  await loadUsers(_callback);
}

const deleteUser = async (_id: number, _callback: CallbackFunctionDefault) => {
  const res = await fetch("http://localhost:3000/api/iam/users?userId="+_id,{
    method: 'DELETE',
  }).then((response: Response) => _callback());
}

export const handleDeleteUser = async (_id: number, _callback: CallbackFunctionDefault) => {
  await deleteUser(_id, _callback);
}

export const createUser = async (_user: NewExtendedUserType, _callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/users',
    {
      method: 'POST',
      body: JSON.stringify(_user),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => _callback());
}

export const handleCreateUser = async (_user: NewExtendedUserType, _callback: CallbackFunctionDefault) => {
  await createUser(_user, _callback);
}

export const updateUser = async (_user: NewExtendedUserType, _callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/users',
    {
      method: 'PUT',
      body: JSON.stringify(_user),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => _callback());
}

export const handleUpdateUser = async (_user: NewExtendedUserType, _callback: CallbackFunctionDefault) => {
  await updateUser(_user, _callback);
}
