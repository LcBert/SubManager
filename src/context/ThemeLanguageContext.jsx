import React, { createContext, useContext, useState, useEffect } from 'react';

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

    // Apply theme to document
    useEffect(() => {
        let appliedTheme = theme;
        if (theme === 'system') {
            appliedTheme = getSystemTheme();
        }
        document.documentElement.setAttribute('data-theme', appliedTheme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Store language
    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    return (
        <ThemeLanguageContext.Provider value={{ theme, setTheme, language, setLanguage }}>
            {children}
        </ThemeLanguageContext.Provider>
    );
};

export const useThemeLanguage = () => useContext(ThemeLanguageContext);
