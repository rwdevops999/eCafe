'use client'

import { DataTable } from "@/components/datatable/data-table";
import AlertTable from "@/components/ecafe/alert-table";
import { Button } from "@/components/ui/button";
import { ActionType, GroupType, PolicyType, RoleType, ServiceStatementType, UserType } from "@/data/iam-scheme";
import { AlertTableType, AlertType } from "@/data/types";
import { Data } from "@/lib/mapping";
import { log } from "@/lib/utils";
import { useState } from "react";
import { columns } from "./table/columns";
import TooltipMessage from "./tooltip-message";

const user = {
	id:28,
  firstname:"xxx",
  name:"yyy",
  email:"aaa@bbb.ccc",
  password:"ddddeeee",
  phone:"",
  phonecode:"",
	address:{
    id:28,
    street:"",
    number:"",
    box:"",
    city:"",
    postalcode:"",
    county:"",
    country:{
      id:24,
      name:"Belgium",
      dialCode:"+32",
      code:"BE"
    }
  },

	roles:{
    original:[
      {
        id:4,
        name:"Role11",
        description:"role11",
        managed:false,
        createDate:"2025-01-25T07:17:41.303Z",
        updateDate:"2025-01-25T07:17:41.303Z",
        policies:[
          {
            id:7,
            name:"Policy11",
            description:"policy11",
            managed:false,
            createDate:"2025-01-25T07:16:55.322Z",
            updateDate:"2025-01-25T07:16:55.322Z",
			      statements:[
              {
                id:9,
                sid:"Statement11",
                description:"statement11",
                permission:"Deny",
                managed:false,
                createDate:"2025-01-25T07:16:04.383Z",
                updateDate:"2025-01-25T07:16:04.383Z",
                serviceId:13,
				        actions:[
                  {
                    id:9,
                    name:"CreateMail",
                    createDate:"2025-01-25T07:16:04.383Z",
                    updateDate:"2025-01-25T07:16:04.383Z",
                    statementId:9,
                    actionId:29
                  }
                ]
              }
            ]
		      }
        ]
	    }
    ]
  },

	policies:
  {
    original:[
      {
        id:8,
        name:"Policy3",
        description:"policy3",
        managed:false,
        createDate:"2025-01-25T08:10:14.051Z",
        updateDate:"2025-01-25T08:10:14.051Z",
		    statements:[
          {
            id:10,
            sid:"Statement3",
            description:"statement3",
            permission:"Allow",
            managed:false,
            createDate:"2025-01-25T08:09:48.400Z",
            updateDate:"2025-01-25T08:09:48.400Z",
            serviceId:19,
            actions:[
              {
                id:10,
                name:"ListHistory",
                createDate:"2025-01-25T08:09:48.400Z",
                updateDate:"2025-01-25T08:09:48.400Z",
                statementId:10,
                actionId:72
              }
            ]
          }
        ]
      }
    ]
	},

	groups:
  {
    original:[
      {
        id:4,
        name:"Group1",
        description:"group1",
        roles:[
          {
            id:3,
            name:"Role1",
            description:"role1",
            managed:false,
            createDate:"2025-01-25T07:17:22.325Z",
            updateDate:"2025-01-25T07:17:22.325Z",
            policies:[
              {
                id:6,
                name:"Policy1",
                description:"policy1",
                managed:false,
                createDate:"2025-01-25T07:16:39.707Z",
                updateDate:"2025-01-25T07:16:39.707Z",
                statements:[
                  {
                    id:8,
                    sid:"Statement1",
                    description:"statement1",
                    permission:"Allow",
                    managed:false,
                    createDate:"2025-01-25T07:15:36.781Z",
                    updateDate:"2025-01-25T07:15:36.781Z",
                    serviceId:13,
                    actions:[
                      {
                        id:8,
                        name:"CreateMail",
                        createDate:"2025-01-25T07:15:36.781Z",
                        updateDate:"2025-01-25T07:15:36.781Z",
                        statementId:8,
                        actionId:29
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        policies:[

        ]
      }
    ]
  }
};

const roles = [
];

const policies = [
];


const groups = [
];

const Test = () => {
  const [alert, setAlert] = useState<AlertType>();
  
  const handleRemoveAlert = () => {
    setAlert(undefined);
  }

  // MAPPINGS
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

  const mapStatementsToData = (statements: any[] | undefined): Data[] => {
    let result: Data[] = [];

    if (statements) {
      result = statements.map((statement) => {
        return {
          id: statement.id,
          name: statement.sid,
          description: statement.description,
          children: mapActionsToData(statement.actions, statement.permission)
        }
      })
    }

    return result;
  };

  const mapPoliciesToData = (policies: any[] | undefined): Data[] => {
    let result: Data[] = [];

    if (policies) {
      result = policies.map((policy) => {
        return {
          id: policy.id,
          name: policy.name!,
          description: policy.description!,
          children: mapStatementsToData(policy.statements)
        }
      })
    }

    return result;
  };

  const mapRolesToData = (roles: any[]|undefined): Data[] => {
    let result: Data[] = [];

    if (roles) {
      result = roles.map((role) => {
        return {
          id: role.id,
          name: role.name!,
          description: role.description!,
          children: mapPoliciesToData(role.policies)
        }
      });
    }

    return result;
  }

  const mapGroupChildren = (group: any): Data[] => {
    let result: Data[] = [];

    const roles: Data[] = mapRolesToData(group.roles);
    log(true, "TEST", "MAPPED GROUP ROLES", roles, true);
    const policies: Data[] = mapPoliciesToData(group.policies);
    log(true, "TEST", "MAPPED GROUP POLICIES", policies, true);

    result = [...roles, ...policies];

    return result;
  }

  const mapGroupsToData = (groups: any[]|undefined): Data[] => {
    let result: Data[] = [];

    log(true, "TEST", "MAPPING GROUPS", groups, true);
    if (groups) {
      result = groups.map((group) => {
        return {
          id: group.id,
          name: group.name!,
          description: group.description!,
          children: mapGroupChildren(group)
        }
      })
    }

    return result;
  }

  // subject can be policy, role, user, group
  const mapSubjectChildren = (subject: any): Data[] => {
    let result: Data[] = [];

    let roles: Data[] = [];
    let policies: Data[] = [];
    let groups: Data[] = [];

    if (subject.roles?.original) {
      roles = mapRolesToData(subject.roles?.original);
      log(true, "TEST", "MAPPED USER ROLES", roles, true);
    }

    if (subject.policies?.original) {
      policies = mapPoliciesToData(subject.policies?.original);
      log(true, "TEST", "MAPPED USER POLICIES", policies, true);
    }

    if (subject.groups?.original) {
      groups = mapGroupsToData(subject.groups?.original);
      log(true, "TEST", "MAPPED USER GROUPS", groups, true);
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
      children: mapSubjectChildren(user)
    }

    result.push(subjectData);
    log(true, "TEST", "FULL RESULT", result, true);

    return result;
  }

  // VALIDATION
  type AccessType = {
    path: string[],
    action: string
  }

  let allowArray: AccessType[] = [];
  let denyArray: AccessType[] = [];

  const resetValidationArrays = () => {
    allowArray = [];
    denyArray = [];
  }

  const validateData = (_data: Data[], _path: string[]) => {
    _data.forEach(element => {
      if (element.children.length === 0) {
        log(true, "TEST", `REACHED ACTION ${element.name}`, _path, true);
        const item: AccessType = {
          path: [..._path],
          action: element.name
        }

        if (element.other?.access === "Allow") {
          allowArray.push(item);
        } else {
          denyArray.push(item);
        }
        // We reached the action
      } else {
        _path.push(element.name);
        validateData(element.children, _path);
        const index = _path.findIndex((_element) => _element === element.name);
        if (index !== -1) {
          _path.splice(index, 1);
        }
      }
    });
  }

  type AccessPath = {
    path: string[]
  }

  type AccessResultType = {
    action: string,
    allowed: AccessPath[],
    denied: AccessPath[]
  }

  const addActionToResult = (_result: AccessResultType[], _action: string, _allowedPath: string[], _deniedPath: string[]): AccessResultType[] => {

    let art: AccessResultType|undefined = _result.find((item) => item.action === _action);
    if (art) {
      art.allowed.push({path: _allowedPath});
      art.denied.push({path: _deniedPath});
    } else {
      _result.push({
        action: _action,
        allowed: [{path: _allowedPath}],
        denied: [{path: _deniedPath}] 
      })
    }

    return _result;
  }

  const operation = (allowed: AccessType[], denied: AccessType[]): AccessResultType[] => {
    let result: AccessResultType[] = [];

    for (let i = 0; i < allowed.length; i++) {
        let item1 = allowed[i],
            found = false;
        for (let j = 0; j < denied.length && !found; j++) {
          let item2 = denied[j],
          found = item1.action === item2.action;
          if  (found) {
            result = addActionToResult(result, item1.action, item1.path, item2.path);
          }
        }
    }

    return result;
  }
  
  const intersection = (source: AccessType[], destination: AccessType[]): AccessResultType[] => {
    return operation(source, destination);
  }
  
  const prettify = (path: any[]): string => {
    return path.join(" > ");
  }

  // MAPPING
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

  const mapConflictsToData = (conflicts: any[]): Data[] => {
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

  const validateMappedData = (data: Data[]): Data[] => {
    resetValidationArrays();
    validateData(data, []);
    let result: AccessResultType[] = intersection(allowArray, denyArray);
    return mapConflictsToData(result);
  };

  const data = [
    {
      "id":0,
      "name":"CreateMail",
      "description":"ERROR",
      "children":
      [
        {
          "id":0,
          "name":"yyy > Group1 > Role1 > Policy1 > Statement1",
          "description":"yyy > Role11 > Policy11 > Statement11",
          "children":[]
        }
      ]
    }
  ];

  // RENDERING
  const showAlert = () => {
    const alert: AlertTableType = {
      open: true,
      error: true,
      title: "Validation Errors",
      message: "Validation Errors",
      table: <DataTable data={data} columns={columns}/>,
      child: <Button className="bg-orange-400 hover:bg-orange-600" size="sm" onClick={handleRemoveAlert}>close</Button>
    };
  
    setAlert(alert);
  }

  const renderComponent = () => {
    // if (alert && alert.open) {
    //     return (<AlertTable alert={alert}></AlertTable>)
    // }

    // return <Button onClick={showAlert}>Show Alert</Button>;
    return (<TooltipMessage label="test" message="the message" className="bg-red-500" />);
  };

  return (<>{renderComponent()}</>)
}

export default Test