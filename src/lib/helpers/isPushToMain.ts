import { config } from '../../config';

type IsPushToMain = (ref: string) => boolean;

export const isPushToMain: IsPushToMain = (ref) => {
  const { MASTER_HEAD_REF, MAIN_HEAD_REF } = config;

  return ref === MASTER_HEAD_REF || ref === MAIN_HEAD_REF;
};
