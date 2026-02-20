import React from 'react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';


const SettingsView = ({ setActiveTab }) => {
    const { theme, setTheme, language, setLanguage } = useThemeLanguage();
    return (
        <section className="view">
            <header className="app-header">
                <button className="icon-btn" aria-label={language === 'it' ? 'Indietro' : 'Back'} onClick={() => setActiveTab('dashboard')} style={{ marginRight: 12 }}>
                    &#8592;
                </button>
                <h1>{language === 'it' ? 'Impostazioni' : 'Settings'}</h1>
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
            </main>
        </section>
    );
};

export default SettingsView;
