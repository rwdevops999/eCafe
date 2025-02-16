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

export const handleLoadServicesDB = async (_includeCountries: boolean, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch('http://localhost:3000/api/db?table=Services&countries='+_includeCountries,{
    method: 'POST',
    body: JSON.stringify("initialise DB?"),
    headers: {
      'content-type': 'application/json'
    }
  })
  .then((response: Response) => response.json())
  .then((response: ApiResponseType) => _callback(response))
  .catch((error: any) => console.log("ERROR DB(handleLoadServicesDB)", js(error)));
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
const loadGroups = async (_callback: CallbackFunctionWithParam): Promise<void> => {
    await fetch("http://localhost:3000/api/iam/groups")
      .then((response: Response) => response.json())
      .then((response: ApiResponseType) => {_callback(response)})
      .catch((error: any) => console.log("loadGroups", "ERROR loading groups", js(error)));
    }

export const handleLoadGroups = async (_callback: CallbackFunctionWithParam): Promise<void> => {
    await loadGroups(_callback);
}

export const handleDeleteGroup = async (id: number, callback: CallbackFunctionWithParam): Promise<void> => {
  const res = await fetch("http://localhost:3000/api/iam/groups?groupId="+id,{
    method: 'DELETE',
  })
  .then((response: Response) => response.json())
  .then((response: ApiResponseType) => callback(response))
  .catch((error: any) => console.log("handleDeleteGroup", "ERROR deleting group", js(error)));
}

const createGroup = async (_group: ExtendedGroupType, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch('http://localhost:3000/api/iam/groups',
    {
      method: 'POST',
      body: JSON.stringify(_group),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => _callback(response))
    .catch((error: any) => console.log("createGroup", "ERROR creating group", js(error)));
  }

export const handleCreateGroup = async (_group: ExtendedGroupType, _callback: CallbackFunctionWithParam): Promise<void> => {
  await createGroup(_group, _callback);
}

const updateGroup = async (_group: ExtendedGroupType, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch('http://localhost:3000/api/iam/groups',
    {
      method: 'PUT',
      body: JSON.stringify(_group),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => _callback(response))
    .catch((error: any) => console.log("updateGroup", "ERROR updating group", js(error)));
}

export const handleUpdateGroup = async (_group: ExtendedGroupType, _callback: CallbackFunctionWithParam): Promise<void> => {
  await updateGroup(_group, _callback);
}

// OTP
const loadOTP = async (_otpId: string, _callback: CallbackFunctionWithParam, additional?: any): Promise<void> => {
  await fetch("http://localhost:3000/api/otp?otpId=" + _otpId)
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => {_callback(response, additional)})
    .catch((error: any) => console.log("LOADOTP", "ERROR LOADING OTP", js(error)));
}

export const handleLoadOTP = async (_otpId: string, _callback: CallbackFunctionWithParam, additional?: any) => {
  await loadOTP(_otpId, _callback, additional);
}

export const createOTP = async (_otp: OtpType, _callback: CallbackFunctionWithParam): Promise<void> => {
  console.log("OTP in DB.ts", JSON.stringify(_otp));
  await fetch('http://localhost:3000/api/otp',
    {
      method: 'POST',
      body: JSON.stringify(_otp),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => _callback(response))
    .catch((error: any) => console.log("createOTP", "ERROR creating OTP", js(error)));
}

const updateOtp = async (_otp: OtpType, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch('http://localhost:3000/api/otp',
    {
      method: 'PUT',
      body: JSON.stringify(_otp),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => _callback(response))
    .catch((error: any) => console.log("updateOTP", "ERROR updating OTP", js(error)));
}

export const handleUpdateOtp = async (_otp: OtpType, _callback: CallbackFunctionWithParam): Promise<void> => {
  await updateOtp(_otp, _callback);
}

export const deleteOtpById = async (_otpId: number, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch("http://localhost:3000/api/otp?otpId="+_otpId,{
      method: 'DELETE',
  })
  .then((response: Response) => response.json())
  .then((response: ApiResponseType) => _callback(response))
  .catch((error: any) => console.log("deleteOTPById", "ERROR deleting OTP by id", js(error)));
}

export const handleDeleteOtpById = async (_otpId: number, _callback: CallbackFunctionWithParam): Promise<void> => {
  await deleteOtpById(_otpId, _callback);
}

export const deleteExpiredOtpsByEmail = async (_email: string, _callback: CallbackFunctionWithParam, additional?: any): Promise<void> => {
  await fetch(`http://localhost:3000/api/otp?email=${_email}`,{
      method: 'DELETE',
  })
  .then((response: Response) => response.json())
  .then((response: ApiResponseType) => _callback(response, additional))
  .catch((error: any) => console.log("deleteOTPByEmailAndDate", "ERROR deleting OTP by email and date", js(error)));
}

export const handleDeleteExpiredOtpsByEmail = async (_email: string, _callback: CallbackFunctionWithParam, additional?: any): Promise<void> => {
  await deleteExpiredOtpsByEmail(_email, _callback, additional);
}






// TASKS
const loadTasks = async (open: boolean, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch("http://localhost:3000/api/task?open="+open)
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => _callback(response))
    .catch((error: any) => console.log("loadTasks", "ERROR loading tasks", js(error)));
  }

export const handleLoadAllTasks = async (_callback: CallbackFunctionWithParam): Promise<void> => {
  await loadTasks(false, _callback);
}

export const handleLoadOpenTasks = async (_callback: CallbackFunctionWithParam): Promise<void> => {
  await loadTasks(true, _callback);
}

const loadTaskById = async (_taskId: number, _callback: CallbackFunctionWithParam, additional: any): Promise<void> => {
  await fetch("http://localhost:3000/api/task?taskId="+_taskId)
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => _callback(response, additional))
    .catch((error: any) => console.log("loadTaskById", "ERROR loading task by id", js(error)));
}

export const handleLoadTaskById = async (_taskId: number, _callback: CallbackFunctionWithParam, additional?: any): Promise<void> => {
  await loadTaskById(_taskId, _callback, additional);
}

export const createTask = async (task: TaskType, _callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch('http://localhost:3000/api/task',
    {
      method: 'POST',
      body: JSON.stringify(task),
      headers: {
        'content-type': 'application/json'
      }
    })
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => _callback(response))
    .catch((error: any) => console.log("createTask", "ERROR creating task", js(error)));
}


// HISTORY
// Use createHistoryType to create an instance of HistoryType
const loadHistory = async (_callback: CallbackFunctionWithParam): Promise<void> => {
  await fetch("http://localhost:3000/api/history")
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => {_callback(response)})
    .catch((error: any) => console.log("loadHistory", "ERROR loading history", js(error)));
}

export const handleLoadHistory = async (_callback: CallbackFunctionWithParam): Promise<void> => {
  await loadHistory(_callback);
}

export const createHistory = async (_history: HistoryType, _callback?: CallbackFunctionWithParam): Promise<void> => {
  await fetch('http://localhost:3000/api/history',
    {
      method: 'POST',
      body: JSON.stringify(_history),
      headers: {
        'content-type': 'application/json'
        }
    })
    .then((response: Response) => response.json())
    .then((response: ApiResponseType) => _callback ? _callback(response) : () => {})
    .catch((error: any) => console.log("createHistory", "ERROR creating history", js(error)));
}


