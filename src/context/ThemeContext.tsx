import React, {createContext, useContext, useEffect, useState} from 'react';

interface ThemeContextType {
    darkMode: boolean;
    toggleDarkMode: (checked: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [darkMode, setDarkMode] = useState(() => {
        const savedDarkMode = localStorage.getItem('darkMode');

        // Por defecto, consulta el estado guardado o la preferencia del sistema
        return savedDarkMode ? savedDarkMode === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {

        // Agregar la clase de tema oscuro
        document.body.classList.toggle('dark-theme', darkMode);

        // Guardar preferencia en localStorage
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    const toggleDarkMode = (checked: boolean) => {
        setDarkMode(checked);
    };

    return (
        <ThemeContext.Provider value={{darkMode, toggleDarkMode}}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};