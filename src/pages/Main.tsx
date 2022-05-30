import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios, { AxiosResponse } from 'axios';

import useAppConfigSWR from '../swrs/appConfig.swr';
import Vacation from '../components/Vacation';

function Main() {
  // 시스템 환경설정을 정의함
  const { appConfigMutate } = useAppConfigSWR();

  // 개발 과제 목록을 정의함
  const [challenge, setChallenge] = useState<any>([]);

  // 개발 과제 목록을 불러옴
  const getChallenge = () => {
    // 개발 과제 목록을 불러옴
    axios({
      method: 'GET',
      url: `${appConfigMutate?.api.commonUrlPort}/user/challenge`,
      headers: {},
      params: {},
    })
      .then((response: AxiosResponse<any>) => {
        if (response.data.rowLength > 0) {
          // 개발 과제 목록에 적용함
          setChallenge(response.data.rowData);
        }
      })
      .catch((error: any) => {
        console.log('> GET /user/challenge error:', error.response);
      });
  };

  // 버튼을 클릭함
  const handleButton_onClick = (type: number, param: any) => {
    switch (type) {
      // 직원 연차 관리
      case 1:
        console.log('> click:', param);
        break;

      // 소모품 및 비품 관리
      case 2:
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    return () => {};
  }, []);

  // RESTful API 주소가 생성될 때 실행함
  useEffect(() => {
    if (!appConfigMutate?.api.commonUrlPort) {
      return;
    }

    // 개발 과제 목록을 불러옴
    getChallenge();
  }, [appConfigMutate?.api.commonUrlPort]);

  return (
    <div className="w-screen h-screen bg-slate-600">
      <div className="flex h-full">
        {/* 왼쪽 메뉴바 */}
        <div className="flex-none w-68 h-full bg-white">
          {/* 페이지 제목 */}
          <div className="px-3 py-2 w-full">
            <span className="font-nanumsquare-bold text-xl text-gray-700">
              인턴 개발 과제
            </span>
          </div>

          {/* 구분선 */}
          <div className="w-full border-b border-solid border-gray-300" />

          {/* 메뉴 */}
          <div className="px-4 py-5 w-full space-y-5">
            {/* 메뉴 아이템 */}
            {challenge.map((data: any) => (
              <div
                key={data.id}
                onClick={() => handleButton_onClick(data.id, data)}
                className="button flex justify-start items-center space-x-1.5 truncate leading-none select-none"
              >
                {/* Icon */}
                <div className="flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={['fas', 'circle-dot']}
                    className="w-3 h-3 text-indigo-500"
                  />
                </div>

                {/* Text */}
                <span className="font-nanumsquare-bold text-sm text-gray-700 truncate">
                  {data.subject}
                </span>
              </div>
            ))}

            {/* 메뉴 아이템 */}
            <div className="flex justify-start items-center space-x-1.5 truncate leading-none select-none">
              {/* Icon */}
              <div className="flex justify-center items-center">
                <FontAwesomeIcon
                  icon={['fas', 'circle-dot']}
                  className="w-3 h-3 text-gray-400"
                />
              </div>

              {/* Text */}
              <span className="font-nanumsquare-bold text-sm text-gray-400 truncate">
                회사 소무품 및 비품 관리(준비 중)
              </span>
            </div>

            {/* 메뉴 아이템 */}
            <div className="flex justify-start items-center space-x-1.5 truncate leading-none select-none">
              {/* Icon */}
              <div className="flex justify-center items-center">
                <FontAwesomeIcon
                  icon={['fas', 'circle-dot']}
                  className="w-3 h-3 text-gray-400"
                />
              </div>

              {/* Text */}
              <span className="font-nanumsquare-bold text-sm text-gray-400 truncate">
                지원자 이력서 관리(준비 중)
              </span>
            </div>

            {/* 메뉴 아이템 */}
            <div className="flex justify-start items-center space-x-1.5 truncate leading-none select-none">
              {/* Icon */}
              <div className="flex justify-center items-center">
                <FontAwesomeIcon
                  icon={['fas', 'circle-dot']}
                  className="w-3 h-3 text-gray-400"
                />
              </div>

              {/* Text */}
              <span className="font-nanumsquare-bold text-sm text-gray-400 truncate">
                직원 식수 인원 관리(준비 중)
              </span>
            </div>
          </div>
        </div>

        {/* 오른쪽 내용 */}
        <div className="grow p-10 h-full overflow-y-auto">
          <Vacation challengeId={1} />
        </div>
      </div>
    </div>
  );
}

export default Main;
