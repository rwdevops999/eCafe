import { z } from "zod";

export type ServiceMappingType = {
  service: string,
  actions?: string[],
}

export const serviceMappings: ServiceMappingType[] = [
  {
    service: "Stock",
    actions: [
      "ListStockOverview",
      "ListOrders", 
      "GetOrder", 
      "CreateOrder", 
      "UpdateOrder", 
      "DeleteOrder",
      "ListDeliveries", 
      "GetDelivery", 
      "CreateDelivery", 
      "UpdateDelivery", 
      "DeleteDelivery",
      "ListCollects", 
      "GetCollect", 
      "CreateCollect", 
      "UpdateCollect",
      "DeleteCollect",
      "ExecuteImport",
      "ExecuteExport"
    ]
  },
  {
    service: "Contacts",
    actions: [
      "ListContacts", 
      "GetContact", 
      "CreateContact", 
      "UpdateContact", 
      "DeleteContact"
    ]        
  },
  {
    service: "Messages",
    actions: [
      "CreateNotification", 
      "UpdateNotification", 
      "DeleteNotification",
      "ListMails", 
      "GetMail", 
      "CreateMail", 
      "UpdateMail",
      "ListChats", 
      "GetChat", 
      "CreateChat", 
      "DeleteChat"
    ]        
  },
  {
    service: "Documents",
    actions: [
      "ListDocumentOverview", 
      "ExecuteUpload",
      "ExecuteDownload",
      "ExecuteSearch"
    ]
  },
  {
    service: "Logistics",
    actions: [
      "ListWebsite", 
      "ActivateWebsite",
      "ListLeaflets", 
      "GetLeaflet", 
      "UploadLeaflet",
      "ListPromotions", 
      "GetPromotion", 
      "CreatePromotion", 
      "UpdatePromotion", 
      "DeletePromotion",
      "ListMaterials", 
      "GetMaterials", 
      "CreateMaterials", 
      "UpdateMaterials", 
      "DeleteMaterials"
    ]
  },
  {
    service: "History",
    actions: [
      "ListHistory", 
      "GetHistory"
    ]
  },
  {
    service: "Meetings",
    actions: [
      "ListMeetings", 
      "GetMeeting", 
      "CreateMeeting", 
      "UpdateMeeting", 
      "DeleteMeeting"
    ]
  },
  {
    service: "Access",
    actions: [
      "ListUserGroups", 
      "GetUserGroup", 
      "CreateUserGroup", 
      "UpdateUserGroup", 
      "DeleteUserGroup",
      "ListUsers", 
      "GetUser", 
      "CreateUser", 
      "UpdateUser", 
      "DeleteUser",
      "ListRoles", 
      "GetRole", 
      "CreateRole", 
      "UpdateRole", 
      "DeleteRole",
      "ListPolicies", 
      "GetPolicy", 
      "CreatePolicy", 
      "UpdatePolicy", 
      "DeletePolicy",
      "ListStatements", 
      "GetStatement", 
      "CreateStatement", 
      "UpdateStatement", 
      "DeleteStatement",
      "ListServices"
    ]
  },
  {
    service: "Settings",
    actions: [
      "ListGeneralSettings", 
      "GetGeneralSetting", 
      "CreateGeneralSetting", 
      "UpdateGeneralSetting", 
      "DeleteGeneralSetting",
      "ListStorageSettings", 
      "GetStorageSetting", 
      "CreateStorageSetting", 
      "UpdateStorageSetting", 
      "DeleteStorageSetting",
      "ListLimits", 
      "GetLimit", 
      "CreateLimit", 
      "UpdateLimit", 
      "DeleteLimit"
    ]
  },
  {
    service: "User",
    actions: [
      "GetUserProfile", 
      "CreateUserProfile", 
      "UpdateUserProfile", 
      "DeleteUserProfile",
      "ListUserNotifications", 
      "GetUserNotification", 
      "DeleteUserNotification"
    ]
  },
  {
    service: "Ecafe",
    actions: [
      "InitialiseDashboard", 
      "ListDashboard"
    ]
  },
]
