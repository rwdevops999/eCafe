import { CallbackFunctionSubjectLoaded } from "@/data/types";

/**
 * SERVICES
 */
const loadServices = async (callback: CallbackFunctionSubjectLoaded) => {
  await fetch("http://localhost:3000/api/iam/services?service=*&depth=0")
    .then((response) => response.json())
    .then((response) => callback(response));
}

/**
 * load the services
  * set  the services is the Services state
  */
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
  

