import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp, library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import axios, { AxiosResponse } from 'axios';

import useAppConfigSWR from './swrs/appConfig.swr';
import Main from './pages/Main';
import Manage from './pages/Manage';
import NotFound from './pages/NotFound';
import 'antd/dist/antd.css';
import './styles/App.css';

function App() {
  // 시스템 환경설정을 정의함
  const { setAppConfigMutate } = useAppConfigSWR();

  // FontAwesome 아이콘을 불러옴
  library.add(fab, far, fas);

  useEffect(() => {
    // 시스템 환경설정을 불러옴
    axios({
      method: 'GET',
      url: '/configs/app.config.json',
      params: {},
    })
      .then((response: AxiosResponse<any>) => {
        (async () => {
          // 불러온 JSON을 기억함
          await setAppConfigMutate({
            api: {
              commonUrl: {
                host: response.data.api.commonUrl.host || '',
                port: response.data.api.commonUrl.port || '',
              },
              commonUrlPort: `${response.data.api.commonUrl.host}:${response.data.api.commonUrl.port}`,
            },
          });
        })();
      })
      .catch((error: any) => {
        console.log('> GET /configs/app.config.json:', error.response);
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 페이지 */}
        <Route path="" element={<Main />} />

        {/* 관리 페이지 */}
        <Route path="manage" element={<Manage />} />

        {/* 페이지를 찾을 수 없음 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
