import React from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { ChevronLeft } from 'lucide-react';

const SettingsView = ({ setActiveTab }) => {
    const { theme, setTheme, language, setLanguage, currency, setCurrency, t } = useThemeLanguage();
    return (
        <section className="view">
            <header className="app-header">
                <button className="icon-btn" aria-label={t('back')} onClick={() => setActiveTab('dashboard')}>
                    <ChevronLeft size={24} /> {t('back')}
                </button>
                <div style={{ flex: 1 }} />
                <h1 style={{ margin: 0, textAlign: 'right', minWidth: 120 }}>{t('settings')}</h1>
            </header>
            <main className="scroll-content">
                <div className="form-group">
                    <label htmlFor="theme-select">{t('theme')}</label>
                    <select
                        id="theme-select"
                        value={theme}
                        onChange={e => setTheme(e.target.value)}
                    >
                        <option value="system">{t('system')}</option>
                        <option value="light">{t('light')}</option>
                        <option value="dark">{t('dark')}</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="lang-select">{t('language')}</label>
                    <select
                        id="lang-select"
                        value={language}
                        onChange={e => setLanguage(e.target.value)}
                    >
                        <option value="en">English</option>
                        <option value="it">Italiano</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="currency-select">{t('currency')}</label>
                    <select
                        id="currency-select"
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                    >
                        <option value="EUR">{t('euro')}</option>
                        <option value="USD">{t('dollar')}</option>
                        <option value="GBP">{t('pound')}</option>
                        <option value="JPY">{t('yen')}</option>
                        <option value="CHF">{t('franc')}</option>
                    </select>
                </div>
            </main>
        </section>
    );
};

export default SettingsView;
