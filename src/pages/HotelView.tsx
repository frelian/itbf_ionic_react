import React, {useEffect, useState} from 'react';
import {
    IonPage,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonLabel,
    IonBadge,
    IonSpinner, IonList,
    IonItem,
    IonButton, IonAvatar, useIonToast, IonAlert
} from '@ionic/react';
import {
    locationOutline, businessOutline, idCardOutline,
    bedOutline, pencilOutline, closeOutline,
    createOutline, trashOutline, add,
    readerOutline, checkmarkCircleOutline, alertCircleOutline, arrowBackCircleOutline
} from 'ionicons/icons';
import {useHistory, useParams} from 'react-router-dom';
import {useHotelStore} from '../hooks/useHotelStore';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import AppHeader from '../components/AppHeader';
import {useTheme} from '../context/ThemeContext';

const HotelView: React.FC = () => {

    const {id} = useParams<{ id: string }>();
    const {darkMode, toggleDarkMode} = useTheme();
    const {startLoadingHotelById, startDeleteHotelRoom} = useHotelStore();
    const [hotel, setHotel] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [RoomToDelete, setRoomToDelete] = useState(null);
    const {t} = useTranslation();
    const history = useHistory();
    const successRoomMessage = useSelector((state) => state.hotel.successRoomMessage);
    const errorRoomMessage = useSelector((state) => state.hotel.errorRoomMessage);
    const { successRoomMessageTimestamp } = useSelector(state => state.hotel);
    const [successMessageToast] = useIonToast();
    const [errorMessageToast] = useIonToast();

    useEffect(() => {
        if (successRoomMessage) {
            presentSuccessMessageToast('bottom');
        }
        if (errorRoomMessage) {
            presentErrorMessageToast('bottom');
        }
    }, [successRoomMessage, errorRoomMessage, hotel]);

    useEffect(() => {
        const fetchHotelDetails = async () => {
            try {
                setLoading(true);
                const hotelData = await startLoadingHotelById(id);
                setHotel(hotelData);
            } catch (error) {
                console.error('Error fetching hotel details', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotelDetails();
    }, [id, successRoomMessageTimestamp]);

    const formatNIT = (nit: string) => {
        return nit.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleEditHotel = () => {
        history.push(`/hotels/edit/${id}`);
    };

    const handleAddRoom = (hotelId: string) => {
        history.push(`/hotels/${hotelId}/room/edit/new`);
    };

    const handleEditRoom = (hotelId: string, roomId: string) => {
        history.push(`/hotels/${hotelId}/room/edit/${roomId}`);
    };

    // Mostrar el mensaje de exito en Toast
    const presentSuccessMessageToast = (position: 'bottom') => {
        successMessageToast({
            message: successRoomMessage,
            duration: 3000,
            position: position,
            cssClass: "success-toast",
            icon: checkmarkCircleOutline,
        });

    };

    // Mostrar el mensaje de error en Toast
    const presentErrorMessageToast = (position: 'bottom') => {
        errorMessageToast({
            message: errorRoomMessage,
            duration: 3000,
            position: position,
            cssClass: "error-toast",
            icon: alertCircleOutline,
        });
    };

    const handleDelete = async () => {
        if (RoomToDelete) {
            try {
                await startDeleteHotelRoom(RoomToDelete);
            } catch (error) {
                console.error('Error al eliminar la habitación', error);
            } finally {
                setShowDeleteModal(false);
                setRoomToDelete(null);
            }
        }
    };

    const handleDeleteClick = (id) => {
        setRoomToDelete(id);
        setShowDeleteModal(true);
    };

    if (loading) {
        return (
            <IonPage>
                <IonContent className="ion-padding ion-text-center">
                    <IonSpinner name="crescent"/>
                </IonContent>
            </IonPage>
        );
    }

    if (!hotel) {
        return (
            <IonPage>
                <IonContent className="ion-padding ion-text-center">
                    <h1 style={{ marginTop: '70px' }}>{t('messages.notFound')}</h1>

                    <IonButton
                        expand="full"
                        color="light"
                        onClick={() => history.push(`/hotels`)}
                        style={{ marginTop: '20px' }}
                    >
                        <IonIcon slot="start" icon={arrowBackCircleOutline}></IonIcon>
                        {t('back')}
                    </IonButton>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage>
            {/* Diálogo de confirmación de eliminación */}
            <IonAlert
                isOpen={showDeleteModal}
                onDidDismiss={() => setShowDeleteModal(false)}
                header={t('hotel.deleteConfirmTitle')}
                message={t('hotel.deleteConfirmMessage')}
                buttons={[
                    {
                        text: t('cancel'),
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => {
                            setShowDeleteModal(false);
                            setRoomToDelete(null);
                        }
                    },
                    {
                        text: t('confirm'),
                        handler: () => {
                            handleDelete();
                        }
                    }
                ]}
            />
            <AppHeader title="" darkMode={darkMode} setDarkMode={toggleDarkMode}/>
            <IonContent fullscreen>
                <IonCard style={{marginTop: "40px", marginLeft: "20px", marginRight: "20px"}}>
                    <IonCardHeader>
                        <IonCardTitle style={{fontWeight: "bolder"}}>{t('info')}</IonCardTitle>
                        {hotel.hotel_name}
                    </IonCardHeader>
                    <IonCardContent>
                        <IonGrid>
                            <IonList>
                                <IonItem>
                                    <IonLabel><IonIcon icon={readerOutline}/>
                                        <strong>Hotel:</strong> {hotel.hotel_name}
                                    </IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel><IonIcon icon={locationOutline}/>
                                        <strong>{t('hotel.city')}:</strong> {hotel.hotel_city}</IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel><IonIcon icon={businessOutline}/>
                                        <strong>{t('hotel.address')}:</strong> {hotel.hotel_address}</IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel><IonIcon icon={idCardOutline}/>
                                        <strong>NIT:</strong> {formatNIT(hotel.hotel_nit)}</IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel><IonIcon icon={bedOutline}/>
                                        <strong>{t('hotel.maxRooms')}:</strong> {hotel.hotel_max_rooms} {t('hotel.rooms')}
                                    </IonLabel>
                                </IonItem>
                            </IonList>
                            <IonRow style={{marginTop: "10px", marginBottom: "10px"}}>
                                <IonCol size="6">
                                    <IonButton expand="full" color="secondary" onClick={handleEditHotel}>
                                        <IonIcon slot="start" icon={pencilOutline}></IonIcon>
                                        {t('edit')}
                                    </IonButton>
                                </IonCol>
                                <IonCol size="6">
                                    <IonButton expand="full" color="light" onClick={() => history.push(`/hotels`)}>
                                        <IonIcon slot="start" icon={closeOutline}></IonIcon>
                                        {t('cancel')}
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>

                <IonCard style={{marginTop: "20px", marginLeft: "20px", marginRight: "20px"}}>
                    <IonCardHeader>
                        <IonCardTitle style={{fontWeight: "bolder"}}>
                            {t('hotel.infoRooms')}
                            <IonButton
                                fill="clear"
                                size='small'
                                style={{
                                    width: 'auto',
                                    marginRight: '0'
                                }}
                                onClick={() => handleAddRoom(hotel.id)}
                            >
                                {t('add')}
                                <IonIcon slot="icon-only" icon={add}/>
                            </IonButton>

                        </IonCardTitle>

                    </IonCardHeader>
                    <IonCardContent>
                        <IonList>
                            {hotel.rooms && hotel.rooms.length > 0 ? (
                                hotel.rooms.map((room) => (
                                    <IonItem key={`${room.id}--${room.quantity}`}>
                                        <IonAvatar slot="start">
                                            <IonIcon icon={bedOutline}/>
                                        </IonAvatar>
                                        <IonLabel>
                                            <p>
                                                <strong>{t('hotel.room')}:</strong> {room.room_type}
                                            </p>
                                            <p>
                                                <strong>{t('hotel.accomodation')}:</strong> {room.accommodation_type}
                                            </p>
                                            <p>
                                                <strong>{t('hotel.quantity')}:</strong>
                                                <IonBadge color="primary" style={{marginLeft: '8px'}}>
                                                    {room.quantity}
                                                </IonBadge>
                                            </p>
                                        </IonLabel>
                                        <IonButton
                                            color="primary"
                                            fill="outline"
                                            size="small"
                                            onClick={() => handleEditRoom(hotel.id, room.room_id)}
                                        >
                                            <IonIcon icon={createOutline}/>
                                        </IonButton>
                                        <IonButton
                                            color="danger"
                                            fill="outline"
                                            size="small"
                                            onClick={() => handleDeleteClick(room.room_id)}
                                        >
                                            <IonIcon icon={trashOutline}/>
                                        </IonButton>
                                    </IonItem>
                                ))

                            ) : (
                                <IonRow>
                                    <IonCol>
                                        <h2>{t('messages.noRooms')}</h2>
                                    </IonCol>
                                </IonRow>
                            )}
                        </IonList>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default HotelView;