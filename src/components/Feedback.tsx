import React, { ChangeEvent, memo, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import axios, { AxiosResponse } from 'axios';

import useAppConfigSWR from '../swrs/appConfig.swr';

interface IFeedback {
  challenger: any;
}

/**
 * 직원 연차 관리
 */
const Feedback: React.FC<IFeedback> = memo((props) => {
  // 시스템 환경설정을 정의함
  const { appConfigMutate } = useAppConfigSWR();

  // 평가 목록을 정의함
  const [comments, setComments] = useState<any>([]);

  // 지정한 수행자의 평가 목록을 불러옴
  const getComments = () => {
    console.log('> props.challenger:', props.challenger);

    // 지정한 수행자의 평가 목록을 불러옴
    axios({
      method: 'GET',
      url: `${appConfigMutate?.api.commonUrlPort}/manage/comments`,
      headers: {},
      params: {
        challenge_id: props.challenger.challenge_id,
        challenger_id: props.challenger.challenger_id,
      },
    })
      .then((response: AxiosResponse<any>) => {
        console.log('> comment:', response.data.rowData);

        if (response.data.rowLength > 0) {
          // 평가 목록에 적용함
          setComments(response.data.rowData);
        }
      })
      .catch((error: any) => {
        console.log('> GET /manage/comments error:', error.response);
      });
  };

  // 버튼을 클릭함
  const handleButton_onClick = (type: string, param: any = '') => {
    switch (type) {
      default:
        break;
    }
  };

  useEffect(() => {
    console.log(props.challenger);
    return () => {};
  }, []);

  // RESTful API 주소가 생성될 때 실행함
  useEffect(() => {
    if (!appConfigMutate?.api.commonUrlPort) {
      return;
    }

    // 지정한 수행자의 평가 목록을 불러옴
    getComments();
  }, [appConfigMutate?.api.commonUrlPort]);

  useEffect(() => {
    // 지정한 수행자의 평가 목록을 불러옴
    getComments();
  }, [props]);

  return (
    <div className="relative space-y-10">
      {/* 페이지 제목 */}
      <div>
        <span className="font-nanumsquare-bold text-3xl text-white">
          {props.challenger.challenge_subject}
        </span>
      </div>

      {/* 과제 수행 인턴 */}
      <div className="space-y-1">
        <div className="underline underline-offset-4 decoration-2 decoration-amber-500">
          <span className="font-nanumsquare-bold text-lg text-white">
            과제 수행 인턴
          </span>
        </div>

        <div>
          <span className="font-nanumsquare-bold text-sm text-gray-300">
            {props.challenger.name}
          </span>
        </div>
      </div>

      {/* 과제 수행 정보 */}
      <div className="space-y-1">
        <div className="underline underline-offset-4 decoration-2 decoration-amber-500">
          <span className="font-nanumsquare-bold text-lg text-white">
            과제 수행 정보
          </span>
        </div>

        <div>
          <div>
            <span className="font-nanumsquare-bold text-sm text-gray-300">
              수행기간:{' '}
              {props.challenger.challenge_start_date.replace(
                /(\d{4})(\d{2})(\d{2})/,
                '$1.$2.$3',
              )}{' '}
              ~{' '}
              {props.challenger.challenge_end_date.replace(
                /(\d{4})(\d{2})(\d{2})/,
                '$1.$2.$3',
              )}
            </span>
          </div>

          <div>
            <span className="font-nanumsquare-bold text-sm text-gray-300">
              중간 평가기간:{' '}
              {props.challenger.first_comment_start_datetime.replace(
                /(\d{4})(\d{2})(\d{2})/,
                '$1.$2.$3',
              )}{' '}
              ~{' '}
              {props.challenger.first_comment_end_datetime.replace(
                /(\d{4})(\d{2})(\d{2})/,
                '$1.$2.$3',
              )}
            </span>
          </div>

          <div>
            <span className="font-nanumsquare-bold text-sm text-gray-300">
              최종 평가기간:{' '}
              {props.challenger.second_comment_start_datetime.replace(
                /(\d{4})(\d{2})(\d{2})/,
                '$1.$2.$3',
              )}{' '}
              ~{' '}
              {props.challenger.second_comment_end_datetime.replace(
                /(\d{4})(\d{2})(\d{2})/,
                '$1.$2.$3',
              )}
            </span>
          </div>
        </div>
      </div>

      {/* 평가 현황 */}
      <div className="space-y-1">
        <div className="underline underline-offset-4 decoration-2 decoration-amber-500">
          <span className="font-nanumsquare-bold text-lg text-white">
            평가 현황
          </span>
        </div>

        <div className="space-y-1">
          <div className="space-x-1">
            <span className="font-nanumsquare-bold text-sm text-gray-300">
              평균 별 점수:
            </span>
            <span className="font-nanumsquare-bold text-3xl text-gray-300">
              {(_.sumBy(comments, 'first_star_score') +
                _.sumBy(comments, 'second_star_score')) /
                (2 * comments.length)}
              점
            </span>
          </div>

          <div>
            <table className="table-fixed border-separate border border-solid border-gray-400">
              <thead>
                <tr className="bg-gray-500">
                  <th rowSpan={2} className="w-20">
                    <span className="font-nanumsquare-bold text-sm text-gray-800">
                      평가자
                    </span>
                  </th>
                  <th colSpan={3} className="py-1">
                    <span className="font-nanumsquare-bold text-sm text-gray-800">
                      별 점수
                    </span>
                  </th>
                  <th rowSpan={2} style={{ minWidth: '200px' }} className="">
                    <span className="font-nanumsquare-bold text-sm text-gray-800">
                      평가
                    </span>
                  </th>
                </tr>
                <tr className="bg-gray-500">
                  <th className="py-1 w-20">
                    <span className="font-nanumsquare-bold text-sm text-gray-800">
                      1차
                    </span>
                  </th>
                  <th className="w-20">
                    <span className="font-nanumsquare-bold text-sm text-gray-800">
                      2차
                    </span>
                  </th>
                  <th className="w-24">
                    <span className="font-nanumsquare-bold text-sm text-gray-800">
                      평균 점수
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {comments.map((data: any, index: number) => (
                  <tr key={index}>
                    <td className="px-3 py-1 text-center border-t border-solid border-gray-500">
                      <span className="text-xs text-gray-300">{data.name}</span>
                    </td>
                    <td className="px-3 border-t border-gray-500">
                      <div className="flex justify-start items-center space-x-1">
                        {data.first_star_score !== null &&
                          _.range(1, data.first_star_score + 1).map(
                            (number: number) => (
                              <div
                                key={`second-star-${number}`}
                                className="flex justify-center items-center"
                              >
                                <FontAwesomeIcon
                                  icon={['fas', 'splotch']}
                                  className="w-3 h-3 text-amber-400"
                                />
                              </div>
                            ),
                          )}
                      </div>
                    </td>
                    <td className="px-3 border-t border-gray-500">
                      <div className="flex justify-start items-center space-x-1">
                        {data.second_star_score !== null &&
                          _.range(1, data.second_star_score + 1).map(
                            (number: number) => (
                              <div
                                key={`second-star-${number}`}
                                className="flex justify-center items-center"
                              >
                                <FontAwesomeIcon
                                  icon={['fas', 'splotch']}
                                  className="w-3 h-3 text-amber-400"
                                />
                              </div>
                            ),
                          )}
                      </div>
                    </td>
                    <td className="px-3 text-right border-t border-gray-500">
                      <span className="text-xs text-gray-300">
                        {_.mean([
                          data.first_star_score,
                          data.second_star_score,
                        ])}
                      </span>
                    </td>
                    <td className="px-3 py-2 border-t border-gray-500 space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-start items-center">
                          <div className="px-2 py-1 flex justify-center items-center bg-lime-700 text-white rounded">
                            <span className="font-nanumsquare-bold text-2xs text-white leading-none">
                              1차
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-xs text-gray-300 whitespace-pre-line">
                            {data.first_comment}
                          </span>
                        </div>
                      </div>

                      <div className="border-b border-dashed border-gray-500" />

                      <div className="space-y-1">
                        <div className="flex justify-start items-center">
                          <div className="px-2 py-1 flex justify-center items-center bg-teal-700 text-white rounded">
                            <span className="font-nanumsquare-bold text-2xs text-white leading-none">
                              2차
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-xs text-gray-300 whitespace-pre-line">
                            {data.second_comment}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Feedback;
