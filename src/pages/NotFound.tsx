import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * 페이지를 찾을 수 없는 오류 페이지
 */
const NotFound: React.FC = () => {
  // 버튼을 클릭함
  const handleButton_onClick = (type: string, param: any = '') => {
    switch (type) {
      // 홈으로 이동
      case 'home':
        window.location.href = '/';
        break;

      default:
        break;
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="space-y-2">
        {/* 아이콘 */}
        <div className="flex justify-center items-center">
          <FontAwesomeIcon
            icon={['fas', 'bomb']}
            className="w-5 h-5 text-red-700 animate-bounce"
          />
        </div>

        {/* 영문 메시지 */}
        <div>
          <div className="flex justify-center items-center">
            <span className="text-4xl font-bold">404</span>
          </div>
          <div className="flex justify-center items-center">
            <span className="text-sm font-semibold">Page not found</span>
          </div>
        </div>

        {/* 한글 메시지 */}
        <div className="flex justify-center items-center">
          <span className="text-base">페이지를 찾을 수 없습니다.</span>
        </div>

        {/* 버튼 */}
        <div className="flex justify-center items-center select-none">
          <div
            onClick={() => handleButton_onClick('home')}
            className="button mt-2 px-5 py-1 flex justify-center items-center bg-gray-800 rounded-md"
          >
            <span className="text-base font-bold text-white">Home</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
