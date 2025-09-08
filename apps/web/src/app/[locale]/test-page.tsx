import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function TestPage() {
  const t = useTranslations('common');
  
  return (
    <div className="min-h-screen p-8">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">{t('loading')}</h1>
        <p className="text-lg">Test de traduction fonctionnelle !</p>
        
        <div className="space-y-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            {t('save')}
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded ml-2">
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}