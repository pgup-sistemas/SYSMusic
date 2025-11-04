
import React, { useState } from 'react';
import LandingPage from '../pages/LandingPage';
import ValidateCertificatePage from '../pages/ValidateCertificatePage';
import PublicCursosPage from '../pages/PublicCursosPage';
import PublicEventosPage from '../pages/PublicEventosPage';

interface PublicLayoutProps {
    onGoToLogin: () => void;
}

type PublicPage = 'Home' | 'Cursos' | 'Eventos' | 'Validar Certificado';

const PublicLayout: React.FC<PublicLayoutProps> = ({ onGoToLogin }) => {
    const [activePage, setActivePage] = useState<PublicPage>('Home');

    const renderPage = () => {
        switch(activePage) {
            case 'Home':
                return <LandingPage onGoToCursos={() => setActivePage('Cursos')} onGoToTrial={() => {}} />;
            case 'Cursos':
                return <PublicCursosPage />;
            case 'Eventos':
                return <PublicEventosPage />;
            case 'Validar Certificado':
                return <ValidateCertificatePage />;
            default:
                return <LandingPage onGoToCursos={() => setActivePage('Cursos')} onGoToTrial={() => {}} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <i className="fas fa-music text-3xl text-indigo-500"></i>
                            <span className="ml-3 text-xl font-bold text-gray-800 dark:text-white">Sol Maior</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            {(['Home', 'Cursos', 'Eventos', 'Validar Certificado'] as PublicPage[]).map(page => (
                                <button key={page} onClick={() => setActivePage(page)} className={`px-3 py-2 rounded-md text-sm font-medium ${activePage === page ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button onClick={onGoToLogin} className="hidden md:block px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">
                            Acesso ao Portal
                        </button>
                        {/* Mobile menu button can be added here if needed */}
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main>
                {renderPage()}
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
                <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Sol Maior Escola de Música. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;