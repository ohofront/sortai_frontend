import { Outlet } from 'react-router-dom';

export default function WorkerLayout() {
    return (
        <div className="h-full relative bg-gray-50">
            {/* 작업자 화면은 각 페이지 헤더가 중요하므로 레이아웃은 껍데기 역할만 수행 */}
            <Outlet />
        </div>
    );
}