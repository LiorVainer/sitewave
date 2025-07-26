import { zCustomMutation } from 'convex-helpers/server/zod';
import { mutation } from '../_generated/server';
import { NoOp } from 'convex-helpers/server/customFunctions';

export const zMutation = zCustomMutation(mutation, NoOp);
