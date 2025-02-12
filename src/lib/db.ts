import { CallbackFunctionDefault, CallbackFunctionSubjectLoaded, ExtendedGroupType, ExtendedUserType, LanguageType, OtpType, PolicyType, RoleType, StatementType, TaskType, UserType } from "@/types/ecafe";

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

export const handleClearDB = async (_callback: CallbackFunctionDefault) => {
  await fetch("http://localhost:3000/api/db",{
      method: 'DELETE',
  }).then((response: Response) => _callback());
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
    .then((response) => {
      _callback(response);
    });
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

export const handleLoadServicesWithServiceName = async (_service: string, _callback: CallbackFunctionSubjectLoaded) => {
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

export const handleCreateStatement = async (_statement: StatementType, _callback: CallbackFunctionDefault) => {
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

export const handleLoadPoliciesWithPolicyName = async (_policy: string, _callback: CallbackFunctionSubjectLoaded) => {
    await loadPoliciesWithName(_policy, _callback);
}

export const handleDeletePolicy = async (id: number, _callback: CallbackFunctionDefault) => {
  const res = await fetch("http://localhost:3000/api/iam/policies?policyId="+id,{
      method: 'DELETE',
  }).then((response: Response) => _callback());
}

export const handleCreatePolicy = async (_policy: PolicyType, _callback: CallbackFunctionDefault) => {
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

export const handleCreateRole = async (_role: RoleType , _callback: CallbackFunctionDefault) => {
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

const loadUserByEmail = async (email: string, _callback: CallbackFunctionSubjectLoaded) => {
  await fetch("http://localhost:3000/api/iam/users?email="+email)
    .then((response) => response.json())
    .then((response) => {
      _callback(response, email);
    });
}

export const handleLoadUserByEmail = async (email: string, _callback: CallbackFunctionSubjectLoaded) => {
  await loadUserByEmail(email, _callback);
}

const loadUserById = async (_id: number, _callback: CallbackFunctionSubjectLoaded) => {
  await fetch("http://localhost:3000/api/iam/users?id="+_id)
    .then((response) => response.json())
    .then((response) => {
      _callback(response);
    });
}

export const handleLoadUserById = async (_id: number, _callback: CallbackFunctionSubjectLoaded) => {
  await loadUserById(_id, _callback);
}

const deleteUser = async (_id: number, _callback: CallbackFunctionDefault) => {
  const res = await fetch("http://localhost:3000/api/iam/users?userId="+_id,{
    method: 'DELETE',
  }).then((response: Response) => _callback());
}

export const handleDeleteUser = async (_id: number, _callback: CallbackFunctionDefault) => {
  await deleteUser(_id, _callback);
}

const createUser = async (_user: ExtendedUserType, _callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/users',
    {
      method: 'POST',
      body: JSON.stringify(_user),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => _callback());
}

export const handleCreateUser = async (_user: ExtendedUserType, _callback: CallbackFunctionDefault) => {
  await createUser(_user, _callback);
}

const updateUser = async (_user: ExtendedUserType, _callback: CallbackFunctionDefault) => {
  await fetch('http://localhost:3000/api/iam/users',
    {
      method: 'PUT',
      body: JSON.stringify(_user),
      headers: {
        'content-type': 'application/json'
      }
    }).then(response => _callback());
}

export const handleUpdateUser = async (_user: ExtendedUserType, _callback: CallbackFunctionDefault) => {
  await updateUser(_user, _callback);
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

const loadOTP = async (_otpId: string, _callback: CallbackFunctionSubjectLoaded) => {
  await fetch("http://localhost:3000/api/otp?otpId=" + _otpId)
    .then((response) => response.json())
    .then((response) => {
      _callback(response);
    });
}

export const handleLoadOTP = async (_otpId: string, _callback: CallbackFunctionSubjectLoaded) => {
  await loadOTP(_otpId, _callback);
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
  let data: TaskType[]= [];
  
  await fetch("http://localhost:3000/api/task?open="+open)
    .then((response) => response.json())
    .then((response) => _callback(response));
  
  return data;
}

export const handleLoadTasks = async (_callback: CallbackFunctionSubjectLoaded) => {
  await loadTasks(false, _callback);
}

export const handleLoadOpenTasks = async (_callback: CallbackFunctionSubjectLoaded) => {
  await loadTasks(true, _callback);
}
