import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { MOCK_PRODUCTS } from '../../api/mock'; // Mock 데이터 import

export default function ProductManage() {
    const navigate = useNavigate();

    // 초기 데이터를 Mock 데이터에서 가져오도록 설정 (실제 앱에서는 useQuery 사용 권장)
    const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);

    // 드롭다운 메뉴 상태 관리 (어떤 ID의 메뉴가 열려있는지)
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // 드롭다운 외부 클릭 시 닫기 위한 Ref
    const menuRef = useRef<HTMLDivElement>(null);

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 품목 추가 핸들러
    const handleAddProduct = () => {
        const name = window.prompt("추가할 품목명을 입력해주세요 (예: 거봉 포도)");
        if (name) {
            const newProduct: Product = {
                id: Date.now().toString(),
                name: name,
                category: '미분류',
                standard: '표준 없음',
                status: 'Active'
            };
            setProducts([...products, newProduct]);
        }
    };

    // 품목 삭제 핸들러
    const handleDeleteProduct = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // 부모(Row) 클릭 이벤트 전파 방지
        if (window.confirm("정말로 이 품목을 삭제하시겠습니까?")) {
            setProducts(products.filter(p => p.id !== id));
            setOpenMenuId(null);
        }
    };

    // 상세 페이지 이동 핸들러
    const handleRowClick = (id: string) => {
        navigate(`/admin/products/${id}`);
    };

    // 메뉴 토글 핸들러
    const toggleMenu = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // 부모(Row) 클릭 방지
        setOpenMenuId(openMenuId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin')}
                        className="p-2 hover:bg-slate-100 rounded-full cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="font-bold text-lg">품목 및 규격 관리</h1>
                </div>

                <button
                    onClick={handleAddProduct}
                    className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 hover:bg-slate-800 cursor-pointer active:scale-95 transition-transform"
                >
                    <Plus className="w-4 h-4" /> 품목 추가
                </button>
            </header>

            <main className="p-4 max-w-3xl mx-auto" ref={menuRef}>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible"> {/* overflow-visible 중요 */}
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-sm border-b">
                        <tr>
                            <th className="p-4 font-medium">품목명</th>
                            <th className="p-4 font-medium hidden sm:table-cell">카테고리</th>
                            <th className="p-4 font-medium">관리 규격</th>
                            <th className="p-4 font-medium">상태</th>
                            <th className="p-4 text-right">관리</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                        {products.map((p) => (
                            <tr
                                key={p.id}
                                onClick={() => handleRowClick(p.id)} // [기능] Row 클릭 시 상세 이동
                                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                            >
                                <td className="p-4 font-medium text-slate-800">{p.name}</td>
                                <td className="p-4 text-slate-500 text-sm hidden sm:table-cell">{p.category}</td>
                                <td className="p-4 text-slate-500 text-sm">
                                    <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">{p.standard}</span>
                                </td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                      {p.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right relative">
                                    {/* [기능] 더보기 버튼 */}
                                    <button
                                        onClick={(e) => toggleMenu(e, p.id)}
                                        className={`p-2 rounded-full transition-colors cursor-pointer ${
                                            openMenuId === p.id ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:bg-slate-100'
                                        }`}
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {/* [기능] 드롭다운 메뉴 (조건부 렌더링) */}
                                    {openMenuId === p.id && (
                                        <div className="absolute right-8 top-8 w-32 bg-white rounded-lg shadow-xl border border-slate-100 z-20 animate-in fade-in zoom-in-95 duration-100">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleRowClick(p.id); }}
                                                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer first:rounded-t-lg"
                                            >
                                                <Edit className="w-3 h-3" /> 수정
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteProduct(e, p.id)}
                                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer last:rounded-b-lg border-t border-slate-100"
                                            >
                                                <Trash2 className="w-3 h-3" /> 삭제
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">
                                    등록된 품목이 없습니다.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}