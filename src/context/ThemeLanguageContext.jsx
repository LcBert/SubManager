import React, { createContext, useContext, useState, useEffect } from 'react';
import { t as translate } from '../utils/localization';

const ThemeLanguageContext = createContext();

const getSystemTheme = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
};


export const ThemeLanguageProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
    const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
    const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || 'EUR');

    // Apply theme to document and listen for system theme changes
    useEffect(() => {
        let appliedTheme = theme;
        const updateTheme = () => {
            let newTheme = theme;
            if (theme === 'system') {
                newTheme = getSystemTheme();
            }
            document.documentElement.setAttribute('data-theme', newTheme);
        };
        updateTheme();
        localStorage.setItem('theme', theme);

        let mql;
        if (theme === 'system' && window.matchMedia) {
            mql = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = () => updateTheme();
            mql.addEventListener ? mql.addEventListener('change', handler) : mql.addListener(handler);
            return () => {
                mql.removeEventListener ? mql.removeEventListener('change', handler) : mql.removeListener(handler);
            };
        }
    }, [theme]);

    // Store language
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    // Store currency
    useEffect(() => {
        localStorage.setItem('currency', currency);
    }, [currency]);

    // t function with current language
    const t = (key, vars = {}) => translate(key, language, vars);
    return (
        <ThemeLanguageContext.Provider value={{ theme, setTheme, language, setLanguage, currency, setCurrency, t }}>
            {children}
        </ThemeLanguageContext.Provider>
    );
};

export const useThemeLanguage = () => useContext(ThemeLanguageContext);
