import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { MapPin, Shield } from 'lucide-react';

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLanguageSelect = (lang: 'en' | 'ta' | 'hi') => {
    setLanguage(lang);
  };

  const handleContinue = () => {
    navigate('/home');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-800 text-white p-6">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Shield className="w-20 h-20 text-accent" />
        </div>
        <h1 className="text-5xl font-bold mb-2">{t('app.name')}</h1>
        <p className="text-xl text-blue-100">{t('app.tagline')}</p>
      </div>

      {loading ? (
        /* Loading State */
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto mb-4"></div>
          <p className="text-lg">{t('splash.loading')}</p>
        </div>
      ) : (
        /* Language Selection */
        <div className="w-full max-w-md bg-white rounded-2xl p-6 text-gray-900 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {t('splash.selectLanguage')}
          </h2>

          <div className="space-y-3 mb-6">
            <LanguageButton
              language="en"
              label={t('languages.en')}
              selected={language === 'en'}
              onClick={() => handleLanguageSelect('en')}
            />
            <LanguageButton
              language="ta"
              label={t('languages.ta')}
              selected={language === 'ta'}
              onClick={() => handleLanguageSelect('ta')}
            />
            <LanguageButton
              language="hi"
              label={t('languages.hi')}
              selected={language === 'hi'}
              onClick={() => handleLanguageSelect('hi')}
            />
          </div>

          <button
            onClick={handleContinue}
            className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors"
          >
            {t('common.next')}
          </button>
        </div>
      )}

      {/* Version */}
      <p className="mt-8 text-blue-100 text-sm">
        v{import.meta.env.VITE_APP_VERSION || '1.0.0'}
      </p>
    </div>
  );
};

interface LanguageButtonProps {
  language: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

const LanguageButton: React.FC<LanguageButtonProps> = ({
  language,
  label,
  selected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-4 px-6 rounded-lg border-2 transition-all font-medium text-lg ${
        selected
          ? 'border-primary bg-primary-50 text-primary'
          : 'border-gray-300 bg-white text-gray-700 hover:border-primary-300'
      }`}
    >
      {label}
    </button>
  );
};

export default Splash;