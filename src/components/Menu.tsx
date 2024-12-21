import {
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote,
} from '@ionic/react';

import {useLocation} from 'react-router-dom';
import { informationCircle, listOutline } from 'ionicons/icons';
import './Menu.css';
import {useTranslation} from "react-i18next";

interface AppPage {
    url: string;
    iosIcon: string;
    mdIcon: string;
    title: string;
}

const Menu: React.FC = () => {
    const location = useLocation();
    const {t} = useTranslation();

    const appPages: AppPage[] = [
        {
            title: t('hotel.listOfHotels'),
            url: '/hotels',
            iosIcon: listOutline,
            mdIcon: listOutline
        },
        {
            title: 'About',
            url: '/about',
            iosIcon: informationCircle,
            mdIcon: informationCircle
        },
    ];

    return (
        <IonMenu contentId="main" type="overlay">
            <IonContent>
                <IonList id="inbox-list">
                    <IonListHeader>{t('hotel.management')}</IonListHeader>
                    <IonNote>JulianNiño</IonNote>
                    {appPages.map((appPage, index) => {
                        return (
                            <IonMenuToggle key={index} autoHide={false}>
                                <IonItem className={location.pathname === appPage.url ? 'selected' : ''}
                                         routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                                    <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon}/>
                                    <IonLabel>{appPage.title}</IonLabel>
                                </IonItem>
                            </IonMenuToggle>
                        );
                    })}
                </IonList>
            </IonContent>
        </IonMenu>
    );
};

export default Menu;
