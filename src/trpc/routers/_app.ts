import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { CreatingPage } from '@/modules/CreatingPage/server/Creatingpage';

export const appRouter = createTRPCRouter({
    creating_page: CreatingPage,
});
// export type definition of API
export type AppRouter = typeof appRouter;