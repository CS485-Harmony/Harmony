import { router, publicProcedure } from '../init';
import { ROLE_PERMISSIONS } from '../../services/permission.service';

export const permissionRouter = router({
  /** Returns the full permission matrix derived from the enforcement layer. Public — no auth required. */
  getMatrix: publicProcedure.query(() =>
    Object.fromEntries(
      Object.entries(ROLE_PERMISSIONS).map(([role, actions]) => [role, [...actions]]),
    )
  ),
});
