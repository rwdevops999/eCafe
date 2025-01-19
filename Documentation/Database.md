# IAM

# Services and actions and resources

Service (Stock, Contacts, ...)

id
uuid
name
create_date
create_user
update_date
update_user

servicesactions (mapping between services and actions: n-n)

serviceid
actionid

action (List, Create, ...)

id
name
description
create_date
create_user
update_date
update_user

actionsresources (mapping between actions and resources n-n)

actionid
resourceid

resource (Order, Delivery, ...)

id
uuid
name
sdescription
mdescription
create_date
create_user
update_date
update_user

stock
    overview        (list)
    orders          (list, create, get, update, delete)
    deliveries      (list, create, get, update, delete)
    collects        (list, create, get, update, delete)
    import          (execute)
    export          (execute)

contacts
    providers       (list, create, get, update, delete)
    customers       (list, create, get, update, delete)
    employees       (list, create, get, update, delete)
    others          (list, create, get, update, delete)

messages
    notifications   (list, create, get, update, delete)
    mails           (list, create, get, update, delete)
    chat            (list, create, get, update, delete)
documents
    upload          (execute)
    download        (execute)
    tickets         (list, create, get, update, delete)
    overview        (list)
    search          (execute)
logistics
    website         (create, get, update, delete)
    leaflets        (list, create, get, update, delete)
    promotions      (list, create, get, update, delete)
    materials       (list, create, get, update, delete)
history             (list)
meetings            (list, create, get, update, delete, list)
access
    user groups     (list, create, get, update, delete, list)
    users           (list, create, get, update, delete, list)
    roles           (list, create, get, update, delete, list)
    policies        (list, create, get, update, delete, list)
    statements      (create, get, update, delete, list)
    services        (list)
settings
    general         (list, update)
    storage         (list, update)
    limits          (list, create, get, update, delete)
user
    profile         (create, get, update, delete)
    notifications   (list)
ecafe
    dashboard       (list)

