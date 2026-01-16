import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProductDetail } from '../../api/mock';
import { ArrowLeft, Save, Trash2, Box, FileText } from 'lucide-react';

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // 상품 상세 데이터 조회
    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProductDetail(id || ''),
    });

    if (isLoading) return <div className="p-10 text-center text-gray-500">데이터 로딩 중...</div>;
    if (!product) return <div className="p-10 text-center text-gray-500">상품을 찾을 수 없습니다.</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="p-2 hover:bg-slate-100 rounded-full cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="font-bold text-lg">상품 상세 정보</h1>
                </div>
                <button
                    onClick={() => alert('저장되었습니다 (Demo)')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 cursor-pointer active:scale-95 transition-transform"
                >
                    <Save className="w-4 h-4" /> 저장
                </button>
            </header>

            <main className="p-6 max-w-2xl mx-auto space-y-6">
                {/* 1. 기본 정보 카드 */}
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Box className="w-5 h-5 text-slate-500" />
                        기본 정보
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">품목명</label>
                            <input
                                type="text"
                                defaultValue={product.name}
                                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">카테고리</label>
                                <select className="w-full p-3 border border-slate-300 rounded-lg bg-white">
                                    <option>{product.category}</option>
                                    <option>엽채류</option>
                                    <option>근채류</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">상태</label>
                                <select
                                    className="w-full p-3 border border-slate-300 rounded-lg bg-white"
                                    defaultValue={product.status}
                                >
                                    <option value="Active">판매 중 (Active)</option>
                                    <option value="Inactive">판매 중지 (Inactive)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. 규격 및 SOP 설정 */}
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-500" />
                        규격 및 관리 기준 (SOP)
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">관리 규격 (Standard)</label>
                            <input
                                type="text"
                                defaultValue={product.standard}
                                placeholder="예: S/M/L"
                                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-slate-400 mt-1">※ 콤마(,) 또는 슬래시(/)로 구분하여 입력</p>
                        </div>
                    </div>
                </section>

                {/* 3. 위험 구역 (삭제) */}
                <section className="pt-6 border-t border-slate-200">
                    <button
                        className="w-full py-4 text-red-600 font-bold bg-red-50 rounded-xl hover:bg-red-100 cursor-pointer flex items-center justify-center gap-2"
                        onClick={() => {
                            if(confirm("정말 삭제하시겠습니까?")) {
                                alert("삭제되었습니다.");
                                navigate('/admin/products');
                            }
                        }}
                    >
                        <Trash2 className="w-5 h-5" />
                        품목 삭제
                    </button>
                </section>
            </main>
        </div>
    );
}