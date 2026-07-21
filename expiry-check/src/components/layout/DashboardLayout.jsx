import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useLanguage } from '../../contexts/LanguageContext';

export default function DashboardLayout({ children }) {
  const { isRTL } = useLanguage();

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      <Sidebar />
      <Topbar />
      <main
        className="ec-main min-h-screen"
        style={{
          marginLeft:  isRTL ? 0       : '16rem',
          marginRight: isRTL ? '16rem' : 0,
          paddingTop:  '4rem',
        }}
      >
        <div
          className="mx-auto px-8 py-8"
          style={{ maxWidth: 'var(--spacing-container-max)' }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
