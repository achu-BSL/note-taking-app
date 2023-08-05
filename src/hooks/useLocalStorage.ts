import { useEffect, useState } from "react";

export function useLocalStorage<T> (key: string, initailValue: T | (() => T)) {
    const [value, setValue] = useState<T>(()=> {
        const jsonValue = localStorage.getItem(key);
        if(jsonValue !== null) return JSON.parse(jsonValue); 

        if(typeof initailValue === 'function') {
            return (initailValue as () => T)();
        } else {
            return initailValue;
        }
    })

    useEffect(()=> {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value])

    return [value, setValue] as [T, typeof setValue];
}