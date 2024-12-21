import {IonContent, IonPage} from '@ionic/react';
import {useTranslation} from "react-i18next";
import AppHeader from "../components/AppHeader";
import {useTheme} from "../context/ThemeContext";

const About: React.FC = () => {
    const {darkMode, toggleDarkMode} = useTheme();
    const {t} = useTranslation();

    return (
        <IonPage>
            <AppHeader
                title={"About"}
                darkMode={darkMode}
                setDarkMode={toggleDarkMode}
            />
            <IonContent fullscreen>
                <div style={{padding: '20px'}}>
                    <h1>{t("By")}</h1>
                    <h3>Julian Niño</h3>
                    <h4>Ionic + React + Postgres</h4>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default About;