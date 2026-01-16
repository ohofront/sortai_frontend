import './App.css'

function App() {
    return (
        // 전체 화면 높이(h-screen), 배경색(bg-blue-500), 플렉스 박스로 중앙 정렬
        <div className="h-screen w-full flex items-center justify-center bg-blue-500">
            <div className="text-center">
                {/* 글자 크기(text-5xl), 굵기(font-bold), 글자색(text-white) */}
                <h1 className="text-5xl font-bold text-white mb-4">
                    Tailwind v4 작동 성공! 🎉
                </h1>
                <p className="text-blue-100 text-xl">
                    이제 스타일링을 시작해보세요.
                </p>
                <button className="mt-6 px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition">
                    테스트 버튼
                </button>
            </div>
        </div>
    )
}

export default App
