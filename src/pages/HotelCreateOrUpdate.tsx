import React, { useEffect, useState } from 'react';
import {
    IonPage,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonInput,
    IonButton,
    IonSpinner,
    IonList, IonRow, IonCol, IonIcon,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useHotelStore } from '../hooks/useHotelStore';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom';
import {closeOutline, saveOutline} from "ionicons/icons";
import AppHeader from '../components/AppHeader';

const HotelCreateOrUpdate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const { darkMode, toggleDarkMode } = useTheme();
    const { startLoadingHotelById, startSaving } = useHotelStore();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        hotel_name: '',
        hotel_city: '',
        hotel_address: '',
        hotel_nit: '',
        hotel_max_rooms: ''
    });

    const isEditMode = !!id;

    useEffect(() => {
        const loadHotel = async () => {
            if (!isEditMode) return;

            try {
                setLoading(true);
                const hotelData = await startLoadingHotelById(id);

                setFormData({
                    hotel_name: hotelData.hotel_name,
                    hotel_city: hotelData.hotel_city,
                    hotel_address: hotelData.hotel_address,
                    hotel_nit: hotelData.hotel_nit,
                    hotel_max_rooms: hotelData.hotel_max_rooms
                });
            } catch (error) {
                console.error('Error loading hotel:', error);
            } finally {
                setLoading(false);
            }
        };

        loadHotel();
    }, [id, isEditMode]);

    const handleInputChange = (e: CustomEvent) => {
        const input = e.detail.value || '';
        const name = e.target.name;

        let processedValue = input;

        switch (name) {
            case 'hotel_name':
            case 'hotel_city':

                // Solo letras y espacios
                processedValue = input.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                break;

            case 'hotel_address':

                // Permitir letras, números, espacios y algunos caracteres especiales
                processedValue = input.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s#-]/g, '');
                break;

            case 'hotel_nit':

                // Solo números, sin espacios
                processedValue = input.replace(/\D/g, '');
                break;

            case 'hotel_max_rooms':

                // Solo números, sin espacios
                processedValue = input.replace(/\D/g, '');
                break;
        }

        // Actualizo el estado
        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await startSaving(id, formData);
            history.push(isEditMode ? `/hotels/${id}` : '/hotels');
        } catch (error) {
            console.error('Error saving hotel:', error);
        }
    };

    if (loading) {
        return (
            <IonPage>
                <IonContent className="ion-padding ion-text-center">
                    <IonSpinner name="crescent" />
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            <AppHeader
                title=""
                darkMode={darkMode}
                setDarkMode={toggleDarkMode}
            />
            <IonContent>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle style={{ fontWeight: 'bolder' }}>
                            {isEditMode ? `${t('hotel.edit')} No ${id}` : t('register')}
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <form onSubmit={handleSubmit}>
                            <IonList>
                                <IonItem>
                                    <IonInput
                                        name="hotel_name"
                                        label="Hotel"
                                        labelPlacement="stacked"
                                        placeholder={t('hotel.placeholder.name')}
                                        value={formData.hotel_name}
                                        onIonInput={handleInputChange}
                                        required
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonInput
                                        name="hotel_city"
                                        label={t('hotel.city')}
                                        labelPlacement="stacked"
                                        placeholder={t('hotel.placeholder.city')}
                                        value={formData.hotel_city}
                                        onIonInput={handleInputChange}
                                        required
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonInput
                                        name="hotel_address"
                                        label={t('hotel.address')}
                                        labelPlacement="stacked"
                                        placeholder={t('hotel.placeholder.address')}
                                        value={formData.hotel_address}
                                        onIonInput={handleInputChange}
                                        required
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonInput
                                        name="hotel_nit"
                                        label="NIT"
                                        labelPlacement="stacked"
                                        placeholder={t('hotel.placeholder.nit')}
                                        value={formData.hotel_nit}
                                        onIonInput={handleInputChange}
                                        required
                                    />
                                </IonItem>

                                <IonItem>
                                    <IonInput
                                        name="hotel_max_rooms"
                                        label={t('hotel.rooms')}
                                        labelPlacement="stacked"
                                        placeholder={t('hotel.placeholder.maxRooms')}
                                        value={formData.hotel_max_rooms}
                                        onIonInput={handleInputChange}
                                        required
                                    />
                                </IonItem>
                            </IonList>

                            <IonRow style={{ marginTop: "10px", marginBottom: "10px" }}>
                                <IonCol size="6">
                                    <IonButton expand="full" color="secondary" type="submit">
                                        <IonIcon slot="start" icon={saveOutline}></IonIcon>
                                        {isEditMode ? t('save') : t('create')}
                                    </IonButton>
                                </IonCol>
                                <IonCol size="6">
                                    <IonButton expand="full" color="light" onClick={() => history.goBack()}>
                                        <IonIcon slot="start" icon={closeOutline}></IonIcon>
                                        {t('cancel')}
                                    </IonButton>
                                </IonCol>
                            </IonRow>

                        </form>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default HotelCreateOrUpdate;