import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // [추가 1] useMutation, useQueryClient
import { fetchTicketDetail, api } from '../../api/mock'; // [추가 2] api 객체 import (completeStep 사용 위함)
import { ArrowLeft, Check } from 'lucide-react';
import StepAction from '../../components/worker/StepAction';
import AICopilot from '../../components/common/AICopilot';

export default function TicketDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient(); // [추가 3] 쿼리 클라이언트 가져오기

    // 1. 데이터 조회 (기존 동일)
    const { data: ticket, isLoading } = useQuery({
        queryKey: ['ticket', id],
        queryFn: () => fetchTicketDetail(id || ''),
    });

    // 2. [핵심] 단계 완료 처리 Mutation (상태 변경 요청)
    const completeStepMutation = useMutation({
        mutationFn: async () => {
            if (!ticket || !currentStep) return;
            // mock.ts에 있는 completeStep 함수를 호출하여 더미 데이터 상태를 변경함
            await api.completeStep(ticket.id, currentStep.id);
        },
        onSuccess: () => {
            // 성공 시 'ticket' 데이터를 무효화(Invalidate)하여 다시 불러옴 -> 화면 자동 갱신
            queryClient.invalidateQueries({ queryKey: ['ticket', id] });

            // 만약 마지막 단계였다면 알림
            if (currentStep?.type === 'SHIP') {
                alert("모든 공정이 완료되었습니다! 고생하셨습니다.");
                navigate('/worker'); // 목록으로 이동
            }
        }
    });

    if (isLoading) return <div className="p-10 text-center text-gray-500">데이터를 불러오는 중...</div>;
    if (!ticket) return <div className="p-10 text-center text-gray-500">티켓을 찾을 수 없습니다.</div>;

    // 현재 진행해야 할 단계 찾기
    const currentStep = ticket.steps[ticket.currentStepIndex];

    return (
        <div className="pb-24">
            {/* 헤더 */}
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/worker')} className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="font-bold text-gray-900 text-lg leading-tight">{ticket.product.name}</h1>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 font-medium border border-gray-200">
                {ticket.targetSpec.grade}등급
              </span>
                            <span>주문번호: {ticket.orderId}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* 상단 공정 스테퍼 (Stepper) */}
            <div className="bg-white px-4 py-3 border-b border-gray-100 overflow-x-auto scrollbar-hide">
                <div className="flex items-center min-w-max gap-2">
                    {ticket.steps.map((step, idx) => {
                        const isActive = idx === ticket.currentStepIndex;
                        const isDone = idx < ticket.currentStepIndex;

                        return (
                            <div key={step.id} className="flex items-center gap-2">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                                    isActive ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-100' :
                                        isDone ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-400'
                                }`}>
                                    {isDone ? <Check className="w-3 h-3" /> : <span className="text-xs">{idx + 1}</span>}
                                    {step.type === 'PRE_PROCESS' ? '전처리' :
                                        step.type === 'STANDARDIZE' ? '규격화' :
                                            step.type === 'PACK' ? '포장' : '출고'}
                                </div>
                                {idx < ticket.steps.length - 1 && <div className="w-4 h-0.5 bg-gray-100" />}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 메인 작업 영역 */}
            <main className="p-4 max-w-lg mx-auto">
                <StepAction
                    step={currentStep}
                    spec={ticket.targetSpec}
                    // Mutation 실행 (로딩 중이면 클릭 방지)
                    onComplete={() => {
                        if (!completeStepMutation.isPending) {
                            completeStepMutation.mutate();
                        }
                    }}
                />
            </main>

            {/* AI 챗봇 */}
            <AICopilot />
        </div>
    );
}