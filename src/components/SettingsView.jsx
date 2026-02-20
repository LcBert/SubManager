import React from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { ChevronLeft } from 'lucide-react';

const SettingsView = ({ setActiveTab }) => {
    const { theme, setTheme, language, setLanguage, currency, setCurrency } = useThemeLanguage();
    return (
        <section className="view">
            <header className="app-header">
                <button className="icon-btn" aria-label={language === 'it' ? 'Indietro' : 'Back'} onClick={() => setActiveTab('dashboard')}>
                    <ChevronLeft size={24} /> {language === 'it' ? 'Indietro' : 'Back'}
                </button>
                <div style={{ flex: 1 }} />
                <h1 style={{ margin: 0, textAlign: 'right', minWidth: 120 }}>{language === 'it' ? 'Impostazioni' : 'Settings'}</h1>
            </header>
            <main className="scroll-content">
                <div className="form-group">
                    <label htmlFor="theme-select">{language === 'it' ? 'Tema' : 'Theme'}</label>
                    <select
                        id="theme-select"
                        value={theme}
                        onChange={e => setTheme(e.target.value)}
                    >
                        <option value="system">{language === 'it' ? 'Sistema' : 'System'}</option>
                        <option value="light">{language === 'it' ? 'Chiaro' : 'Light'}</option>
                        <option value="dark">{language === 'it' ? 'Scuro' : 'Dark'}</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="lang-select">{language === 'it' ? 'Lingua' : 'Language'}</label>
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
                    <label htmlFor="currency-select">{language === 'it' ? 'Valuta' : 'Currency'}</label>
                    <select
                        id="currency-select"
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                    >
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">Dollar ($)</option>
                        <option value="GBP">Pound (£)</option>
                        <option value="JPY">Yen (¥)</option>
                        <option value="CHF">Swiss Franc (CHF)</option>
                    </select>
                </div>
            </main>
        </section>
    );
};

export default SettingsView;
