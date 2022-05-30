import useSWR from 'swr';

import { IAppConfig } from '../interfaces/app.interface';

// 시스템 환경설정을 정의함
let appConfig: IAppConfig = {
  api: {
    commonUrl: {
      host: '',
      port: '',
    },
    commonUrlPort: '',
  },
};

/**
 * 시스템 환경설정 SWR
 */
const useAppConfigSWR = () => {
  const { data, mutate } = useSWR<IAppConfig>('appConfig', () => {
    return appConfig;
  });

  return {
    /* 시스템 환경설정을 제공함 */
    appConfigMutate: data,
    /* 시스템 환경설정을 적용함 */
    setAppConfigMutate: async (value: IAppConfig) => {
      // 데이터를 갱신함
      appConfig = { ...appConfig, ...value };

      return mutate();
    },
  };
};

export default useAppConfigSWR;
