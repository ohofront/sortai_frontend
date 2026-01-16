import type {
    WorkTicket,
    Product,
    Spec,
    WorkStep,
    StepType,
    StepStatus,
    DashboardStat
} from '../types';

// ------------------------------------
// 1. Mock Data 생성 (Helpers & Constants)
// ------------------------------------

// [상품 정의] - 개별 변수로 먼저 선언 (Ticket에서 참조하기 위해)
const PRODUCT_TOMATO: Product = { id: '1', name: '완숙 토마토', category: '과채류', standard: 'M/L', status: 'Active' };
const PRODUCT_APPLE: Product = { id: '2', name: '청송 사과', category: '과채류', standard: 'S/M/L', status: 'Active' };
const PRODUCT_MANDARINE: Product = { id: '3', name: '제주 감귤', category: '과채류', standard: 'S', status: 'Inactive' };

// 관리자 페이지용 전체 상품 리스트 export
export const MOCK_PRODUCTS: Product[] = [
    PRODUCT_TOMATO,
    PRODUCT_APPLE,
    PRODUCT_MANDARINE
];

// [규격(Spec) 정의]
const SPEC_TOMATO_M: Spec = {
    id: 's1', productId: 'p1', grade: 'M', targetWeight: 5000, tolerance: 100,
    defectRules: ['표면 20% 이상 멍', '검은 반점', '꼭지 이탈']
};

const SPEC_APPLE_L: Spec = {
    id: 's2', productId: 'p2', grade: 'L', targetWeight: 10000, tolerance: 200,
    defectRules: ['찍힘', '부패', '색상 미달', '병충해 흔적']
};

// [공정 단계 생성 헬퍼 함수]
const createSteps = (ticketId: string): WorkStep[] => {
    const types: StepType[] = ['PRE_PROCESS', 'STANDARDIZE', 'PACK', 'SHIP'];

    return types.map((type, idx) => ({
        id: `step-${ticketId}-${idx}`,
        ticketId,
        type,
        // 첫 단계(0번)는 'IN_PROGRESS', 나머지는 'PENDING'으로 초기화
        status: (idx === 0 ? 'IN_PROGRESS' : 'PENDING') as StepStatus,
        checkList: [
            { id: `chk-${ticketId}-${idx}-1`, text: `${type} - 육안 검수 진행`, checked: false },
            { id: `chk-${ticketId}-${idx}-2`, text: `${type} - 작업 기준 준수 확인`, checked: false },
        ],
        photos: []
    }));
};

// ------------------------------------
// 2. 메인 Mock 데이터베이스
// ------------------------------------
export const MOCK_TICKETS: WorkTicket[] = [
    {
        id: 't-101',
        orderId: 'ord-2024-001',
        product: PRODUCT_TOMATO, // 이제 위에서 정의한 변수를 참조하므로 에러 없음
        targetSpec: SPEC_TOMATO_M,
        totalQuantity: 50,
        status: 'WORKING',
        currentStepIndex: 0,
        steps: [],
        createdAt: new Date().toISOString(),
    },
    {
        id: 't-102',
        orderId: 'ord-2024-002',
        product: PRODUCT_APPLE, // 에러 없음
        targetSpec: SPEC_APPLE_L,
        totalQuantity: 20,
        status: 'READY',
        currentStepIndex: 0,
        steps: [],
        createdAt: new Date().toISOString(),
    }
];

// steps 배열 초기화 실행
MOCK_TICKETS.forEach(ticket => {
    ticket.steps = createSteps(ticket.id);
});

// 관리자 대시보드 통계 데이터
const MOCK_STATS: DashboardStat[] = [
    { label: '금일 주문 접수', value: '150건', trend: 'up' },
    { label: '처리 완료', value: '120건', trend: 'up' },
    { label: '공정 병목', value: '포장 단계', trend: 'down' },
];

// ------------------------------------
// 3. API 함수 (Simulation)
// ------------------------------------

export const api = {
    // 1. 전체 티켓 목록 조회
    getTickets: async (): Promise<WorkTicket[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_TICKETS]), 500));
    },

    // 2. 티켓 상세 조회 (ID로 찾기)
    getTicketDetail: async (id: string): Promise<WorkTicket | undefined> => {
        return new Promise(resolve => setTimeout(() => {
            const ticket = MOCK_TICKETS.find(t => t.id === id);
            resolve(ticket);
        }, 300));
    },

    // 3. 대시보드 통계 조회
    getDashboardStats: async (): Promise<DashboardStat[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_STATS]), 500));
    },

    // 4. 공정 단계 완료 처리 (상태 머신 로직)
    completeStep: async (ticketId: string, stepId: string) => {
        return new Promise(resolve => setTimeout(() => {
            const ticket = MOCK_TICKETS.find(t => t.id === ticketId);
            if (!ticket) return;

            const stepIndex = ticket.steps.findIndex(s => s.id === stepId);
            if (stepIndex === -1) return;

            // 현재 단계 완료 처리
            ticket.steps[stepIndex].status = 'DONE';
            ticket.steps[stepIndex].completedAt = new Date().toISOString();

            // 다음 단계가 있다면 활성화
            if (stepIndex < ticket.steps.length - 1) {
                ticket.steps[stepIndex + 1].status = 'IN_PROGRESS';
                ticket.currentStepIndex = stepIndex + 1;
            } else {
                // 마지막 단계라면 티켓 전체 완료
                ticket.status = 'DONE';
            }
            resolve(true);
        }, 500));
    },

    // 5. 상품 상세 조회
    getProductDetail: async (id: string): Promise<Product | undefined> => {
        return new Promise(resolve => setTimeout(() => {
            const product = MOCK_PRODUCTS.find(p => p.id === id);
            resolve(product);
        }, 300));
    }
};

// [하위 호환성 export] 기존 코드들이 깨지지 않도록 별칭 내보내기
export const fetchTickets = api.getTickets;
export const fetchTicketDetail = api.getTicketDetail;
export const fetchDashboardStats = api.getDashboardStats;
export const fetchProductDetail = api.getProductDetail;