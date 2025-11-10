const Role = require("../models/role");
const User = require("../models/admin");
require("../models/permissions");
module.exports = (allowedPermissions) => async (req, res, next) => {
  const roleUser = await User.findById(req.auth.id).populate({
    path: "role",
    populate: {
      path: "permissions",
    },
  });

  if (roleUser.role.name === "Super Admin") {
    req.permissions = roleUser.role.permissions;
    return next();
  }
  // const user = req.user;
  if (!roleUser || !roleUser.role) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No user or role found" });
  }

  // // Populate role if not already populated
  // if (!user.role.name) {
  //   await user.populate("role");
  // }
  const hasPermission = roleUser.role.permissions.some((permission) =>
    allowedPermissions.includes(permission.name)
  );
  if (hasPermission) {
    req.permissions = roleUser.role.permissions;
    return next();
  }

  return res.status(403).json({ error: "Forbidden: Insufficient role" });
};
