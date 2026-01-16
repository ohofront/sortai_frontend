import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function MobileLayout() {
    const { isDarkMode } = useTheme();

    return (
        // 바깥 배경: 항상 회색 (bg-gray-100) - 다크모드 영향 안 받음
        <div className="min-h-screen bg-gray-100 flex justify-center items-start">

            {/* [핵심] 모바일 컨테이너 isDarkMode가 true일 때만 'dark' 클래스를 추가합니다.
                Tailwind의 'dark:' 속성들은 이 div 내부에서만 작동하게 됩니다.
            */}
            <div className={`w-full max-w-md min-h-screen shadow-2xl overflow-hidden relative flex flex-col transition-colors duration-200 
            ${isDarkMode ? 'dark bg-slate-950' : 'bg-white'}`}>
                {/* 내부 콘텐츠 영역 */}
                <div className="flex-1 overflow-y-auto scrollbar-hide text-slate-900 dark:text-slate-100">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}