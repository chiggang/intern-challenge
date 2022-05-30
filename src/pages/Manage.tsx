import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios, { AxiosResponse } from 'axios';

import useAppConfigSWR from '../swrs/appConfig.swr';
import Vacation from '../components/Vacation';
import Feedback from '../components/Feedback';

function Manage() {
  // 시스템 환경설정을 정의함
  const { appConfigMutate } = useAppConfigSWR();

  // 전체 개발 과제 할당 목록을 정의함
  const [assignments, setAssignments] = useState<any>([]);

  // 선택한 과제 수행 인턴을 정의함
  const [selectedChallenger, setSelectedChallenger] = useState<any>({});

  // 전체 개발 과제 할당 목록을 불러옴
  const getAssignments = () => {
    // 전체 개발 과제 할당 목록을 불러옴
    axios({
      method: 'GET',
      url: `${appConfigMutate?.api.commonUrlPort}/manage/assignments`,
      headers: {},
      params: {},
    })
      .then((response: AxiosResponse<any>) => {
        if (response.data.rowLength > 0) {
          // 전체 개발 과제 할당 목록에 적용함
          setAssignments(response.data.rowData);
        }
      })
      .catch((error: any) => {
        console.log('> GET /manage/assignments error:', error.response);
      });
  };

  // 버튼을 클릭함
  const handleButton_onClick = (type: string, param: any) => {
    switch (type) {
      // 과제 수행자를 선택
      case 'challenger':
        // 선택한 과제 수행 인턴에 적용함
        setSelectedChallenger(param);
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

    // 전체 개발 과제 할당 목록을 불러옴
    getAssignments();
  }, [appConfigMutate?.api.commonUrlPort]);

  return (
    <div className="w-screen h-screen bg-slate-600">
      <div className="flex h-full">
        {/* 왼쪽 메뉴바 */}
        <div className="flex-none w-68 h-full bg-white">
          {/* 페이지 제목 */}
          <div className="px-3 py-2 w-full">
            <span className="font-nanumsquare-bold text-xl text-gray-700">
              인턴 개발 과제: 평가 현황
            </span>
          </div>

          {/* 구분선 */}
          <div className="w-full border-b border-solid border-gray-300" />

          {/* 메뉴 */}
          <div className="px-4 py-5 w-full space-y-5">
            {/* 메뉴 아이템 */}
            {assignments.map((data: any) => (
              <div
                key={data.challenger_id}
                onClick={() => handleButton_onClick('challenger', data)}
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
                  {data.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽 내용 */}
        <div className="grow p-10 h-full overflow-y-auto">
          {selectedChallenger.challenger_id !== undefined && (
            <Feedback challenger={selectedChallenger} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Manage;
