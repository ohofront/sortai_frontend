import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Box, Settings } from 'lucide-react';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    // 현재 경로가 해당 메뉴인지 확인하는 헬퍼 (settings 포함)
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="flex flex-col h-full">
            {/* 페이지 콘텐츠 (스크롤 가능 영역) */}
            <div className="flex-1 overflow-y-auto pb-20">
                <Outlet />
            </div>

            {/* 하단 네비게이션 바 (Fixed Bottom) */}
            <nav className="absolute bottom-0 w-full bg-white border-t border-gray-200 h-16 flex items-center justify-around z-50 pb-safe">
                <button
                    onClick={() => navigate('/admin')}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 cursor-pointer ${
                        isActive('/admin') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <LayoutDashboard className="w-6 h-6" />
                    <span className="text-[10px] font-medium">대시보드</span>
                </button>

                <button
                    onClick={() => navigate('/admin/products')}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 cursor-pointer ${
                        isActive('/admin/products') || location.pathname.startsWith('/admin/products/')
                            ? 'text-blue-600'
                            : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <Box className="w-6 h-6" />
                    <span className="text-[10px] font-medium">품목관리</span>
                </button>

                {/* 설정 버튼 활성화 */}
                <button
                    onClick={() => navigate('/admin/settings')}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 cursor-pointer ${
                        isActive('/admin/settings') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] font-medium">설정</span>
                </button>
            </nav>
        </div>
    );
}