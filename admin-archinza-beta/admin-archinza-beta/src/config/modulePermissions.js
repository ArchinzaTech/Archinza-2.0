export const MODULE_PERMISSIONS = {
  // Personal section
  "/personal/requested-deletions": [
    "review_delete_request_personal",
    "view_all",
    "full_access",
  ],
  "/personal/requested-datatypes": [
    "edit_personal_user_advanced",
    "view_all",
    "full_access",
  ],
  "/personal/onboarding-datatypes": [
    "edit_personal_user_advanced",
    "view_all",
    "full_access",
  ],
  "/personal/feedbacks": [
    "edit_personal_user_advanced",
    "edit_personal_user",
    "view_all",
    "full_access",
  ],
  "/personal/newsletters": [
    "edit_personal_user_advanced",
    "view_all",
    "full_access",
  ],
  // // Business section
  "/business/requested-verifications": [
    "edit_business_user",
    "approve_verification",
    "full_access",
  ],
  "/business/requested-services": ["view_all", "full_access"],
  "/business/requested-deletions": [
    "view_all",
    "full_access",
    "review_delete_request_business",
  ],
  "/business/requested-user-edits": [
    "view_all",
    "full_access",
    "review_edit_request_business",
  ],
  "/business/onboarding-datatypes": ["view_all", "full_access"],
  "/business/onboarding-services": ["view_all", "full_access"],
  // "/business/users": ["edit_business_user", "view_all", "full_access"],
};
