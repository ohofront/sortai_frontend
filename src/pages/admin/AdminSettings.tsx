import { User, Shield, LogOut, ChevronRight, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function AdminSettings() {
    const navigate = useNavigate();

    // 로컬 useState 대신 전역 ThemeContext 사용
    const { isDarkMode, toggleTheme } = useTheme();

    const handleLogout = () => {
        if (window.confirm('로그아웃 하시겠습니까?')) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors duration-200">
            {/* Header */}
            <header className="bg-white dark:bg-slate-900 p-4 shadow-sm sticky top-0 z-10 transition-colors duration-200">
                <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100">설정</h1>
            </header>

            <main className="p-4 space-y-6">
                {/* 1. 프로필 카드 */}
                <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-colors duration-200">
                    <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-slate-500 dark:text-slate-300" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">관리자 (Admin)</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">admin@standardflow.com</p>
                        <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded mt-1 inline-block">
                            Super Admin
                        </span>
                    </div>
                </section>

                {/* 2. 앱 설정 */}
                <section className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">앱 설정</h3>
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-200">

                        {/* 다크 모드 설정 */}
                        <div className="flex items-center justify-between p-4 cursor-pointer" onClick={toggleTheme}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-colors ${
                                    isDarkMode ? 'bg-indigo-900' : 'bg-indigo-50'
                                }`}>
                                    {isDarkMode ? (
                                        <Moon className="w-5 h-5 text-indigo-400" />
                                    ) : (
                                        <Sun className="w-5 h-5 text-indigo-600" />
                                    )}
                                </div>
                                <span className="font-medium text-slate-700 dark:text-slate-200">다크 모드</span>
                            </div>

                            {/* 토글 스위치 */}
                            <button
                                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                                    isDarkMode ? 'bg-indigo-600' : 'bg-slate-200'
                                }`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform ${
                                    isDarkMode ? 'left-[26px]' : 'left-0.5'
                                }`} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* 3. 계정 및 보안 (UI 생략 없이 그대로 유지) */}
                <section className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 ml-1">계정 및 정보</h3>
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-200">
                        <button className="w-full flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="font-medium text-slate-700 dark:text-slate-200">보안 및 권한 관리</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                        </button>
                        <div className="p-4 flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                            <span>앱 버전</span>
                            <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">v1.0.2 (Beta)</span>
                        </div>
                    </div>
                </section>

                {/* 4. 로그아웃 */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-red-600 font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                >
                    <LogOut className="w-5 h-5" />
                    로그아웃
                </button>
            </main>
        </div>
    );
}