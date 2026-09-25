// 산행 지도 — 등산로·등고선 레이어를 켠 지형도 위에 경로 선과 내 위치를 그린다.
// 내 위치 따라가기·전체 경로 보기는 화면이 ref로 조작한다.
import {
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
  NaverMapView,
  type NaverMapViewRef,
} from '@mj-studio/react-native-naver-map';
import { forwardRef } from 'react';
import { StyleSheet } from 'react-native';

import { regionFor } from '@/lib/geo';
import { palette } from '@/theme';

import type { TrackPoint } from '../queries/hike-files';

interface HikeMapProps {
  points: readonly TrackPoint[];
  /** 기록 보기에서만 출발·도착 표시를 단다 */
  showEnds?: boolean;
  onReady?: () => void;
}

export const HikeMap = forwardRef<NaverMapViewRef, HikeMapProps>(
  ({ points, showEnds = false, onReady }, ref) => {
    const coords = points.map((p) => ({ latitude: p.latitude, longitude: p.longitude }));
    const first = coords[0];
    const last = coords[coords.length - 1];

    return (
      <NaverMapView
        ref={ref}
        style={StyleSheet.absoluteFill}
        mapType="Terrain"
        layerGroups={{
          BUILDING: true,
          MOUNTAIN: true,
          TRAFFIC: false,
          TRANSIT: false,
          BICYCLE: false,
          CADASTRAL: false,
        }}
        locale="ko"
        initialRegion={coords.length > 0 ? regionFor(coords) : undefined}
        isShowCompass
        isShowZoomControls
        isShowLocationButton={false}
        isShowScaleBar
        onInitialized={onReady}
      >
        {coords.length >= 2 && (
          <NaverMapPathOverlay
            coords={coords}
            width={6}
            outlineWidth={2}
            color={palette.route}
            outlineColor={palette.routeOutline}
          />
        )}
        {showEnds && first && (
          <NaverMapMarkerOverlay
            latitude={first.latitude}
            longitude={first.longitude}
            image={{ symbol: 'green' }}
            width={36}
            height={48}
            caption={{ text: '출발', textSize: 20 }}
          />
        )}
        {showEnds && last && coords.length >= 2 && (
          <NaverMapMarkerOverlay
            latitude={last.latitude}
            longitude={last.longitude}
            image={{ symbol: 'red' }}
            width={36}
            height={48}
            caption={{ text: '도착', textSize: 20 }}
          />
        )}
      </NaverMapView>
    );
  },
);
HikeMap.displayName = 'HikeMap';
