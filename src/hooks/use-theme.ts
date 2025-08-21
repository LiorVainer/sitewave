'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export const useThemeToggle = () => {
    const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Ensure component is mounted to avoid hydration issues
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const setLightTheme = () => setTheme('light');
    const setDarkTheme = () => setTheme('dark');
    const setSystemTheme = () => setTheme('system');

    const isDarkMode = mounted ? resolvedTheme === 'dark' : false;
    const isLightMode = mounted ? resolvedTheme === 'light' : false;
    const isSystemMode = theme === 'system';
    const currentTheme = mounted ? (theme as Theme) : 'system';
    const effectiveTheme = mounted ? resolvedTheme : 'light';

    const isUsingSystemDark = isSystemMode && systemTheme === 'dark';
    const isUsingSystemLight = isSystemMode && systemTheme === 'light';

    const getThemeIcon = () => {
        if (!mounted) return 'sun'; // Default during SSR

        if (isSystemMode) {
            return systemTheme === 'dark' ? 'moon' : 'sun';
        }

        return isDarkMode ? 'sun' : 'moon'; // Show opposite of current theme
    };

    const getThemeDisplayName = () => {
        if (!mounted) return 'System';

        switch (theme) {
            case 'light':
                return 'Light';
            case 'dark':
                return 'Dark';
            case 'system':
                return `System (${systemTheme === 'dark' ? 'Dark' : 'Light'})`;
            default:
                return 'System';
        }
    };

    const getNextTheme = (): Theme => {
        switch (theme) {
            case 'light':
                return 'dark';
            case 'dark':
                return 'system';
            case 'system':
                return 'light';
            default:
                return 'light';
        }
    };

    // Cycle through all themes (light -> dark -> system -> light)
    const cycleTheme = () => {
        setTheme(getNextTheme());
    };

    return {
        // Core theme state
        theme: currentTheme,
        setTheme: setTheme as (theme: Theme) => void,
        resolvedTheme: effectiveTheme,
        systemTheme,
        mounted,

        // Boolean states
        isDarkMode,
        isLightMode,
        isSystemMode,
        isUsingSystemDark,
        isUsingSystemLight,

        // Actions
        toggleTheme,
        cycleTheme,
        setLightTheme,
        setDarkTheme,
        setSystemTheme,

        // Utilities
        getThemeIcon,
        getThemeDisplayName,
        getNextTheme,
    };
};

export { useThemeToggle as useTheme };
