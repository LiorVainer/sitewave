import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
    const readValue = (): T => {
        if (globalThis.window === undefined) return initialValue;
        try {
            const item = localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    };

    const [storedValue, setStoredValue] = useState<T>(readValue);

    const setValue = (value: T | ((prev: T) => T)) => {
        try {
            // @ts-expect-error this is a workaround for the type error on the value parameter that is not recognized as a function
            const valueToStore = typeof value === 'function' ? value(readValue()) : value;
            setStoredValue(valueToStore);
            if (globalThis.window !== undefined) {
                localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key “${key}”:`, error);
        }
    };

    useEffect(() => {
        setStoredValue(readValue());
    }, [key]);

    return [storedValue, setValue];
}
