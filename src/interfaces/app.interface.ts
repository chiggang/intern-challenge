import { IconProp } from '@fortawesome/fontawesome-svg-core';

/**
 * Size
 * @Param width: Width size(px)
 * @Param height: Height size(px)
 */
export interface ISize {
  width: number;
  height: number;
}

/**
 * Position
 * @Param x: Horizontal position(px)
 * @Param y: Vertical position(px)
 */
export interface IPosition {
  x: number;
  y: number;
}

/**
 * 환경설정
 * @Param api.commonUrl: 공용 RESTful API 주소
 */
export interface IAppConfig {
  api: {
    commonUrl: {
      host: string;
      port: string;
    };
    commonUrlPort: string;
  };
}
