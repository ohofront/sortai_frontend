import { useNavigate } from 'react-router-dom';
import { Truck, Settings } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sort AI</h1>
            <p className="text-gray-500 mb-10">AI 기반 농수산물 유통 운영 플랫폼</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                {/* 작업자 진입 버튼 */}
                <button
                    onClick={() => navigate('/worker')}
                    className="cursor-pointer flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
                >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                        <Truck className="w-8 h-8 text-blue-600 group-hover:text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">현장 작업자</h2>
                    <p className="text-gray-500 text-sm mt-2">티켓 처리 / 공정 관리 / 사진 업로드</p>
                </button>

                {/* 관리자 진입 버튼 */}
                <button
                    onClick={() => navigate('/admin')}
                    className="cursor-pointer flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-green-500 hover:shadow-md transition-all group"
                >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                        <Settings className="w-8 h-8 text-green-600 group-hover:text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">운영 관리자</h2>
                    <p className="text-gray-500 text-sm mt-2">대시보드 / SOP 관리 / 모니터링</p>
                </button>
            </div>
        </div>
    );
}