// 공통 Enum/Type
export type StepType = 'PRE_PROCESS' | 'STANDARDIZE' | 'PACK' | 'SHIP';
export type TicketStatus = 'READY' | 'WORKING' | 'DONE' | 'HOLD';
export type StepStatus = 'PENDING' | 'IN_PROGRESS' | 'DONE';

// 상품 관련
export interface Product {
    id: string; // 관리자 페이지에서는 number였지만, 전역적으로 string(UUID 등) 권장
    name: string;
    category: string; // 예: 과채류
    standard: string; // 관리 규격 (예: M/L)
    status: 'Active' | 'Inactive'; // 판매 상태
    imageUrl?: string;
}

// 규격(Spec) 관련
export interface Spec {
    id: string;
    productId: string;
    grade: 'S' | 'M' | 'L'; // 규격
    targetWeight: number; // 목표 중량 (g)
    tolerance: number; // 허용 오차 (g)
    defectRules: string[]; // 불량 기준 텍스트
}

// 공정 단계(Step) 관련
export interface WorkStep {
    id: string;
    ticketId: string;
    type: StepType;
    status: StepStatus;
    startedAt?: string;
    completedAt?: string;
    checkList: { id: string; text: string; checked: boolean }[];
    photos: string[]; // 업로드된 사진 URL
}

// 작업 티켓(Ticket) - 메인 모델
export interface WorkTicket {
    id: string;
    orderId: string;
    product: Product;
    targetSpec: Spec; // 이번 주문의 목표 규격
    totalQuantity: number; // 작업 수량
    status: TicketStatus;
    currentStepIndex: number; // 현재 진행 중인 단계 (0~3)
    steps: WorkStep[]; // 4단계 (전처리/규격/포장/출고)
    createdAt: string;
}

// AI 리포트 결과 타입
export interface AiInspectionResult {
    stepId: string;
    isPass: boolean;
    score: number; // 0~100
    defectType?: string; // 멍, 찍힘 등
    guideText: string; // "재선별하세요" 등
}

// 관리자 대시보드 통계 타입
export interface DashboardStat {
    label: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
}