import React, { ChangeEvent, memo, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import axios, { AxiosResponse } from 'axios';
import { Input, message } from 'antd';

import useAppConfigSWR from '../swrs/appConfig.swr';

interface IAssignment {
  challengeId: number;
}

/**
 * 직원 연차 관리
 */
const Vacation: React.FC<IAssignment> = memo((props) => {
  // 시스템 환경설정을 정의함
  const { appConfigMutate } = useAppConfigSWR();

  // 개발 과제 할당 목록을 정의함
  const [assignment, setAssignment] = useState<any>([]);

  // 선택한 과제 수행 인턴을 정의함
  const [selectedChallenger, setSelectedChallenger] = useState<any>({});

  // 현재 평가를 진행 중인 평가자를 정의함
  const [member, setMember] = useState<any>({});

  // 평가 레이어 출력 여부를 정의함
  const [showCommentLayer, setShowCommentLayer] = useState<boolean>(false);

  // 평가 레이어의 입력폼을 정의함
  const [commentLayerInputForm, setCommentLayerInputForm] = useState<any>({
    name: '',
    phoneLastNumber: '',
  });

  // 평가를 정의함
  const [comment, setComment] = useState<any>({
    challenge_id: 0,
    comment_time: 0,
    challenger_id: 0,
    member_id: 0,
    star_score: 0,
    comment: '',
  });

  // 텍스트박스를 정의함
  const { TextArea } = Input;

  // 개발 과제 할당 목록을 불러옴
  const getAssignment = () => {
    // 개발 과제 할당 목록을 불러옴
    axios({
      method: 'GET',
      url: `${appConfigMutate?.api.commonUrlPort}/user/assignment`,
      headers: {},
      params: {
        challengeId: props.challengeId,
      },
    })
      .then((response: AxiosResponse<any>) => {
        if (response.data.rowLength > 0) {
          // 개발 과제 할당 목록에 적용함
          setAssignment(response.data.rowData);
        }
      })
      .catch((error: any) => {
        console.log('> GET /user/assignment error:', error.response);
      });
  };

  // 지정한 사용자 정보를 불러옴
  const getMember = (
    name: string,
    phoneLastNumber: string,
    callback: Function,
  ): any => {
    // 지정한 사용자 정보를 불러옴
    axios({
      method: 'GET',
      url: `${appConfigMutate?.api.commonUrlPort}/user/member`,
      headers: {},
      params: {
        name,
        phoneLastNumber,
      },
    })
      .then((response: AxiosResponse<any>) => {
        if (response.data.rowLength > 0) {
          callback(response.data.rowData[0]);
        } else {
          callback(null);
        }
      })
      .catch((error: any) => {
        console.log('> GET /user/member error:', error.response);

        callback(null);
      });
  };

  // 지정한 사용자가 작성한 평가 정보를 불러옴
  const getComment = () => {
    // 지정한 사용자가 작성한 평가 정보를 불러옴
    axios({
      method: 'GET',
      url: `${appConfigMutate?.api.commonUrlPort}/user/comment`,
      headers: {},
      params: {
        challenge_id: selectedChallenger.challenge_id,
        comment_time: selectedChallenger.comment_time,
        challenger_id: selectedChallenger.challenger_id,
        member_id: member.id,
      },
    })
      .then((response: AxiosResponse<any>) => {
        if (response.data.rowLength > 0) {
          // 평가에 적용함
          setComment(response.data.rowData[0]);
        }
      })
      .catch((error: any) => {
        console.log('> GET /user/comment error:', error.response);
      });
  };

  // 평가 레이어의 이름 입력폼을 변경함
  const handleCommentLayerName_onChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    // 평가 레이어의 입력폼에 적용함
    setCommentLayerInputForm({
      ...commentLayerInputForm,
      name: event.target.value,
    });
  };

  // 평가 레이어의 휴대폰 뒷번호 4자리 입력폼을 변경함
  const handleCommentLayerPhoneLastNumber_onChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    // 평가 레이어의 입력폼에 적용함
    setCommentLayerInputForm({
      ...commentLayerInputForm,
      phoneLastNumber: event.target.value,
    });
  };

  // 평가 레이어의 댓글 입력폼을 변경함
  const handleCommentLayerComment_onChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    // 평가를 적용함
    setComment({
      ...comment,
      comment: event.target.value,
    });
  };

  // 버튼을 클릭함
  const handleButton_onClick = (type: string, param: any = '') => {
    switch (type) {
      // 개발한 과제 보기
      case 'url':
        // 새 창으로 링크를 출력함
        window.open(param);
        break;

      // 중간 평가
      case 'first-comment':
        // 평가 구분을 적용함
        param.comment_time = '1';

        // 평가에 적용함
        setComment({
          ...comment,
          challenge_id: param.challenge_id,
          comment_time: param.comment_time,
          challenger_id: param.challenger_id,
        });

        // 선택한 과제 수행 인턴에 적용함
        setSelectedChallenger(param);

        if (showCommentLayer) {
          // 평가 레이어를 숨김
          setShowCommentLayer(false);

          setTimeout(() => {
            // 평가 레이어를 출력함
            setShowCommentLayer(true);
          }, 200);
        } else {
          // 평가 레이어를 출력함
          setShowCommentLayer(true);
        }
        break;

      // 최종 평가
      case 'second-comment':
        // 평가 구분을 적용함
        param.comment_time = '2';

        // 평가에 적용함
        setComment({
          ...comment,
          challenge_id: param.challenge_id,
          comment_time: param.comment_time,
          challenger_id: param.challenger_id,
        });

        // 선택한 과제 수행 인턴에 적용함
        setSelectedChallenger(param);

        if (showCommentLayer) {
          // 평가 레이어를 숨김
          setShowCommentLayer(false);

          setTimeout(() => {
            // 평가 레이어를 출력함
            setShowCommentLayer(true);
          }, 200);
        } else {
          // 평가 레이어를 출력함
          setShowCommentLayer(true);
        }
        break;

      // 평가자 로그인
      case 'signin-member':
        if (!commentLayerInputForm.name.trim()) {
          message.open({
            key: 'signin-member',
            content: (
              <div className="flex justify-center items-center space-x-2">
                <div className="flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={['fas', 'circle-exclamation']}
                    className="w-4 h-4 text-rose-500"
                  />
                </div>

                <div className="flex justify-center items-center">
                  <span className="font-nanumsquare-bold text-sm text-gray-500">
                    이름을 입력해 주세요.
                  </span>
                </div>
              </div>
            ),
          });
          return;
        }

        if (!commentLayerInputForm.phoneLastNumber.trim()) {
          message.open({
            key: 'signin-member',
            content: (
              <div className="flex justify-center items-center space-x-2">
                <div className="flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={['fas', 'circle-exclamation']}
                    className="w-4 h-4 text-rose-500"
                  />
                </div>

                <div className="flex justify-center items-center">
                  <span className="font-nanumsquare-bold text-sm text-gray-500">
                    휴대폰 뒷번호 4자리를 입력해 주세요.
                  </span>
                </div>
              </div>
            ),
          });
          return;
        }

        // 지정한 사용자 정보를 불러옴
        getMember(
          commentLayerInputForm.name,
          commentLayerInputForm.phoneLastNumber,
          (data: any) => {
            if (data) {
              // 현재 평가를 진행 중인 평가자에 적용함
              setMember(data);

              // 평가에 적용함
              setComment({
                ...comment,
                member_id: data.id,
              });
            } else {
              message.open({
                key: 'signin-member',
                content: (
                  <div className="flex justify-center items-center space-x-2">
                    <div className="flex justify-center items-center">
                      <FontAwesomeIcon
                        icon={['fas', 'circle-exclamation']}
                        className="w-4 h-4 text-rose-500"
                      />
                    </div>

                    <div className="flex justify-center items-center">
                      <span className="font-nanumsquare-bold text-sm text-gray-500">
                        일치하는 사용자가 없습니다.
                      </span>
                    </div>
                  </div>
                ),
              });
            }
          },
        );
        break;

      // 평가 별 점수
      case 'star':
        // 평가에 적용함
        setComment({
          ...comment,
          star_score: param,
        });
        break;

      // 평가 레이어 닫기
      case 'close-comment':
        // 평가 레이어를 숨김
        setShowCommentLayer(false);
        break;

      // 평가 저장
      case 'save-comment':
        if (comment.comment.length < 30) {
          message.open({
            key: 'save-comment',
            content: (
              <div className="flex justify-center items-center space-x-2">
                <div className="flex justify-center items-center">
                  <FontAwesomeIcon
                    icon={['fas', 'circle-exclamation']}
                    className="w-4 h-4 text-rose-500"
                  />
                </div>

                <div className="flex justify-center items-center">
                  <span className="font-nanumsquare-bold text-sm text-gray-500">
                    평가 댓글은 30자 이상 입력해 주세요.
                  </span>
                </div>
              </div>
            ),
          });
          return;
        }

        // 평가를 저장함
        axios({
          method: 'POST',
          url: `${appConfigMutate?.api.commonUrlPort}/user/comment`,
          headers: {},
          data: comment,
        })
          .then((response: AxiosResponse<any>) => {
            message.open({
              key: 'save-comment',
              content: (
                <div className="flex justify-center items-center space-x-2">
                  <div className="flex justify-center items-center">
                    <FontAwesomeIcon
                      icon={['fas', 'circle-check']}
                      className="w-4 h-4 text-lime-500"
                    />
                  </div>

                  <div className="flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-sm text-gray-500">
                      저장하였습니다.
                    </span>
                  </div>
                </div>
              ),
            });
          })
          .catch((error) => {
            console.log('> POST /user/comment error:', error.response);
          });
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

    // 개발 과제 할당 목록을 불러옴
    getAssignment();
  }, [appConfigMutate?.api.commonUrlPort]);

  // 평가 레이어가 변경될 때 실행함
  useEffect(() => {
    if (showCommentLayer) {
      if (member.id !== undefined) {
        // 평가에 적용함
        setComment({
          ...comment,
          member_id: member.id,
        });

        // 지정한 사용자가 작성한 평가 정보를 불러옴
        getComment();
      }
    } else {
      // 평가를 초기화함
      setComment({
        challenge_id: 0,
        comment_time: 0,
        challenger_id: 0,
        member_id: 0,
        star_score: 0,
        comment: '',
      });
    }
  }, [showCommentLayer]);

  // 평가자가 로그인할 때 실행함
  useEffect(() => {
    if (member.id === undefined) {
      return;
    }

    // 지정한 사용자가 작성한 평가 정보를 불러옴
    getComment();
  }, [member]);

  return (
    <div className="relative space-y-10">
      {/* 페이지 제목 */}
      <div>
        <span className="font-nanumsquare-bold text-3xl text-white">
          직원 연차 관리
        </span>
      </div>

      {/* 과제 수행 인턴 */}
      <div className="space-y-1">
        <div className="underline underline-offset-4 decoration-2 decoration-amber-500">
          <span className="font-nanumsquare-bold text-lg text-white">
            과제 수행 인턴
          </span>
        </div>

        {assignment.length === 0 && (
          <div>
            <span className="font-nanumsquare-bold text-sm text-gray-300">
              현재 진행 중인 과제가 없습니다.
            </span>
          </div>
        )}

        {/* 과제 수행 인턴 카드 */}
        {assignment.length > 0 && (
          <div className="flex justify-start items-center space-x-2">
            {assignment.map((data: any) => (
              <div key={data.challenger_id}>
                {/* 수행자 배경 이미지 */}
                <div className="p-1 w-full h-32 flex justify-center items-center bg-white rounded-t-md">
                  {data.image_url && (
                    <div
                      style={{
                        backgroundImage: `url(${data.image_url})`,
                      }}
                      className="relative px-3 py-1 w-full h-full bg-white bg-cover bg-center rounded-t"
                    >
                      {/* 사이트 링크 버튼 */}
                      <div
                        onClick={() => handleButton_onClick('url', data.url)}
                        className="button absolute right-2 top-2 px-2 py-2 bg-lime-600 outline outline-1 outline-lime-500 rounded"
                      >
                        <div className="flex justify-center items-center space-x-1">
                          <div className="flex justify-center items-center">
                            <FontAwesomeIcon
                              icon={['fas', 'house-chimney']}
                              className="w-3 h-3 text-white"
                            />
                          </div>

                          <span className="font-nanumsquare-bold text-xs text-white leading-none">
                            개발한 과제 보기
                          </span>
                        </div>
                      </div>

                      {/* 중간 평가 버튼 */}
                      {data.available_first_comment === 'Y' && (
                        <div
                          onClick={() =>
                            handleButton_onClick('first-comment', data)
                          }
                          className="button absolute left-2 top-2 px-2 py-2 bg-sky-600 outline outline-1 outline-sky-500 rounded"
                        >
                          <div className="flex justify-center items-center space-x-1">
                            <div className="flex justify-center items-center">
                              <FontAwesomeIcon
                                icon={['fas', 'star-half-stroke']}
                                className="w-3 h-3 text-white"
                              />
                            </div>

                            <span className="font-nanumsquare-bold text-xs text-white leading-none">
                              중간 평가
                            </span>
                          </div>
                        </div>
                      )}

                      {/* 최종 평가 버튼 */}
                      {data.available_second_comment === 'Y' && (
                        <div
                          onClick={() =>
                            handleButton_onClick('second-comment', data)
                          }
                          className="button absolute left-2 top-2 px-2 py-2 bg-indigo-600 outline outline-1 outline-indigo-500 rounded"
                        >
                          <div className="flex justify-center items-center space-x-1">
                            <div className="flex justify-center items-center">
                              <FontAwesomeIcon
                                icon={['fas', 'star-half-stroke']}
                                className="w-3 h-3 text-white"
                              />
                            </div>

                            <span className="font-nanumsquare-bold text-xs text-white leading-none">
                              최종 평가
                            </span>
                          </div>
                        </div>
                      )}

                      {/* 수행자 이름 */}
                      <div className="absolute right-3 bottom-2">
                        <span className="font-nanumsquare-bold text-xl text-white text-drop-shadow-5">
                          {data.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 수행 정보 */}
                <div className="pl-2 pr-5 pt-3 pb-4 w-full rounded-b-md bg-white">
                  {/* 수행기간 */}
                  <div className="flex justify-start items-center space-x-2">
                    <div className="w-20 flex justify-end items-center">
                      <span className="font-nanumsquare-bold text-2xs text-gray-700">
                        수행기간
                      </span>
                    </div>

                    <span className="text-2xs text-gray-500">
                      {data.challenge_start_date.replace(
                        /(\d{4})(\d{2})(\d{2})/,
                        '$1.$2.$3',
                      )}{' '}
                      ~{' '}
                      {data.challenge_end_date.replace(
                        /(\d{4})(\d{2})(\d{2})/,
                        '$1.$2.$3',
                      )}
                    </span>
                  </div>

                  {/* 중간 평가기간 */}
                  <div className="flex justify-start items-center space-x-2">
                    <div className="w-20 flex justify-end items-center">
                      <span className="font-nanumsquare-bold text-2xs text-gray-700">
                        중간 평가기간
                      </span>
                    </div>

                    <span className="text-2xs text-gray-500">
                      {data.first_comment_start_datetime.replace(
                        /(\d{4})(\d{2})(\d{2})/,
                        '$1.$2.$3',
                      )}{' '}
                      ~{' '}
                      {data.first_comment_end_datetime.replace(
                        /(\d{4})(\d{2})(\d{2})/,
                        '$1.$2.$3',
                      )}
                    </span>
                  </div>

                  {/* 최종 평가기간 */}
                  <div className="flex justify-start items-center space-x-2">
                    <div className="w-20 flex justify-end items-center">
                      <span className="font-nanumsquare-bold text-2xs text-gray-700">
                        최종 평가기간
                      </span>
                    </div>

                    <span className="text-2xs text-gray-500">
                      {data.second_comment_start_datetime.replace(
                        /(\d{4})(\d{2})(\d{2})/,
                        '$1.$2.$3',
                      )}{' '}
                      ~{' '}
                      {data.second_comment_end_datetime.replace(
                        /(\d{4})(\d{2})(\d{2})/,
                        '$1.$2.$3',
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 중간, 최종 평가 */}
      {showCommentLayer && (
        <div className="show-comment-layer space-y-1">
          <div className="underline underline-offset-4 decoration-2 decoration-amber-500">
            <span className="font-nanumsquare-bold text-lg text-white">
              {selectedChallenger.comment_time === '1' ? '중간' : '최종'} 평가:{' '}
              {selectedChallenger.name}
            </span>
          </div>

          <div className="flex justify-start items-center">
            {/* 댓글 레이어 */}
            <div className="flex">
              {/* 사용자 정보 */}
              <div className="p-5 w-44 bg-white rounded-l-md space-y-3">
                {/* 이름 */}
                <div className="leading-none space-y-1">
                  <div className="px-1">
                    <span className="font-nanumsquare-bold text-2xs text-gray-500">
                      이름
                    </span>
                  </div>

                  <div>
                    <Input
                      placeholder="이름"
                      maxLength={100}
                      disabled={JSON.stringify(member) === '{}' ? false : true}
                      onChange={handleCommentLayerName_onChange}
                      value={commentLayerInputForm.name}
                      className="font-nanumsquare-bold w-full h-9 text-xs text-gray-600 rounded"
                    />
                  </div>
                </div>

                {/* 휴대폰 뒷번호 4자리 */}
                <div className="leading-none space-y-1">
                  <div className="px-1">
                    <span className="font-nanumsquare-bold text-2xs text-gray-500">
                      휴대폰 뒷번호 4자리
                    </span>
                  </div>

                  <div>
                    <Input
                      placeholder="휴대폰 뒷번호"
                      maxLength={4}
                      disabled={JSON.stringify(member) === '{}' ? false : true}
                      onChange={handleCommentLayerPhoneLastNumber_onChange}
                      onPressEnter={() => handleButton_onClick('signin-member')}
                      value={commentLayerInputForm.phoneLastNumber}
                      className="font-nanumsquare-bold w-full h-9 text-xs text-gray-600 rounded"
                    />
                  </div>
                </div>

                {/* 버튼 */}
                <div className="pt-1">
                  {JSON.stringify(member) === '{}' && (
                    <div
                      onClick={() => handleButton_onClick('signin-member')}
                      className="button px-4 py-1 flex justify-center items-center bg-blue-400 rounded"
                    >
                      <span className="font-nanumsquare-bold text-sm text-white">
                        확인
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 평가 */}
              <div className="relative p-5 bg-gray-100 border-l border-solid border-gray-200 rounded-r-md overflow-hidden">
                {/* 무단 입력 방지 레이어 */}
                {JSON.stringify(member) === '{}' && (
                  <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center backdrop-filter backdrop-blur-md overflow-hidden z-20">
                    <div className="space-y-3">
                      <div className="flex justify-center items-center">
                        <FontAwesomeIcon
                          icon={['fas', 'circle-arrow-left']}
                          className="w-10 h-10 text-indigo-500"
                        />
                      </div>

                      <div className="leading-5">
                        <div className="flex justify-center items-center">
                          <span className="font-nanumsquare-bold text-xs text-gray-600">
                            평가를 하기 전에
                          </span>
                        </div>

                        <div className="flex justify-center items-center">
                          <span className="font-nanumsquare-bold text-xs text-gray-600">
                            평가자 정보를 먼저 입력해 주세요.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {/* 평가 별 점수 */}
                  <div className="leading-none space-y-1">
                    <div className="px-1">
                      <span className="font-nanumsquare-bold text-2xs text-gray-500">
                        평가 별 점수
                      </span>
                    </div>

                    <div className="h-9 flex justify-between items-center">
                      {/* 별 점수 */}
                      <div className="flex justify-start items-center space-x-3">
                        {/* 별 점수(1~5) */}
                        <div className="flex justify-start items-center space-x-0.5">
                          {_.range(1, 6).map((number: number) => (
                            <div
                              key={`star-${number}`}
                              id={`star-${number}`}
                              onClick={() =>
                                handleButton_onClick('star', number)
                              }
                              className="button flex justify-center items-center"
                            >
                              <FontAwesomeIcon
                                icon={['fas', 'splotch']}
                                className={`w-8 h-8 text-slate-200 ${
                                  comment.star_score >= number
                                    ? 'text-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            </div>
                          ))}
                        </div>

                        {/* 구분선 */}
                        <div className="w-px h-5 border-l border-solid border-gray-300"></div>

                        {/* 별 점수(0) */}
                        <div
                          onClick={() => handleButton_onClick('star', 0)}
                          className="button flex justify-center items-center"
                        >
                          <FontAwesomeIcon
                            icon={['fas', 'circle-xmark']}
                            className={`w-8 h-8 ${
                              comment.star_score === 0
                                ? 'text-rose-400'
                                : 'text-slate-200'
                            }`}
                          />
                        </div>
                      </div>

                      {/* 별 점수 글자 */}
                      <div>
                        <span className="font-nanumsquare-bold text-xl text-gray-500">
                          {comment.star_score}점
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 평가 댓글 */}
                  <div className="leading-none space-y-1">
                    <div className="px-1">
                      <span className="font-nanumsquare-bold text-2xs text-gray-500">
                        평가 댓글 (30자 이상)
                      </span>
                    </div>

                    <div>
                      <TextArea
                        placeholder="과제 사이트를 본 소감이나 오류사항, 바라는 점 등을 자유롭게 입력해 주세요. 내용은 언제든지 수정할 수 있습니다."
                        maxLength={3000}
                        cols={60}
                        rows={5}
                        onChange={handleCommentLayerComment_onChange}
                        value={comment.comment}
                        className="font-nanumsquare-bold text-xs text-gray-600 rounded"
                      />
                    </div>
                  </div>

                  {/* 버튼 */}
                  <div className="flex justify-end items-center space-x-2">
                    {/* 닫기 */}
                    <div
                      id="close-comment"
                      onClick={() => handleButton_onClick('close-comment')}
                      className="button px-5 py-1 flex justify-center items-center bg-slate-600 rounded"
                    >
                      <span className="font-nanumsquare-bold text-sm text-white">
                        닫기
                      </span>
                    </div>

                    {/* 저장 */}
                    <div
                      id="save-comment"
                      onClick={() => handleButton_onClick('save-comment')}
                      className="button px-5 py-1 flex justify-center items-center bg-blue-400 rounded"
                    >
                      <span className="font-nanumsquare-bold text-sm text-white">
                        저장
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 목적 */}
      <div className="space-y-1">
        <div className="underline underline-offset-4 decoration-2 decoration-amber-500">
          <span className="font-nanumsquare-bold text-lg text-white">목적</span>
        </div>

        <div>
          <span className="font-nanumsquare-bold text-sm text-gray-300">
            직원들 마다의 연차를 관리하는 사이트를 개발합니다.
            <br />
            이 프로젝트를 수행함에 따라 기본적인 추가, 수정, 삭제, 조회, 검색
            등의 개발 능력을 평가합니다.
            <br />
            또한, UI 및 UX를 보기 좋고 편리하게 구현할 수 있는지도 평가합니다.
          </span>
        </div>
      </div>

      {/* 개발 */}
      <div className="space-y-1">
        <div className="underline underline-offset-4 decoration-2 decoration-amber-500">
          <span className="font-nanumsquare-bold text-lg text-white">개발</span>
        </div>

        <div>
          <span className="font-nanumsquare-bold text-sm text-gray-300">
            바닐라 형태의 Javascript, HTML, CSS로만 구현합니다.
            <br />
            데이터베이스는 PostgreSQL을 이용하고, ANSI 표준 문법의 쿼리문으로
            작성합니다.
            <br />
            RESTful API 서버 구축을 위한 최소한의 npm 모듈 사용을 허용합니다.
            <br />
            개발에 필요한 웹 서버, 배포, FTP 등은 본 사이트에서 제공합니다.
          </span>
        </div>
      </div>

      {/* 평가 */}
      <div className="space-y-1">
        <div className="underline underline-offset-4 decoration-2 decoration-amber-500">
          <span className="font-nanumsquare-bold text-lg text-white">평가</span>
        </div>

        <div>
          <span className="font-nanumsquare-bold text-sm text-gray-300">
            중간 평가, 최종 평가로 진행되며, 자사 임직원들이 평가에 참여합니다.
            <br />
            - 중간 평가: 개발 시작 2주 후에 진행됩니다.
            <br />- 최종 평가: 개발 시작 4주 후에 진행됩니다.
          </span>
        </div>
      </div>

      {/* 레이아웃 참고 */}
      <div className="space-y-1">
        <div className="underline underline-offset-4 decoration-2 decoration-amber-500">
          <span className="font-nanumsquare-bold text-lg text-white">
            레이아웃 참고
          </span>
        </div>

        <div>
          <span className="font-nanumsquare-bold text-sm text-gray-300">
            아래의 레이아웃은 기본적인 참고 사항이므로, 동일하게 구성할 필요는
            없습니다.
            <br />
            단, 최소의 기본 기능은 포함되어야 합니다.
          </span>
        </div>
      </div>

      {/* 직원 관리 레이아웃: 직원 목록 */}
      <div className="space-y-1">
        <div className="underline underline-offset-4 decoration-2 decoration-amber-500">
          <span className="font-nanumsquare-bold text-lg text-white">
            직원 관리 레이아웃: 직원 목록
          </span>
        </div>

        <div>
          <span className="font-nanumsquare-bold text-sm text-gray-300">
            등록된 직원들의 목록입니다. 직원을 추가할 수 있는 버튼이 있으며,
            목록을 검색할 수도 있습니다.
            <br />
            직원의 전체 목록을 출력해야 하며, 목록 페이징은 제외합니다.
            <br />
            목록을 클릭하면 직원의 정보를 수정합니다.
          </span>
        </div>

        <div className="flex justify-start items-center">
          <div className="p-5 bg-white rounded space-y-1">
            {/* 버튼 */}
            <div className="flex justify-end items-center space-x-1">
              {/* 추가 */}
              <div className="px-3 py-1 w-24 flex justify-start items-center bg-gray-300 rounded">
                <span className="font-nanumsquare-bold text-sm text-white">
                  xxx
                </span>
              </div>

              {/* 추가 */}
              <div className="px-4 py-1 flex justify-center items-center bg-blue-400 rounded">
                <span className="font-nanumsquare-bold text-sm text-white">
                  검색
                </span>
              </div>
            </div>

            <div className="pt-3 flex justify-center items-center space-x-0.5">
              {/* 항목: 이름 */}
              <div className="">
                <div className="py-1 w-12 flex justify-center items-center bg-gray-200">
                  <span className="font-nanumsquare-bold text-sm text-gray-600">
                    이름
                  </span>
                </div>

                <div className="w-12 flex justify-center items-center border-b border-solid border-gray-200">
                  <span className="font-nanumsquare-bold text-sm text-gray-300">
                    xxx
                  </span>
                </div>

                <div className="w-12 flex justify-center items-center border-b border-solid border-gray-200">
                  <span className="font-nanumsquare-bold text-sm text-gray-300">
                    xxx
                  </span>
                </div>
              </div>

              {/* 항목: 직급 */}
              <div className="">
                <div className="py-1 w-12 flex justify-center items-center bg-gray-200">
                  <span className="font-nanumsquare-bold text-sm text-gray-600">
                    직급
                  </span>
                </div>

                <div className="w-12 flex justify-center items-center border-b border-solid border-gray-200">
                  <span className="font-nanumsquare-bold text-sm text-gray-300">
                    xxx
                  </span>
                </div>

                <div className="w-12 flex justify-center items-center border-b border-solid border-gray-200">
                  <span className="font-nanumsquare-bold text-sm text-gray-300">
                    xxx
                  </span>
                </div>
              </div>

              {/* 항목: 전체 연차 */}
              <div className="">
                <div className="py-1 w-20 flex justify-center items-center bg-gray-200">
                  <span className="font-nanumsquare-bold text-sm text-gray-600">
                    전체 연차
                  </span>
                </div>

                <div className="w-20 flex justify-center items-center border-b border-solid border-gray-200">
                  <span className="font-nanumsquare-bold text-sm text-gray-300">
                    xxx
                  </span>
                </div>

                <div className="w-20 flex justify-center items-center border-b border-solid border-gray-200">
                  <span className="font-nanumsquare-bold text-sm text-gray-300">
                    xxx
                  </span>
                </div>
              </div>

              {/* 항목: 잔여 연차 */}
              <div className="">
                <div className="py-1 w-20 flex justify-center items-center bg-gray-200">
                  <span className="font-nanumsquare-bold text-sm text-gray-600">
                    잔여 연차
                  </span>
                </div>

                <div className="w-20 flex justify-center items-center border-b border-solid border-gray-200">
                  <span className="font-nanumsquare-bold text-sm text-gray-300">
                    xxx
                  </span>
                </div>

                <div className="w-20 flex justify-center items-center border-b border-solid border-gray-200">
                  <span className="font-nanumsquare-bold text-sm text-gray-300">
                    xxx
                  </span>
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="pt-3 flex justify-end items-center space-x-1">
              {/* 추가 */}
              <div className="px-4 py-1 flex justify-center items-center bg-blue-400 rounded">
                <span className="font-nanumsquare-bold text-sm text-white">
                  직원 추가
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 직원 관리 레이아웃: 직원 추가 */}
      <div className="space-y-1">
        <div className="underline underline-offset-4 decoration-2 decoration-amber-500">
          <span className="font-nanumsquare-bold text-lg text-white">
            직원 관리 레이아웃: 직원 추가
          </span>
        </div>

        <div>
          <span className="font-nanumsquare-bold text-sm text-gray-300">
            직원을 추가합니다. 할당된 연차 일(Days)은 해당 직원에게 주어진 전체
            연차 일수입니다.
            <br />이 연차 일수만큼 연차를 신청할 수 있습니다.
          </span>
        </div>

        <div className="flex justify-start items-center">
          <div className="p-5 bg-white rounded space-y-1">
            {/* 항목: 이름 */}
            <div className="flex justify-start items-center space-x-3">
              <div className="w-36 flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-600">
                  이름
                </span>
              </div>

              <div className="flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-300">
                  xxx
                </span>
              </div>
            </div>

            {/* 항목: 직급 */}
            <div className="flex justify-start items-center space-x-3">
              <div className="w-36 flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-600">
                  직급
                </span>
              </div>

              <div className="flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-300">
                  xxx
                </span>
              </div>
            </div>

            {/* 항목: 할당된 연차 일(Days) */}
            <div className="flex justify-start items-center space-x-3">
              <div className="w-36 flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-600">
                  할당된 연차 일(Days)
                </span>
              </div>

              <div className="flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-300">
                  xxx일
                </span>
              </div>
            </div>

            {/* 버튼 */}
            <div className="pt-3 flex justify-end items-center space-x-1">
              {/* 취소 */}
              <div className="px-4 py-1 flex justify-center items-center bg-gray-400 rounded">
                <span className="font-nanumsquare-bold text-sm text-white">
                  취소
                </span>
              </div>

              {/* 저장 */}
              <div className="px-4 py-1 flex justify-center items-center bg-blue-400 rounded">
                <span className="font-nanumsquare-bold text-sm text-white">
                  저장
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 직원 관리 레이아웃: 직원 수정 */}
      <div className="space-y-1">
        <div className="underline underline-offset-4 decoration-2 decoration-amber-500">
          <span className="font-nanumsquare-bold text-lg text-white">
            직원 관리 레이아웃: 직원 수정
          </span>
        </div>

        <div>
          <span className="font-nanumsquare-bold text-sm text-gray-300">
            직원의 정보를 수정합니다. 삭제할 경우에는 응답 레이어를 출력하여
            사용자의 확인을 거쳐야 합니다.
            <br />
            단, 직원을 삭제하면 해당 직원의 연차 이력도 같이 삭제해야 합니다.
          </span>
        </div>

        <div className="flex justify-start items-center">
          <div className="p-5 bg-white rounded space-y-1">
            {/* 항목: 이름 */}
            <div className="flex justify-start items-center space-x-3">
              <div className="w-36 flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-600">
                  이름
                </span>
              </div>

              <div className="flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-300">
                  xxx
                </span>
              </div>
            </div>

            {/* 항목: 직급 */}
            <div className="flex justify-start items-center space-x-3">
              <div className="w-36 flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-600">
                  직급
                </span>
              </div>

              <div className="flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-300">
                  xxx
                </span>
              </div>
            </div>

            {/* 항목: 할당된 연차 일(Days) */}
            <div className="flex justify-start items-center space-x-3">
              <div className="w-36 flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-600">
                  할당된 연차 일(Days)
                </span>
              </div>

              <div className="flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-300">
                  xxx일
                </span>
              </div>
            </div>

            {/* 버튼 */}
            <div className="pt-3 flex justify-end items-center space-x-1">
              {/* 취소 */}
              <div className="px-4 py-1 flex justify-center items-center bg-gray-400 rounded">
                <span className="font-nanumsquare-bold text-sm text-white">
                  취소
                </span>
              </div>

              {/* 취소 */}
              <div className="px-4 py-1 flex justify-center items-center bg-rose-400 rounded">
                <span className="font-nanumsquare-bold text-sm text-white">
                  삭제
                </span>
              </div>

              {/* 저장 */}
              <div className="px-4 py-1 flex justify-center items-center bg-blue-400 rounded">
                <span className="font-nanumsquare-bold text-sm text-white">
                  저장
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 연차 관리 레이아웃: 직원 목록 */}
      <div className="space-y-1">
        <div className="underline underline-offset-4 decoration-2 decoration-amber-500">
          <span className="font-nanumsquare-bold text-lg text-white">
            연차 관리 레이아웃: 직원 목록
          </span>
        </div>

        <div>
          <span className="font-nanumsquare-bold text-sm text-gray-300">
            등록된 직원들의 목록입니다. 연차를 신청할 수 있는 버튼이 있으며,
            목록을 검색할 수도 있습니다.
            <br />
            직원의 전체 목록을 출력해야 하며, 목록 페이징은 제외합니다.
            <br />
            직원의 연차 이력을 클릭하면 해당 직원의 연차 정보를 수정합니다.
            <br />
            연차 이력은 한 행(Row)이 가득 차면 다음 행으로 개행됩니다.
          </span>
        </div>

        <div className="flex justify-start items-center">
          <div className="p-5 bg-white rounded space-y-1">
            {/* 버튼 */}
            <div className="flex justify-end items-center space-x-1">
              {/* 추가 */}
              <div className="px-3 py-1 w-24 flex justify-start items-center bg-gray-300 rounded">
                <span className="font-nanumsquare-bold text-sm text-white">
                  xxx
                </span>
              </div>

              {/* 추가 */}
              <div className="px-4 py-1 flex justify-center items-center bg-blue-400 rounded">
                <span className="font-nanumsquare-bold text-sm text-white">
                  검색
                </span>
              </div>
            </div>

            <div>
              <div className="pt-3 flex justify-center items-center space-x-0.5">
                {/* 항목: 이름 */}
                <div className="">
                  <div className="py-1 w-32 flex justify-center items-center bg-gray-200">
                    <span className="font-nanumsquare-bold text-sm text-gray-600">
                      이름
                    </span>
                  </div>

                  <div className="w-32 flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-sm text-gray-300">
                      xxx
                    </span>
                  </div>
                </div>

                {/* 항목: 직급 */}
                <div className="">
                  <div className="py-1 w-32 flex justify-center items-center bg-gray-200">
                    <span className="font-nanumsquare-bold text-sm text-gray-600">
                      직급
                    </span>
                  </div>

                  <div className="w-32 flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-sm text-gray-300">
                      xxx
                    </span>
                  </div>
                </div>

                {/* 항목: 연차 */}
                <div className="">
                  <div className="py-1 w-32 flex justify-center items-center bg-gray-200">
                    <span className="font-nanumsquare-bold text-sm text-gray-600">
                      연차
                    </span>
                  </div>

                  <div className="w-32 flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-sm text-gray-300">
                      xxx / xxx
                    </span>
                  </div>
                </div>
              </div>

              {/* 연차 신청 이력 */}
              <div className="py-1 flex justify-start items-center space-x-1">
                <div className="px-2 py-1 bg-amber-400 rounded">
                  <div className="flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-xs text-white">
                      xxxx.xx.xx
                    </span>
                  </div>

                  <div className="flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-xs text-white">
                      xxxx.xx.xx
                    </span>
                  </div>

                  <div className="flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-xs text-white">
                      xxx일
                    </span>
                  </div>
                </div>

                <div className="px-2 py-1 bg-amber-400 rounded">
                  <div className="flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-xs text-white">
                      xxxx.xx.xx
                    </span>
                  </div>

                  <div className="flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-xs text-white">
                      xxxx.xx.xx
                    </span>
                  </div>

                  <div className="flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-xs text-white">
                      xxx일
                    </span>
                  </div>
                </div>
              </div>

              {/* 구분선 */}
              <div className="w-full border-b border-solid border-gray-200" />

              <div className="flex justify-center items-center space-x-0.5">
                {/* 항목: 이름 */}
                <div className="">
                  <div className="w-32 flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-sm text-gray-300">
                      xxx
                    </span>
                  </div>
                </div>

                {/* 항목: 직급 */}
                <div className="">
                  <div className="w-32 flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-sm text-gray-300">
                      xxx
                    </span>
                  </div>
                </div>

                {/* 항목: 연차 */}
                <div className="">
                  <div className="w-32 flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-sm text-gray-300">
                      xxx / xxx
                    </span>
                  </div>
                </div>
              </div>

              {/* 연차 신청 이력 */}
              <div className="py-1 flex justify-start items-center space-x-1">
                <div className="px-2 py-1 bg-amber-400 rounded">
                  <div className="flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-xs text-white">
                      xxxx.xx.xx
                    </span>
                  </div>

                  <div className="flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-xs text-white">
                      xxxx.xx.xx
                    </span>
                  </div>

                  <div className="flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-xs text-white">
                      xxx일
                    </span>
                  </div>
                </div>

                <div className="px-2 py-1 bg-amber-400 rounded">
                  <div className="flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-xs text-white">
                      xxxx.xx.xx
                    </span>
                  </div>

                  <div className="flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-xs text-white">
                      xxxx.xx.xx
                    </span>
                  </div>

                  <div className="flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-xs text-white">
                      xxx일
                    </span>
                  </div>
                </div>

                <div className="px-2 py-1 bg-amber-400 rounded">
                  <div className="flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-xs text-white">
                      xxxx.xx.xx
                    </span>
                  </div>

                  <div className="flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-xs text-white">
                      xxxx.xx.xx
                    </span>
                  </div>

                  <div className="flex justify-center items-center">
                    <span className="font-nanumsquare-bold text-xs text-white">
                      xxx일
                    </span>
                  </div>
                </div>
              </div>

              {/* 구분선 */}
              <div className="w-full border-b border-solid border-gray-200" />
            </div>

            {/* 버튼 */}
            <div className="pt-3 flex justify-end items-center space-x-1">
              {/* 연차 신청 */}
              <div className="px-4 py-1 flex justify-center items-center bg-blue-400 rounded">
                <span className="font-nanumsquare-bold text-sm text-white">
                  연차 신청
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 연차 관리 레이아웃: 연차 신청 */}
      <div className="space-y-1">
        <div className="underline underline-offset-4 decoration-2 decoration-amber-500">
          <span className="font-nanumsquare-bold text-lg text-white">
            연차 관리 레이아웃: 연차 신청
          </span>
        </div>

        <div>
          <span className="font-nanumsquare-bold text-sm text-gray-300">
            직원이 사용한 연차를 작성합니다. 입력한 연차 일수(Days)만큼 해당
            직원의 전체 연차에서 차감해야 합니다.
            <br />
            단, 남아 있는 연차 일수(Days)보다 더 많은 일수를 입력하면 경고창을
            출력합니다.
          </span>
        </div>

        <div className="flex justify-start items-center">
          <div className="p-5 bg-white rounded space-y-1">
            {/* 항목: 직원 이름 */}
            <div className="flex justify-start items-center space-x-3">
              <div className="w-36 flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-600">
                  직원 이름
                </span>
              </div>

              <div className="flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-300">
                  xxx
                </span>
              </div>
            </div>

            {/* 항목: 연차 시작 일자 */}
            <div className="flex justify-start items-center space-x-3">
              <div className="w-36 flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-600">
                  연차 시작 일자
                </span>
              </div>

              <div className="flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-300">
                  xxxx.xx.xx
                </span>
              </div>
            </div>

            {/* 항목: 연차 종료 일자 */}
            <div className="flex justify-start items-center space-x-3">
              <div className="w-36 flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-600">
                  연차 종료 일자
                </span>
              </div>

              <div className="flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-300">
                  xxxx.xx.xx
                </span>
              </div>
            </div>

            {/* 항목: 사용한 연차 일(Days) */}
            <div className="flex justify-start items-center space-x-3">
              <div className="w-36 flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-600">
                  사용한 연차 일(Days)
                </span>
              </div>

              <div className="flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-300">
                  xxx일
                </span>
              </div>
            </div>

            {/* 버튼 */}
            <div className="pt-3 flex justify-end items-center space-x-1">
              {/* 취소 */}
              <div className="px-4 py-1 flex justify-center items-center bg-gray-400 rounded">
                <span className="font-nanumsquare-bold text-sm text-white">
                  취소
                </span>
              </div>

              {/* 저장 */}
              <div className="px-4 py-1 flex justify-center items-center bg-blue-400 rounded">
                <span className="font-nanumsquare-bold text-sm text-white">
                  저장
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 연차 관리 레이아웃: 연차 신청 수정 */}
      <div className="space-y-1">
        <div className="underline underline-offset-4 decoration-2 decoration-amber-500">
          <span className="font-nanumsquare-bold text-lg text-white">
            연차 관리 레이아웃: 연차 신청 수정
          </span>
        </div>

        <div>
          <span className="font-nanumsquare-bold text-sm text-gray-300">
            직원이 사용한 연차를 수정합니다. 삭제할 경우에는 응답 레이어를
            출력하여 사용자의 확인을 거쳐야 합니다.
            <br />
            단, 남아 있는 연차 일수(Days)보다 더 많은 일수를 입력하면 경고창을
            출력합니다.
          </span>
        </div>

        <div className="flex justify-start items-center">
          <div className="p-5 bg-white rounded space-y-1">
            {/* 항목: 직원 이름 */}
            <div className="flex justify-start items-center space-x-3">
              <div className="w-36 flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-600">
                  직원 이름
                </span>
              </div>

              <div className="flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-300">
                  xxx
                </span>
              </div>
            </div>

            {/* 항목: 연차 시작 일자 */}
            <div className="flex justify-start items-center space-x-3">
              <div className="w-36 flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-600">
                  연차 시작 일자
                </span>
              </div>

              <div className="flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-300">
                  xxxx.xx.xx
                </span>
              </div>
            </div>

            {/* 항목: 연차 종료 일자 */}
            <div className="flex justify-start items-center space-x-3">
              <div className="w-36 flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-600">
                  연차 종료 일자
                </span>
              </div>

              <div className="flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-300">
                  xxxx.xx.xx
                </span>
              </div>
            </div>

            {/* 항목: 사용한 연차 일(Days) */}
            <div className="flex justify-start items-center space-x-3">
              <div className="w-36 flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-600">
                  사용한 연차 일(Days)
                </span>
              </div>

              <div className="flex justify-end items-center">
                <span className="font-nanumsquare-bold text-sm text-gray-300">
                  xxx일
                </span>
              </div>
            </div>

            {/* 버튼 */}
            <div className="pt-3 flex justify-end items-center space-x-1">
              {/* 취소 */}
              <div className="px-4 py-1 flex justify-center items-center bg-gray-400 rounded">
                <span className="font-nanumsquare-bold text-sm text-white">
                  취소
                </span>
              </div>

              {/* 취소 */}
              <div className="px-4 py-1 flex justify-center items-center bg-rose-400 rounded">
                <span className="font-nanumsquare-bold text-sm text-white">
                  삭제
                </span>
              </div>

              {/* 저장 */}
              <div className="px-4 py-1 flex justify-center items-center bg-blue-400 rounded">
                <span className="font-nanumsquare-bold text-sm text-white">
                  저장
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Vacation;
