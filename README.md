# Sort AI (Standard Flow)

**AI 기반 농수산물 유통/물류 운영 관리 플랫폼**

이 프로젝트는 농수산물 유통 센터(APC)에서 **현장 작업자**와 **관리자**가 유통 공정을 효율적으로 처리하고 모니터링할 수 있도록 돕는 웹 애플리케이션 프로토타입입니다.

## 🛠 Tech Stack

* **Framework:** React (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (v4)
* **State Management (Server):** TanStack Query (React Query v5)
* **State Management (Client):** Context API (Theme)
* **Routing:** React Router DOM
* **Icons:** Lucide React

## ✨ Key Features (주요 기능)

### 1. 현장 작업자 모드 (Mobile View)

* **작업 티켓 관리:** 할당된 작업 목록 확인 및 상태(대기/진행중/완료) 표시
* **공정별 맞춤 UI:**
* **전처리:** 카메라 촬영 및 AI Vision 품질 검수 시뮬레이션
* **규격화:** IoT 저울 연동 시뮬레이션 (중량 측정 및 등급 판정)
* **포장:** 운송장 라벨 출력 시뮬레이션
* **출고:** 바코드 스캐너(PDA) 연동 시뮬레이션


* **실시간 프로세스:** 체크리스트 및 작업 단계 자동 전환

### 2. 관리자 모드 (Desktop View)

* **대시보드:**
* 실시간 주문 접수, 처리 현황, 공정 병목 구간 모니터링
* CSS 기반의 커스텀 인터랙티브 막대 차트 (라이브러리 미사용)


* **품목 관리:**
* 전체 품목 리스트 조회 및 상태 관리
* 신규 품목 추가 및 상세 정보 수정/삭제 (Mock CRUD)


* **설정:**
* 관리자 프로필 정보
* **다크 모드(Dark Mode)** 토글 지원 (앱 내부 컨테이너 적용)



### 3. 🎨 UI/UX & Architecture

* **반응형 레이아웃:** 모바일(작업자)과 데스크탑(관리자) 환경에 최적화된 레이아웃 분리
* **Mock API System:** 실제 백엔드 없이 `setTimeout`을 이용한 비동기 데이터 통신 시뮬레이션
* **Dark Mode Support:** Tailwind CSS v4 기반의 커스텀 테마 시스템 (`!important` 오버라이딩 방식 적용)

## 📂 Project Structure

```bash
src/
├── api/             # Mock Data 및 가짜 API 함수 (mock.ts)
├── components/      # 재사용 가능한 UI 컴포넌트
│   ├── common/      # 공통 컴포넌트 (AICopilot 등)
│   └── worker/      # 작업자용 컴포넌트 (StepAction, AiReportCard 등)
├── context/         # 전역 상태 관리 (ThemeContext.tsx)
├── layouts/         # 페이지 레이아웃 (Mobile, Worker, Admin)
├── pages/           # 실제 페이지 화면
│   ├── admin/       # 관리자 페이지 (Dashboard, Product, Settings)
│   └── worker/      # 작업자 페이지 (Home, TicketDetail)
├── types/           # TypeScript 타입 정의 (index.ts)
├── App.tsx          # 라우팅 및 Provider 설정
├── index.css        # Tailwind CSS 설정 및 다크모드 오버라이딩
└── main.tsx         # 진입점

```

## 🚀 Getting Started

이 프로젝트는 Vite를 기반으로 만들어졌습니다.

### 1. 설치

```bash
npm install
# or
yarn install

```

### 2. 실행

```bash
npm run dev
# or
yarn dev

```

### 3. 접속

브라우저에서 `http://localhost:5173` 으로 접속하세요.

* **현장 작업자:** 랜딩 페이지 -> 트럭 아이콘 클릭
* **운영 관리자:** 랜딩 페이지 -> 설정 아이콘 클릭
