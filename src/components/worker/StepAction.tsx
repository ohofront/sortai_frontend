import { useState, useEffect } from 'react';
import { Camera, CheckCircle2, Loader2, Scale, Printer, ScanBarcode, Box } from 'lucide-react';
import type { WorkStep, Spec, AiInspectionResult } from '../../types';
import AiReportCard from './AiReportCard';

interface Props {
    step: WorkStep;
    spec: Spec;
    onComplete: () => void;
}

export default function StepAction({ step, spec, onComplete }: Props) {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    // --- 상태 관리 (각 단계별로 필요한 데이터) ---
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<AiInspectionResult | null>(null);

    const [measuredWeight, setMeasuredWeight] = useState<number | null>(null); // 규격화: 측정 무게
    const [isLabelPrinted, setIsLabelPrinted] = useState(false);               // 포장: 라벨 출력 여부
    const [isBarcodeScanned, setIsBarcodeScanned] = useState(false);           // 출고: 바코드 스캔 여부

    // 단계가 바뀔 때 상태 초기화
    useEffect(() => {
        setCheckedItems(new Set());
        setAiResult(null);
        setMeasuredWeight(null);
        setIsLabelPrinted(false);
        setIsBarcodeScanned(false);
    }, [step.id]);

    const toggleCheck = (id: string) => {
        const next = new Set(checkedItems);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setCheckedItems(next);
    };

    // ----------------------------------------------------
    // 1. [전처리] AI Vision 검수 로직
    // ----------------------------------------------------
    const handlePhotoUpload = () => {
        setIsAnalyzing(true);
        setAiResult(null);
        setTimeout(() => {
            const isRandomPass = true; // 무조건 통과 (Demo)
            setAiResult({
                stepId: step.id,
                isPass: isRandomPass,
                score: 98,
                guideText: `규격(${spec.grade}) 기준을 충족합니다.`
            });
            setIsAnalyzing(false);
        }, 1500);
    };

    // ----------------------------------------------------
    // 2. [규격화] IoT 저울 연동 시뮬레이션
    // ----------------------------------------------------
    const handleWeighing = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            // 목표 중량 근처의 랜덤 값 생성 (오차 범위 내)
            const randomWeight = spec.targetWeight + (Math.random() * spec.tolerance * 0.8) * (Math.random() > 0.5 ? 1 : -1);
            setMeasuredWeight(Math.floor(randomWeight));
            setIsAnalyzing(false);
        }, 1000);
    };

    // ----------------------------------------------------
    // 3. [포장] 라벨 출력 시뮬레이션
    // ----------------------------------------------------
    const handlePrintLabel = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsLabelPrinted(true);
            setIsAnalyzing(false);
        }, 1000);
    };

    // ----------------------------------------------------
    // 4. [출고] 바코드 스캔 시뮬레이션
    // ----------------------------------------------------
    const handleScanBarcode = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsBarcodeScanned(true);
            setIsAnalyzing(false);
        }, 800);
    };

    // ----------------------------------------------------
    // 완료 조건 계산 (단계별로 다름)
    // ----------------------------------------------------
    const isChecklistComplete = checkedItems.size === step.checkList.length;

    let isActionComplete = false;
    if (step.type === 'PRE_PROCESS') isActionComplete = aiResult?.isPass === true;
    else if (step.type === 'STANDARDIZE') isActionComplete = measuredWeight !== null;
    else if (step.type === 'PACK') isActionComplete = isLabelPrinted;
    else if (step.type === 'SHIP') isActionComplete = isBarcodeScanned;

    const isReadyToComplete = isChecklistComplete && isActionComplete;

    // ----------------------------------------------------
    // 단계별 UI 렌더링 함수
    // ----------------------------------------------------
    const renderSpecialAction = () => {
        // A. 전처리 (Vision AI)
        if (step.type === 'PRE_PROCESS') {
            return (
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-2">AI 품질/이물질 검수</h3>
                    {!aiResult && !isAnalyzing && (
                        <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
                            <input type="file" className="hidden" onChange={handlePhotoUpload} />
                            <Camera className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                            <span className="text-gray-500 text-sm font-medium group-hover:text-blue-600">촬영하여 AI 검수 시작</span>
                        </label>
                    )}
                    {isAnalyzing && (
                        <div className="w-full h-32 border border-gray-200 rounded-xl flex flex-col items-center justify-center bg-gray-50">
                            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                            <span className="text-blue-600 font-bold text-sm">Vision AI 분석 중...</span>
                        </div>
                    )}
                    {aiResult && <AiReportCard result={aiResult} />}
                </div>
            );
        }

        // B. 규격화 (IoT 저울)
        if (step.type === 'STANDARDIZE') {
            return (
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-2">IoT 중량 측정</h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-center">
                        <Scale className="w-10 h-10 text-slate-400 mx-auto mb-2" />

                        {!measuredWeight && !isAnalyzing && (
                            <button onClick={handleWeighing} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-md active:scale-95 transition-transform cursor-pointer hover:bg-blue-700">
                                저울 데이터 수신
                            </button>
                        )}

                        {isAnalyzing && <span className="text-blue-600 font-bold animate-pulse">측정 중...</span>}

                        {measuredWeight && (
                            <div className="animate-in zoom-in">
                                <span className="text-4xl font-black text-slate-800">{measuredWeight}</span>
                                <span className="text-lg text-slate-500 ml-1">g</span>
                                <div className="mt-2 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full inline-block">
                                    정상 범위 내 (Target: {spec.targetWeight}g)
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // C. 포장 (라벨 프린터)
        if (step.type === 'PACK') {
            return (
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-2">운송장 라벨 출력</h3>
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 flex flex-col items-center justify-center min-h-[140px]">
                        {!isLabelPrinted && !isAnalyzing && (
                            <button onClick={handlePrintLabel} className="flex flex-col items-center gap-2 text-orange-700 hover:text-orange-900 transition-colors cursor-pointer">
                                <Printer className="w-10 h-10" />
                                <span className="font-bold underline">라벨 출력하기</span>
                            </button>
                        )}

                        {isAnalyzing && <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />}

                        {isLabelPrinted && (
                            <div className="flex items-center gap-3 animate-in slide-in-from-bottom-2">
                                <div className="w-24 h-24 bg-white border border-gray-300 shadow-sm p-2 rounded flex flex-col justify-between">
                                    <div className="h-4 w-full bg-gray-800 rounded-sm"></div>
                                    <div className="space-y-1">
                                        <div className="h-1 w-full bg-gray-300"></div>
                                        <div className="h-1 w-2/3 bg-gray-300"></div>
                                    </div>
                                    <ScanBarcode className="w-8 h-8 text-gray-800 self-center opacity-80" />
                                </div>
                                <div className="text-sm text-orange-800 font-bold">
                                    <CheckCircle2 className="w-5 h-5 inline mr-1 mb-0.5" />
                                    출력 완료
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // D. 출고 (바코드 스캔)
        if (step.type === 'SHIP') {
            return (
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-800 mb-2">최종 출고 스캔</h3>
                    <div className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center min-h-[140px] transition-colors ${isBarcodeScanned ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}>
                        {!isBarcodeScanned && !isAnalyzing && (
                            <button onClick={handleScanBarcode} className="flex flex-col items-center gap-2 text-gray-500 hover:text-blue-600 cursor-pointer">
                                <ScanBarcode className="w-12 h-12" />
                                <span className="font-medium text-sm">PDA/스캐너로 바코드 인식</span>
                            </button>
                        )}

                        {isAnalyzing && <span className="text-blue-600 font-bold animate-pulse">스캔 중...</span>}

                        {isBarcodeScanned && (
                            <div className="text-center animate-in zoom-in">
                                <Box className="w-10 h-10 text-green-600 mx-auto mb-2" />
                                <h4 className="text-lg font-bold text-green-800">출고 처리 완료</h4>
                                <p className="text-xs text-green-600">시스템 재고 차감됨</p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
            {/* 공통: Spec 정보 */}
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Target Spec</h4>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-700 font-medium">목표 등급</span>
                    <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {spec.grade} Grade
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-slate-700 font-medium">중량 기준</span>
                    <span className="text-slate-900 font-bold">
                        {spec.targetWeight}g <span className="text-xs text-gray-400 font-normal ml-1">(±{spec.tolerance}g)</span>
                    </span>
                </div>
            </div>

            {/* 공통: 체크리스트 (SOP는 모든 단계에 있음) */}
            <div className="space-y-3 mb-8">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    작업 체크리스트
                    <span className="text-xs font-normal text-gray-400">({checkedItems.size}/{step.checkList.length})</span>
                </h3>
                {step.checkList.map((item) => (
                    <label key={item.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                            type="checkbox"
                            checked={checkedItems.has(item.id)}
                            onChange={() => toggleCheck(item.id)}
                            className="w-5 h-5 accent-blue-600 rounded"
                        />
                        <span className={checkedItems.has(item.id) ? 'text-gray-400 line-through' : 'text-gray-700'}>
                            {item.text}
                        </span>
                    </label>
                ))}
            </div>

            {/* 단계별 특수 UI (여기가 바뀝니다!) */}
            {renderSpecialAction()}

            {/* 완료 버튼 */}
            <button
                onClick={onComplete}
                disabled={!isReadyToComplete}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isReadyToComplete
                        ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
            >
                {isReadyToComplete && <CheckCircle2 className="w-5 h-5" />}
                {isReadyToComplete ? '작업 완료 처리' : '체크 및 공정 완료 필요'}
            </button>
        </div>
    );
}