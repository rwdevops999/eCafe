
/**
 * ROLES
 */

import { CallbackFunctionSubjectLoaded } from "@/data/types";

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
  

