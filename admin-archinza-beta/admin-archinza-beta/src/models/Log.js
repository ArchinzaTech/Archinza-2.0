const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Assuming a 'User' model exists for general users
    required: false, // Could be null for system-triggered logs or unauthenticated actions
  },
  userName: {
    type: String,
    required: false,
  },
  userEmail: {
    type: String,
    required: false,
  },
  actionType: {
    type: String,
    enum: [
      "CREATED",
      "UPDATED",
      "DELETED",
      "VERIFIED",
      "REJECTED",
      "LOGIN",
      "LOGOUT",
      "VIEWED",
      "UPLOADED",
      "DOWNLOADED",
      "BLOCKED",
      "UNBLOCKED",
      "DEACTIVATED",
      "ACTIVATED",
      "PASSWORD_RESET",
      "FORGOT_PASSWORD_REQUEST",
      "ROLE_ASSIGNED",
      "PERMISSION_UPDATED",
      "DATA_TYPE_CREATED",
      "DATA_TYPE_UPDATED",
      "DATA_TYPE_DELETED",
      "AMENITY_CREATED",
      "AMENITY_UPDATED",
      "AMENITY_DELETED",
      "OPTION_CREATED",
      "OPTION_UPDATED",
      "OPTION_DELETED",
      "SERVICE_CREATED",
      "SERVICE_UPDATED",
      "SERVICE_DELETED",
      "BANNER_CREATED",
      "BANNER_UPDATED",
      "BANNER_DELETED",
      "HOMEPAGE_SECTION_UPDATED",
      "HOMEPAGE_PERK_UPDATED",
      "NEWSLETTER_SUBSCRIBED",
      "PERSONAL_DELETION_REQUEST_CREATED",
      "PERSONAL_DELETION_REQUEST_APPROVED",
      "PERSONAL_DELETION_REQUEST_REJECTED",
      "BUSINESS_VERIFICATION_REQUEST_APPROVED",
      "BUSINESS_VERIFICATION_REQUEST_REJECTED",
      "CUSTOM_OPTION_CREATED",
      "CUSTOM_OPTION_UPDATED",
      "CUSTOM_OPTION_DELETED",
    ],
    required: true,
  },
  module: {
    type: String,
    required: true,
    enum: [
      "User",
      "BusinessUser",
      "PersonalDeletionRequest",
      "Role",
      "Permission",
      "DataType",
      "Amenity",
      "Option",
      "Service",
      "Banner",
      "Homepage",
      "HomepagePerk",
      "Newsletter",
      "Auth",
      "CustomOption",
    ], // Examples: 'User', 'BusinessUser', 'Role', 'PersonalDeletionRequest'
  },
  resourceId: {
    type: Schema.Types.ObjectId,
    required: false, // ID of the document affected by the action
  },
  details: {
    type: Schema.Types.Mixed, // Flexible field for additional context (e.g., old and new values)
    required: false,
  },
  ipAddress: {
    type: String,
    required: false,
  },
  userAgent: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Log", LogSchema);
