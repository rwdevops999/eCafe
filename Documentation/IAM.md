# IAM

## Services

Just for informational purposes.

Available services:

- Stock
- Contacts
- Messages
- Documents
- Logistics
- History
- Meetings
- Access (IAM)
- Settings
- User
- eCAFé

### View

Sidebar >>> Access (IAM) >>> Services

### Structure

>> iam-scheme.ts

ServiceType

{
    name: string,                   // service name
    children: [                     // possible service actions
        {
            actionId: string        // action ID (uuidv4)
            actionName: string      // action name
        }
    ]
}

### Default

defaultService: { name: "Stock" } 

### API

#### GET

In case no result is found, [] is returned.

http://localhost:3000/api/iam/services{?service=[*|ServiceName]}

* (NO PARAM) http://localhost:3000/api/iam/services
    return all services (and their associated actions)

* (PARAM service  = `*`) http://localhost:3000/api/iam/services?service=*
    return all services (and their associated actions)

* (PARAM service  = name) http://localhost:3000/api/iam/services?service=ServiceName
    return the requested service and its associated actions

## Actions

Actions are the actions which can be executed in a service

### Structure

>> iam-scheme.ts

ActionType

{
    actionId: string,       // the action ID (uuidv4)
    actionName: string,     // the action name
}

There is another structure available for the service view:

FlatActionType

{
    service: string,        // the service name
    action: string          // the action name
}

### View

No View assigned

### Default

No specific default

### API

No API provided

## Service Statements

A service statement is a combination of actions of a service with a permission (Allow or Deny). The service statement is identified  
by its sid (a explanation name).

### Structure

>> iam-scheme.ts

ServiceStatementType

{
     id: string,                                // service ID (uuidv4)
     serviceName: string,                       // service name 
     sid: z.string().min(3).max(25),            // service access level
     description: z.string().min(3).max(50),    // description
     permission: z.string(),                    // permission ('Allow'|'Deny')
     children: z.array(actionScheme),           // the selected action for this statement
//     resource: resourceScheme.optional(),     // the resource (future use)
//     condition: conditionScheme.optional(),   // the condition (future use)
}

### View

Sidebar >>> Access (IAM) >>> Statements

### Default

No default

### API

#### GET

http://localhost:3000/api/iam/statements{?service=[*|ServiceName]&sid=[*|SidName]}

* (1) (NO PARAM) http://localhost:3000/api/iam/statements
    Return all statements

* (2) (PARAM service=`*`) http://localhost:3000/api/iam/statements?service=*
    Return all statements for all services
    (== (1))

* (3) (PARAM service=`*` & sid=`*`) http://localhost:3000/api/iam/statements?service=*&sid=*
    Return all statements for all services containing all sids
    (== (1))

* (4) (PARAM service=`*` & sid=name) http://localhost:3000/api/iam/statements?service=*&sid=SidName
    Return all statements for all services containing a certain sid

* (5) (PARAM service=name) http://localhost:3000/api/iam/statements?service=ServiceName
    Return all statements for a certain service

* (6) (PARAM service=name $ sid=`*`) http://localhost:3000/api/iam/statements?service=ServiceName&sid=*
    Return all statements for a certain service containing all sids
    (== (3))

* (7) (PARAM service=name $ sid=name) http://localhost:3000/api/iam/statements?service=ServiceName&sid=SidName
    Return all statements for a certain service containing a certain sid

#### POST

To create a service statement.

#### DELETE

## Policies

Policies are combinations of service statements. They can contain service statements of different services. They are  
used to be assigned to roles/users and groups.

### Structure

### View

sidebar >>> Access (IAM) >>> Policies

### Default

### API
