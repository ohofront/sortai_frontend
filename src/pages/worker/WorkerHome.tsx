import { useQuery } from '@tanstack/react-query';
import { fetchTickets } from '../../api/mock';
import { ArrowLeft, Clock, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { StepType } from '../../types';

// 단계별 한글 명칭 매핑 (UI용)
const STEP_NAMES: Record<StepType, string> = {
    PRE_PROCESS: '전처리',
    STANDARDIZE: '규격화',
    PACK: '포장',
    SHIP: '출고',
};

export default function WorkerHome() {
    const navigate = useNavigate();

    const { data: tickets, isLoading } = useQuery({
        queryKey: ['tickets'],
        queryFn: fetchTickets,
    });

    return (
        <div className="pb-20"> {/* Layout이 배경을 잡으므로 min-h-screen 등 제거하고 pb만 유지 */}
            {/* Header */}
            <header className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-lg font-bold">작업 티켓 목록</h1>
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">Worker</span>
            </header>

            {/* Content */}
            <main className="p-4 space-y-4">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500">티켓 로딩 중...</div>
                ) : (
                    tickets?.map((ticket) => {
                        // 현재 진행 중인 단계 객체 찾기
                        const currentStep = ticket.steps[ticket.currentStepIndex];

                        return (
                            <div
                                key={ticket.id}
                                onClick={() => navigate(`/worker/tickets/${ticket.id}`)}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer hover:border-blue-300"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        ticket.status === 'WORKING' ? 'bg-blue-100 text-blue-700' :
                            ticket.status === 'DONE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {ticket.status}
                    </span>
                                        <span className="text-gray-400 text-xs">#{ticket.id}</span>
                                    </div>
                                </div>

                                <h3 className="font-bold text-gray-800 text-lg mb-1">{ticket.product.name}</h3>

                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                                    <div className="flex items-center gap-1">
                                        <Package className="w-4 h-4" />
                                        <span>{STEP_NAMES[currentStep.type]} 단계</span>
                                    </div>

                                    {ticket.status === 'WORKING' && (
                                        <div className="flex items-center gap-1 text-orange-500">
                                            <Clock className="w-4 h-4" />
                                            <span>작업 중</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </main>
        </div>
    );
}