import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import MobileLayout from './layouts/MobileLayout';
import WorkerLayout from './layouts/WorkerLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Landing from './pages/Landing';
import WorkerHome from './pages/worker/WorkerHome';
import TicketDetail from './pages/worker/TicketDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManage from './pages/admin/ProductManage';
import ProductDetail from './pages/admin/ProductDetail';
import AdminSettings from './pages/admin/AdminSettings';
import {ThemeProvider} from "./context/ThemeContext.tsx";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <BrowserRouter>
                    <Routes>
                        <Route element={<MobileLayout />}>
                            <Route path="/" element={<Landing />} />

                            <Route element={<WorkerLayout />}>
                                <Route path="/worker" element={<WorkerHome />} />
                                <Route path="/worker/tickets/:id" element={<TicketDetail />} />
                            </Route>

                            <Route element={<AdminLayout />}>
                                <Route path="/admin" element={<AdminDashboard />} />
                                <Route path="/admin/products" element={<ProductManage />} />
                                <Route path="/admin/products/:id" element={<ProductDetail />} />
                                <Route path="/admin/settings" element={<AdminSettings />} />
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;