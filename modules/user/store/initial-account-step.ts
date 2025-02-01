import { atom } from 'jotai';
import { InitialAccountStep } from '../models/initial-account-step.enum';

export const initialAccountStepAtom = atom<InitialAccountStep>(
  InitialAccountStep.AUTH_SIGNUP
);
