import { translations } from "../translations";

export const useTranslation = () => {
    const t = (key: string) => {
        const keys = key.split('.');
        let value: any = translations.en;

        for (const k of keys) {
            value = value?.[k];
            if (value === undefined) {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        return value;
    };

    return { t };
}; 