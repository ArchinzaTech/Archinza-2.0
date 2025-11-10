export const get_messages = (data) => {
  const requests = {
    create_delete_request_personal: {
      single_delete: `This deletion request will be redirected to
                Admin-Personal Advanced. Do you want to continue?`,
      multiple_delete: `These deletion requests will be redirected to the Personal Advanced
                  Admin.`,
      multiple_delete_content: `${data.count} record(s) will be requested for deletion.`,
      single_delete_success: `Deletion request has been sent to Personal Advanced Admin.`,
      multiple_delete_success: `Deletion requests for ${data.count} user(s) have been sent to Personal Advanced Admin.`,
    },
    delete_personal: {
      single_delete: `This user data will be deleted. Do you want to continue?`,
      multiple_delete: `These users data will be deleted permanently.`,
      multiple_delete_content: `${data.count} record(s) will be deleted.`,
      single_delete_success: `User data has been deleted successfully.`,
      multiple_delete_success: `${data.count} user(s) have been deleted successfully.`,
    },
    create_delete_request_business: {
      single_delete: `This deletion request will be redirected to
                  Admin-Business Advanced. Do you want to continue?`,
      multiple_delete: `These deletion requests will be redirected to the Business Advanced
                    Admin.`,
      multiple_delete_content: `${data.count} record(s) will be requested for deletion.`,
      single_delete_success: `Deletion request has been sent to Business Advanced Admin.`,
      multiple_delete_success: `Deletion requests for ${data.count} user(s) have been sent to Business Advanced Admin.`,
    },
    delete_business: {
      single_delete: `This user data will be deleted. Do you want to continue?`,
      multiple_delete: `These users data will be deleted permanently.`,
      multiple_delete_content: `${data.count} record(s) will be deleted.`,
      single_delete_success: `User data has been deleted successfully.`,
      multiple_delete_success: `${data.count} user(s) have been deleted successfully.`,
    },
  };
  return requests[data.key];
};

export const PERMISSION_KEYS = {
  EDIT_PERSONAL_USER: "edit_personal_user",
  EDIT_PERSONAL_USER_ADVANCED: "edit_personal_user_advanced",
  CREATE_DELETE_REQUEST_PERSONAL: "create_delete_request_personal",
  REVIEW_DELETE_REQUEST_PERSONAL: "review_delete_request_personal",
  EDIT_BUSINESS_USER: "edit_business_user",
  EDIT_BUSINESS_USER_ADVANCED: "edit_business_user_advanced",
  CREATE_DELETE_REQUEST_BUSINESS: "create_delete_request_business",
  REVIEW_DELETE_REQUEST_BUSINESS: "review_delete_request_business",
  APPROVE_VERIFICATION: "approve_verification",
  DOWNLOAD_USER_DATA: "download_user_data",
  VIEW_ALL: "view_all",
  FULL_ACCESS: "full_access",
};

export const PERMISSION_MESSAGES = {
  edit_personal_user: "You do not have permission to edit personal users.",
  edit_personal_user_advanced:
    "You do not have permission to edit all personal user fields.",
  create_delete_request_personal:
    "You do not have permission to request deletion of personal users.",
  review_delete_request_personal:
    "You do not have permission to review personal user deletion requests.",
  edit_business_user: "You do not have permission to edit business users.",
  edit_business_user_advanced:
    "You do not have permission to edit all business user fields.",
  create_delete_request_business:
    "You do not have permission to request deletion of business users.",
  review_delete_request_business:
    "You do not have permission to review business user deletion requests.",
  approve_verification: "You do not have permission to approve verifications.",
  download_user_data: "You do not have permission to download user data.",
  view_all: "You do not have permission to view this module.",
  full_access: "You do not have full access.",
};
