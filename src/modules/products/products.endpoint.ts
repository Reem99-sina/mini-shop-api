import { roles } from "../../constants/roles";

export const endPoint = {
  user: [roles.user],
  admin: [roles.admin,roles.user],
  all:[roles.user, roles.admin],
};