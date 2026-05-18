import { roles } from "../../constants/roles";

export const endPoint = {
  user: [roles.user],
  admin: [roles.admin],
  all:[roles.user, roles.admin],
};