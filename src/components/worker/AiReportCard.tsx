import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import type { AiInspectionResult } from '../../types'; // 타입 경로 확인

interface Props {
    result: AiInspectionResult;
}

export default function AiReportCard({ result }: Props) {
    const isPass = result.isPass;

    return (
        <div className={`mt-4 p-4 rounded-xl border-2 ${
            isPass ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'
        } animate-in fade-in slide-in-from-bottom-2`}>

            {/* 헤더: 통과 여부 및 점수 */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    {isPass ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <span className={`font-bold text-lg ${isPass ? 'text-green-800' : 'text-red-800'}`}>
            {isPass ? 'AI 품질 검수 통과' : '재작업 요망'}
          </span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-500">품질 점수</span>
                    <span className={`text-xl font-bold ${isPass ? 'text-green-700' : 'text-red-700'}`}>
            {result.score}점
          </span>
                </div>
            </div>

            {/* 불량 상세 내용 (불합격 시) */}
            {!isPass && (
                <div className="flex items-start gap-2 bg-white/60 p-3 rounded-lg border border-red-100 mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                    <div>
            <span className="text-xs font-bold text-red-500 block mb-1">
              불량 감지: {result.defectType}
            </span>
                        <p className="text-sm text-gray-700">{result.guideText}</p>
                    </div>
                </div>
            )}

            {/* 가이드 텍스트 (합격 시) */}
            {isPass && (
                <p className="text-sm text-green-700 pl-8">
                    {result.guideText || "규격 범위 내 정상 제품입니다."}
                </p>
            )}
        </div>
    );
}