# IAM (user stories)

## Services

### overview
1. [ ] a list of services is shown
2. [ ] we need to see which actions are attached to each service
3. [ ] we can select a certain service to see its details only
4. [ ] the service view is informational only
5. [ ] services can be filtered

## Statements  

### overview
1. [ ] a list of statements is shown
2. [ ] for each statement we can view whict actions are linked to it
3. [ ] clicking on an action shows the services screen with the service selected
4. [ ] statements can be show depending on theit action (allowed or denied)
5. [ ] statements can be filtered
6. [ ] there should be an indication that the statement is managed
7. [ ] managed services can't be deleted
8. [ ] statements attached to policies can't be deleted (until the policy is deleted)

### creation
1. [ ] the statement name and sid are mandatory
2. [ ] a statement can be managed
3. [ ] a statement can be an allow or a deny statement
4. [ ] a statement can contain at least one service action

### update
1. [ ] the statement name and sid are mandatory
2. [ ] a statement can be managed
3. [ ] a statement can be an allow or a deny statement
4. [ ] a statement can contain at least one service action
5. [ ] updating a statement should be immediate

### validation
1. [ ] no validation on statements

## Policies

### overview
1. [ ] a list of policies is shown
2. [ ] policies can be managed
3. [ ] there should be an indication that the policy is managed
4. [ ] is should be possible to view which statements there are in the policy
5. [ ] clicking on the statement goes to the statement view
6. [ ] policies can be filtered
7. [ ] a managed policy can not be deleted (only by admin)
8. [ ] a policy can't be deleted when attached to an user
9. [ ] a policy can't be deleted when attached to a group

### creation
1. [ ] the policy name is manadatory
2. [ ] a policy can be indicated to be managed
3. [ ] a policy should contain at least one statement

### update
1. [ ] the policy name is manadatory
2. [ ] a policy can be indicated to be managed
3. [ ] a policy should contain at least one statement
4. [ ] an update should be immediate

### validation
1. [ ] whene there is one statement attached, no validation is required
2. [ ] validation is required when there are two or more statements
3. [ ] creation is prohibited when validation fails

## Roles

### overview
1. [ ] a list of roles is shown
2. [ ] roles can be managed
3. [ ] there should be an indication that the role is managed
4. [ ] is should be possible to view which policies there are in the policy
5. [ ] clicking on the policy goes to the policy view
6. [ ] roles can be filtered
7. [ ] a managed role can not be deleted (only by admin)
8. [ ] a role can't be deleted when attached to an user
9. [ ] a role can't be deleted when attached to a group

### creation
1. [ ] the role name is manadatory
2. [ ] a role can be indicated to be managed
3. [ ] a role should contain at least one policy
4. [ ] creation can be only possible after successfull validation

### update
1. [ ] the role name is manadatory
2. [ ] a role can be indicated to be managed
3. [ ] a role should contain at least one policy
4. [ ] update can be only possible after successfull validation
5. [ ] update should be immediate

### validation
1. [ ] no validation is neccessary if there in only one policy attached
2. [ ] validation is mandatory if there are > 2 policies attached
3. [ ] creation/update is only allowed after successfull validation

## Users

### overview
1. [ ] a list of users is shown
2. [ ] we should be able to filter on the users
3. [ ] an user can be deleted 

### creation
1. [ ] name and firstname and email are mandatory
2. [ ] password is mandatory when no OTP requested
3. [ ] OTP can be requested
4. [ ] roles/policies and groups are optional
5. [ ] validation is only required when the sum of attached roles/policies and groups is more than 2
6. [ ] creation is only possible when validation is valid (or no more than 1 dependency is used)
7. [ ] clicking on dependecy goes to that dependency screen

### update
1. [ ] name and firstname and email are mandatory
2. [ ] password is mandatory when no OTP requested
3. [ ] OTP can be requested
4. [ ] roles/policies and groups are optional
5. [ ] validation is only required when the sum of attached roles/policies and groups is more than 2
6. [ ] update is only possible when validation is valid (or no more than 1 dependency is used)
7. [ ] update is immediate
8. [ ] clicking on dependecy goes to that dependency screen

### validation
1. [ ] if not more than one dependency is selected, no validation is required
2. [ ] validation is required when there are more than 1 dependency

## Groups

### overview
1. [ ] a list of groups is shown
2. [ ] we should be able to filter on the groups
3. [ ] a group can be deleted when there are no users in the group

### creation
1. [ ] name is mandatory
2. [ ] roles/policies and users are optional
3. [ ] validation is only required when the sum of attached roles/policies and users is more than 2
4. [ ] creation is only possible when validation is valid (or no more than 1 dependency is used)
5. [ ] clicking on dependecy goes to that dependency screen

### update
1. [ ] name is mandatory
2. [ ] roles/policies and users are optional
3. [ ] validation is only required when the sum of attached roles/policies and users is more than 2
4. [ ] update is only possible when validation is valid (or no more than 1 dependency is used)
5. [ ] update is immediate
6. [ ] clicking on dependecy goes to that dependency screen

### validation
1. [ ] if not more than one dependency (except with when users are attached) is selected, no validation is required
2. [ ] validation is required when there are more than 1 dependency
