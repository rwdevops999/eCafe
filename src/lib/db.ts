import { ApiResponseType } from "@/types/db";
import { CallbackFunctionNoParam, CallbackFunctionWithParam, ExtendedGroupType, ExtendedUserType, HistoryType, LanguageType, OtpType, PolicyType, RoleType, StatementType, TaskType, UserType } from "@/types/ecafe";
import { PrismaClient } from '@prisma/client'
import { js } from "./utils";

/**
 * DB
 */
export const initDB = async (_table: string, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch('http://localhost:3000/api/db?table='+_table,{
    method: 'POST',
    body: JSON.stringify("initialise DB?"),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then((response: Response) => response.json())
  .then((response: ApiResponseType) => _callback(response))
  .catch((error: any) => console.log("ERROR DB(initDB)", js(error)));
}

export const handleClearDB = async (_startup: boolean, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch("http://localhost:3000/api/db?startup="+_startup,{
      method: 'DELETE',
  })
  .then((response: Response) => response.json())
  .then((response: ApiResponseType) => _callback(response))
  .catch((error: any) => console.log("handleClearDB", `ERROR clear tables with startup included: ${_startup}`, js(error)));
}

 /**
 * LANGUAGES
 */
const loadLanguages = async (_callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch("http://localhost:3000/api/languages")
    .then((response) => response.json())
    .then((response: ApiResponseType) => _callback(response))
    .catch((error: any) => console.log("loadLanguages", `ERROR loading the languages`, js(error)));
}

export const handleLoadLanguages = async (_callback: CallbackFunctionWithParam): Promise<void> => {
  await loadLanguages(_callback);
}

/**
 * COUNTRIES
 */

const loadCountries = async (_callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch("http://localhost:3000/api/db?table=country")
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => _callback(response))
    .catch((error: any) => console.log("loadCountries", `ERROR loading the countries`, js(error)));
}

export const handleLoadCountries = async (_callback: CallbackFunctionWithParam): Promise<void> => {
    await loadCountries(_callback);
}



/**
 * SERVICES
 */
const loadServices = async (_callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch("http://localhost:3000/api/iam/services?service=*&depth=0")
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => {_callback(response)})
    .catch((error: any) => console.log("loadServices", `ERROR loading the services`, js(error)));
}

export const handleLoadServices = async (_callback: CallbackFunctionWithParam): Promise<void> => {
  await loadServices(_callback);
}

const loadServiceByName = async (_service: string, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch(`http://localhost:3000/api/iam/services?service=${_service}&depth=1`)
    .then((response: Response) => response.json())
    .then((response: ResponseType) => {_callback(response)})
    .catch((error: any) => console.log("loadServiceByName", `ERROR loading the service`, js(error)));
}

export const handleLoadServiceByName = async (_service: string, _callback: CallbackFunctionWithParam): Promise<void> => {
  await loadServiceByName(_service, _callback);
}

/**
 * STATEMENTS
 */
const loadStatements = async (_serviceId: number, _sid: string, _callback: CallbackFunctionWithParam): Promise<void> => {
    await fetch("http://localhost:3000/api/iam/statements?serviceId=" + _serviceId + "&sid=" + _sid)
      .then((response: Response) => response.json())
      .then((response: ApiResponseType) => {_callback(response);})
      .catch((error: any) => console.log("loadStatements", `ERROR loading the statements`, js(error)));
}

export const handleLoadStatements = async (_serviceId: number, _sid: string, _callback: CallbackFunctionWithParam): Promise<void> => {
  await loadStatements(_serviceId, _sid, _callback);
}


export const handleDeleteStatement = async (id: number, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch("http://localhost:3000/api/iam/statements?statementId="+id,{
      method: 'DELETE',
  })
  .then((response: Response) => response.json())
  .then((response: ApiResponseType) => _callback(response))
  .catch((error: any) => console.log("deleteStatement", `ERROR deleting the statement`, js(error)));
}

export const handleCreateStatement = async (_statement: StatementType, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch('http://localhost:3000/api/iam/statements',
    {
      method: 'POST',
      body: JSON.stringify(_statement),
      headers: {
        'content-type': 'application/json'
        }
    })
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => _callback(response))
    .catch((error: any) => console.log("createStatement", "ERROR creating the statement", js(error)));
}        

/**
 * POLICIES
 */
const loadPolicies = async (_callback: CallbackFunctionWithParam): Promise<void> => {
    await fetch("http://localhost:3000/api/iam/policies")
      .then((response: Response) => response.json())
      .then((response: ApiResponseType) => {_callback(response)})
      .catch((error: any) => console.log("loadPolicies", "ERROR loading the policies", js(error)));
    }

export const handleLoadPolicies = async (_callback: CallbackFunctionWithParam) => {
  await loadPolicies(_callback);
}

const loadPolicyByName = async (_policy: string, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch("http://localhost:3000/api/iam/policies?policy=" + _policy)
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => {_callback(response)})
    .catch((error: any) => console.log("loadPolicyByName", "ERROR loading the policy by name", js(error)));
  }

export const handleLoadPolicyByName = async (_policy: string, _callback: CallbackFunctionWithParam): Promise<void> => {
    await loadPolicyByName(_policy, _callback);
}

export const handleDeletePolicy = async (id: number, _callback: CallbackFunctionWithParam): Promise<void> => {
  const res = await fetch("http://localhost:3000/api/iam/policies?policyId="+id,{
      method: 'DELETE',
  })
  .then((response: Response) => response.json())
  .then((response: ApiResponseType) => _callback(response))
  .catch((error: any) => console.log("handleDeletePolicy", "ERROR deleting the policy", js(error)));
}

export const handleCreatePolicy = async (_policy: PolicyType, _callback: CallbackFunctionWithParam) => {
  await fetch('http://localhost:3000/api/iam/policies',
    {
      method: 'POST',
      body: JSON.stringify(_policy),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => _callback(response))
    .catch((error: any) => console.log("handleCreatePolicy", "ERROR creating the policy", js(error)));
  }

/**
 * ROLES
 */
const loadRoles = async (_callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch("http://localhost:3000/api/iam/roles")
      .then((response: Response) => response.json())
      .then((response: ApiResponseType) => {_callback(response)})
      .catch((error: any) => console.log("loadRoles", "ERROR loading the roles", js(error)));
    }

export const handleLoadRoles = async (_callback: CallbackFunctionWithParam) => {
  await loadRoles(_callback);
}

export const handleDeleteRole = async (id: number, _callback: CallbackFunctionWithParam): Promise<void> => {
  const res = await fetch("http://localhost:3000/api/iam/roles?roleId="+id,{
    method: 'DELETE',
  })
  .then((response: Response) => response.json())
  .then((response: ApiResponseType) => _callback(response))
  .catch((error: any) => console.log("handleDeleteRole", "ERROR deleting the role", js(error)));
}

export const handleCreateRole = async (_role: RoleType , _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch('http://localhost:3000/api/iam/roles',
    {
      method: 'POST',
      body: JSON.stringify(_role),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => _callback(response))
    .catch((error: any) => console.log("handleCreateRole", "ERROR creating the role", js(error)));
}






/**
 * USERS
 */
const loadUsers = async (_callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch("http://localhost:3000/api/iam/users")
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => {_callback(response)})
    .catch((error: any) => console.log("loadUsers", "ERROR loading the users", js(error)));
}

export const handleLoadUsers = async (_callback: CallbackFunctionWithParam): Promise<void> => {
  await loadUsers(_callback);
}

const loadUserByEmail = async (email: string, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch("http://localhost:3000/api/iam/users?email="+email)
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => {_callback(response, email)})
    .catch((error: any) => console.log("loadUsersByEmail", "ERROR loading the user using the email", js(error)));
}

export const handleLoadUserByEmail = async (email: string, _callback: CallbackFunctionWithParam) => {
  await loadUserByEmail(email, _callback);
}

const loadUserById = async (_id: number, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch("http://localhost:3000/api/iam/users?id="+_id)
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => {_callback(response)})
    .catch((error: any) => console.log("loadUserById", "ERROR loading the user by id", js(error)));
}

export const handleLoadUserById = async (_id: number, _callback: CallbackFunctionWithParam): Promise<void> => {
  await loadUserById(_id, _callback);
}

const deleteUser = async (_id: number, _callback: CallbackFunctionWithParam): Promise<void> => {
  const res = await fetch("http://localhost:3000/api/iam/users?userId="+_id,{
    method: 'DELETE',
  })
  .then((response: Response) => response.json())
  .then((response: ApiResponseType) => _callback(response))
  .catch((error: any) => console.log("deleteUser", "ERROR delete user", js(error)));
}

export const handleDeleteUser = async (_id: number, _callback: CallbackFunctionWithParam): Promise<void> => {
  await deleteUser(_id, _callback);
}

const createUser = async (_user: ExtendedUserType, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch('http://localhost:3000/api/iam/users',
    {
      method: 'POST',
      body: JSON.stringify(_user),
      headers: {
        'content-type': 'application/json'
      }
  })
  .then((response: Response) => response.json())
  .then((response: ApiResponseType) => _callback(response))
  .catch((error: any) => console.log("createUser", "ERROR create user", js(error)));
}

export const handleCreateUser = async (_user: ExtendedUserType, _callback: CallbackFunctionWithParam): Promise<void> => {
  await createUser(_user, _callback);
}

const updateUser = async (_user: ExtendedUserType, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch('http://localhost:3000/api/iam/users',
    {
      method: 'PUT',
      body: JSON.stringify(_user),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => _callback(response))
    .catch((error: any) => console.log("updateUser", "ERROR update user", js(error)));
  }

export const handleUpdateUser = async (_user: ExtendedUserType, _callback: CallbackFunctionWithParam): Promise<void> => {
  await updateUser(_user, _callback);
}

const unblockUser = async (_userId: number, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch(`http://localhost:3000/api/iam/users?userId=${_userId}`,
    {
      method: 'PUT',
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => _callback(response))
    .catch((error: any) => console.log("unblockUser", "ERROR unblocking user", js(error)));
}

export const handleUnblockUser = async (_userId: number, _callback: CallbackFunctionWithParam): Promise<void> => {
  await unblockUser(_userId, _callback);
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

const createGroup = async (_group: ExtendedGroupType, _callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/groups',
    {
      method: 'POST',
      body: JSON.stringify(_group),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => _callback());
}

export const handleCreateGroup = async (_group: ExtendedGroupType, _callback: CallbackFunctionDefault) => {
  await createGroup(_group, _callback);
}

const updateGroup = async (_group: ExtendedGroupType, _callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/groups',
    {
      method: 'PUT',
      body: JSON.stringify(_group),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => _callback());
}

export const handleUpdateGroup = async (_group: ExtendedGroupType, _callback: CallbackFunctionDefault) => {
  await updateGroup(_group, _callback);
}













// OTP
export const createOTP = async (_otp: OtpType, _callback: CallbackFunctionSubjectLoaded) => {
  console.log("OTP in DB.ts", JSON.stringify(_otp));
  await fetch('http://localhost:3000/api/otp',
    {
      method: 'POST',
      body: JSON.stringify(_otp),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(response => _callback(response));
}

const loadOTP = async (_otpId: string, _callback: CallbackFunctionSubjectLoaded, additional?: any) => {
  await fetch("http://localhost:3000/api/otp?otpId=" + _otpId)
    .then((response) => response.json())
    .then((response) => {
      _callback(response, additional);
    });
}

export const handleLoadOTP = async (_otpId: string, _callback: CallbackFunctionSubjectLoaded, additional?: any) => {
  await loadOTP(_otpId, _callback, additional);
}

const updateOtp = async (_otp: OtpType, _callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/otp',
    {
      method: 'PUT',
      body: JSON.stringify(_otp),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => _callback());
}

export const handleUpdateOtp = async (_otp: OtpType, _callback: CallbackFunctionDefault) => {
  await updateOtp(_otp, _callback);
}

export const deleteFromOtpById = async (_otpId: number, _callback: CallbackFunctionDefault) => {
  await fetch("http://localhost:3000/api/otp?otpId="+_otpId,{
      method: 'DELETE',
  }).then((response: Response) => _callback());
}

export const handleDeleteFromOtpById = (_otpId: number, _callback: CallbackFunctionDefault) => {
  deleteFromOtpById(_otpId, _callback);
}

export const deleteFromOtpByEmailAndDate = async (_email: string, _date: string, _callback: CallbackFunctionSubjectLoaded, additional?: any) => {
  await fetch(`http://localhost:3000/api/otp?email=${_email}&expdate=${_date}`,{
      method: 'DELETE',
  })
  .then(response => response.json())
  .then(response => _callback(response, additional));
}

export const handleDeletefromOtpByEmailAndDate = (_email: string, _expireDate: string, _callback: CallbackFunctionSubjectLoaded, additional?: any) => {
  deleteFromOtpByEmailAndDate(_email, _expireDate, _callback, additional);
}

// TASKS
export const createTask = async (task: TaskType, _callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/task',
    {
      method: 'POST',
      body: JSON.stringify(task),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(response => _callback());
}

const loadTasks = async (open: boolean, _callback: CallbackFunctionSubjectLoaded) => {
  await fetch("http://localhost:3000/api/task?open="+open)
    .then((response) => response.json())
    .then((response) => _callback(response));
}

export const handleLoadTasks = async (_callback: CallbackFunctionSubjectLoaded) => {
  await loadTasks(false, _callback);
}

export const handleLoadOpenTasks = async (_callback: CallbackFunctionSubjectLoaded) => {
  await loadTasks(true, _callback);
}

const loadTask = async (_taskId: number, _callback: CallbackFunctionSubjectLoaded, additional: any) => {
  await fetch("http://localhost:3000/api/task?taskId="+_taskId)
    .then((response) => response.json())
    .then((response) => _callback(response, additional));
}

export const handleLoadTask = async (_taskId: number, _callback: CallbackFunctionSubjectLoaded, additional?: any) => {
  await loadTask(_taskId, _callback, additional);
}

const prisma = new PrismaClient()

const tableNames = ['Action', 'Address', 'Country', 'Group','OTP', 'Policy', 'Role', 'Service', 'ServiceStatement', 'StatementAction', 'Task', 'User'];
const relationTableNames = ['_GroupToPolicy', '_GroupToRole', '_GroupToUser', '_PolicyToRole','_PolicyToServiceStatement', '_PolicyToUser', '_RoleToUser'];

export const flushAll = async () => {
  for (const tableName of tableNames) await prisma.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);
  for (const tableName of relationTableNames) await prisma.$queryRawUnsafe(`Truncate "${tableName}" restart identity cascade;`);
}

// HISTORY
// Use 
// createHistoryType to create an instance of HistoryType
export const addHistory = async (_history: HistoryType, _callback?: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/history',
    {
      method: 'POST',
      body: JSON.stringify(_history),
      headers: {
        'content-type': 'application/json'
        }
    }).then(response => (_callback ? _callback() : () => {}));
}

const loadHistory = async (_callback: CallbackFunctionSubjectLoaded) => {
  await fetch("http://localhost:3000/api/history")
    .then((response) => response.json())
    .then((response) => {
      _callback(response);
    });
}

export const handleLoadHistory = async (_callback: CallbackFunctionSubjectLoaded) => {
  await loadHistory(_callback);
}

