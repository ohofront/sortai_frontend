import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '../../api/mock';
import { ArrowLeft, BarChart3, TrendingUp, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChartData {
    labels: string[];
    values: number[];
    unit: string;
    description: string;
}

export default function AdminDashboard() {
    const navigate = useNavigate();

    const [selectedStatLabel, setSelectedStatLabel] = useState<string | null>(null);

    const { data: stats, isLoading, isError } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: fetchDashboardStats,
    });

    useEffect(() => {
        if (stats && stats.length > 0 && !selectedStatLabel) {
            setSelectedStatLabel(stats[0].label);
        }
    }, [stats, selectedStatLabel]);

    const getChartData = (label: string): ChartData => {
        switch (label) {
            case '금일 주문 접수':
                return {
                    labels: ['09시', '10시', '11시', '12시', '13시', '14시'],
                    values: [12, 19, 35, 22, 45, 30],
                    unit: '건',
                    description: '시간대별 주문 유입 현황 (피크타임: 13시)'
                };
            case '처리 완료':
                return {
                    labels: ['김철수', '이영희', '박지성', '최동원', '정대만'],
                    values: [45, 38, 52, 29, 41],
                    unit: '건',
                    description: '작업자별 금일 누적 처리 건수'
                };
            case '공정 병목':
                return {
                    labels: ['전처리', '규격화', '포장', '출고'],
                    values: [5, 8, 25, 10],
                    unit: '분',
                    description: '공정 단계별 평균 체류 시간 (포장 단계 지연 심각)'
                };
            default:
                return { labels: [], values: [], unit: '', description: '' };
        }
    };

    const currentChartData = selectedStatLabel ? getChartData(selectedStatLabel) : null;

    // [수정] 최대값을 구합니다. 0이면 1로 설정해 나눗셈 오류 방지
    const maxChartValue = currentChartData && currentChartData.values.length > 0
        ? Math.max(...currentChartData.values) || 1
        : 1;

    // [수정] 차트의 최대 높이 (픽셀 단위)
    const MAX_BAR_HEIGHT_PX = 180;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">데이터 분석 중...</p>
            </div>
        );
    }

    if (isError || !stats) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-red-500">데이터를 불러오는데 실패했습니다.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white cursor-pointer p-1 rounded-full hover:bg-slate-800">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-lg">Standard Flow Admin</span>
                </div>
            </header>

            <main className="p-6 max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <BarChart3 className="w-7 h-7 text-blue-600" />
                    운영 현황 대시보드
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, idx) => {
                        const isSelected = selectedStatLabel === stat.label;
                        return (
                            <div
                                key={idx}
                                onClick={() => setSelectedStatLabel(stat.label)}
                                className={`p-6 rounded-xl shadow-sm border transition-all cursor-pointer relative overflow-hidden group ${
                                    isSelected
                                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                                        : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
                                }`}
                            >
                                <p className={`text-sm font-medium mb-1 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>
                                    {stat.label}
                                </p>
                                <div className="flex items-end justify-between">
                                    <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                                    <span className={`text-sm font-medium flex items-center gap-1 ${
                                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {stat.trend === 'up' ? <TrendingUp className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
                                        {stat.trend === 'up' ? '증가' : '주의'}
                                    </span>
                                </div>
                                {isSelected && (
                                    <div className="absolute top-0 right-0 p-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 차트 영역 */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
                    {currentChartData ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-1">{selectedStatLabel} 상세 분석</h3>
                                    <p className="text-slate-500 text-sm flex items-center gap-1">
                                        <Clock className="w-4 h-4" /> 실시간 데이터 기준
                                    </p>
                                </div>
                                <div className="bg-slate-100 px-4 py-2 rounded-lg text-sm text-slate-600 font-medium">
                                    {currentChartData.description}
                                </div>
                            </div>

                            {/* [수정됨] 높이를 h-64(256px)로 고정하고 내부 정렬 */}
                            <div className="flex items-end justify-around h-64 w-full gap-4 border-b border-slate-200 pb-2">
                                {currentChartData.labels.map((label, idx) => {
                                    const value = currentChartData.values[idx];

                                    // [핵심] 픽셀 단위로 직접 계산 (전체 180px 중 몇 px인지)
                                    // 0일 때도 4px은 보이게 설정 (안 보이면 헷갈리므로)
                                    const heightPx = Math.max((value / maxChartValue) * MAX_BAR_HEIGHT_PX, 4);

                                    const isDanger = selectedStatLabel === '공정 병목' && label === '포장';
                                    const barColor = isDanger ? '#f87171' : '#3b82f6';

                                    return (
                                        <div key={idx} className="flex flex-col items-center justify-end w-full group h-full">
                                            {/* 값 라벨 (호버 시 표시) */}
                                            <span className="mb-2 text-sm font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                                {value}{currentChartData.unit}
                                            </span>

                                            {/* [핵심] 인라인 스타일로 높이(px)와 너비, 색상을 강제 주입 */}
                                            <div
                                                style={{
                                                    height: `${heightPx}px`, // 픽셀 단위 적용
                                                    width: '40px',          // 너비 고정
                                                    backgroundColor: barColor,
                                                    borderRadius: '6px 6px 0 0'
                                                }}
                                                className="transition-all duration-700 ease-out hover:opacity-80"
                                            ></div>

                                            <span className="mt-3 text-sm font-medium text-slate-600">{label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
                            <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
                            <p>상단의 카드를 클릭하여 상세 데이터를 확인하세요.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}