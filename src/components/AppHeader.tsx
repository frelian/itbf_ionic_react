import React from 'react';
import {
    IonButtons,
    IonToolbar,
    IonTitle,
    IonHeader,
    IonMenuButton,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonIcon,
    IonItemDivider
} from '@ionic/react';
import { moonOutline, sunnyOutline } from 'ionicons/icons';
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

interface AppHeaderProps {
    title: string;
    darkMode: boolean;
    setDarkMode: (checked: boolean) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, darkMode, setDarkMode }) => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (e: CustomEvent) => {
        i18n.changeLanguage(e.detail.value);
    };

    return (
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton />
                </IonButtons>
                <IonTitle>{title}</IonTitle>
                <IonButtons slot="end">
                    <IonSelect
                        value={i18n.language}
                        onIonChange={handleLanguageChange}
                        interface="popover"
                    >
                        <IonSelectOption value="es">ES</IonSelectOption>
                        <IonSelectOption value="en">EN</IonSelectOption>
                    </IonSelect>
                    <IonItemDivider />
                    <IonToggle
                        checked={darkMode}
                        onIonChange={(e) => setDarkMode(e.detail.checked)}
                        mode="ios"
                    >
                        <IonIcon
                            slot="start"
                            icon={darkMode ? moonOutline : sunnyOutline}
                        />
                    </IonToggle>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
    );
};

export default AppHeader;