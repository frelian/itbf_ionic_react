import {
    IonContent, IonPage, IonButton, IonAlert,
    IonIcon, IonItem, IonList, IonLabel, IonChip,
    IonBadge, useIonToast, IonFab, IonFabButton, IonSpinner,
} from '@ionic/react';
import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from 'react-router-dom';
import {
    addOutline,
    alertCircleOutline,
    bedOutline,
    businessOutline, checkmarkCircleOutline,
    createOutline,
    eyeOutline,
    idCardOutline,
    locationOutline,
    trashOutline
} from "ionicons/icons";
import {useMediaQuery} from 'react-responsive';
import {useHotelStore} from "../hooks/useHotelStore";
import AppHeader from '../components/AppHeader';
import {useTheme} from "../context/ThemeContext";
import {onErrorMessage, onSuccessMessage} from "../redux/hotelSlice";
import './Hotel.css';

const Hotel: React.FC = () => {

    const {t} = useTranslation();
    const history = useHistory();
    const {darkMode, toggleDarkMode} = useTheme();
    const {startLoadingHotels, startDeleteHotel} = useHotelStore();
    const [successMessageToast] = useIonToast();
    const [errorMessageToast] = useIonToast();

    const hotels = useSelector((state) => state.hotel.hotels);
    const totalData = useSelector((state) => state.hotel.totalHotels);
    const successMessage = useSelector((state) => state.hotel.successMessage);
    const errorMessage = useSelector((state) => state.hotel.errorMessage);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [hotelToDelete, setHotelToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hotelsPerPage] = useState(7);
    const totalPages = Math.ceil(totalData / hotelsPerPage);

    const isMobile = useMediaQuery({maxWidth: 768});

    // Carga de hoteles
    useEffect(() => {
        const loadHotels = async () => {
            const url = `/hotel?per_page=${hotelsPerPage}&page=${currentPage}`;
            setLoading(true);
            try {
                await startLoadingHotels(url);
            } catch (error) {
                console.error("Failed to load hotels", error);
            } finally {
                setLoading(false);
            }
        };

        loadHotels();
    }, [currentPage]);

    // Mensaje de confirmacion
    useEffect(() => {
        if (successMessage) {
            presentSuccessMessageToast('bottom');
        }
        if (errorMessage) {
            presentErrorMessageToast('bottom');
        }
    }, [successMessage, errorMessage]);


    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleView = (id) => {
        history.push(`/hotels/view/${id}`);
    };

    const handleEdit = (id) => {
        history.push(`/hotels/edit/${id}`);
    };

    const handleDelete = async () => {
        if (hotelToDelete) {
            try {
                await startDeleteHotel(hotelToDelete);
                setCurrentPage(1); // Volver a la primera página
            } catch (error) {
                console.error('Error al eliminar hotel', error);
            } finally {
                setShowDeleteModal(false);
                setHotelToDelete(null);
            }
        }
    };

    const handleDeleteClick = (id) => {
        setHotelToDelete(id);
        setShowDeleteModal(true);
    };

    // Mostrar el mensaje de exito en Toast
    const presentSuccessMessageToast = (position: 'bottom') => {
        successMessageToast({
            message: successMessage,
            duration: 1500,
            position: position,
            cssClass: "success-toast",
            icon: checkmarkCircleOutline,
        });
    };

    // Mostrar el mensaje de error en Toast
    const presentErrorMessageToast = (position: 'bottom') => {
        errorMessageToast({
            message: errorMessage,
            duration: 1500,
            position: position,
            cssClass: "error-toast",
            icon: alertCircleOutline,
        });
    };

    const getRoomChipStyle = () => ({
        color: darkMode ? 'white' : 'black',
    });

    return (
        <IonPage>

            {
                loading && (
                    <IonContent className="ion-padding ion-text-center">
                        <IonSpinner name="crescent"/>
                    </IonContent>
                )
            }

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
                            setHotelToDelete(null);
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

            <AppHeader title={t('hotels')} darkMode={darkMode} setDarkMode={toggleDarkMode}/>
            <IonContent fullscreen>
                <IonFab horizontal="end" vertical="bottom" slot="fixed">
                    <IonFabButton onClick={() => history.push('/hotels/new')}>
                        <IonIcon icon={addOutline}/>
                    </IonFabButton>
                </IonFab>
                <div style={{padding: '20px'}}>
                    <IonList>
                        {hotels.map(hotel => (
                            <IonItem key={hotel.id}>
                                <IonLabel>
                                    <h1 style={{
                                        fontWeight: 'bolder',
                                        marginBottom: '10px',
                                        marginTop: '8px'
                                    }}>{hotel.hotel_name}</h1>
                                    <p style={{fontSize: '16px', marginBottom: '3px'}}>
                                        <IonIcon icon={locationOutline}/>
                                        <strong>{t('hotel.city')}</strong>: {hotel.hotel_city}
                                    </p>
                                    <p style={{fontSize: '16px', marginBottom: '3px'}}>
                                        <IonIcon icon={businessOutline}/>
                                        <strong>{t('hotel.address')}</strong>: {hotel.hotel_address}
                                    </p>
                                    <p style={{fontSize: '16px', marginBottom: '3px'}}>
                                        <IonIcon icon={idCardOutline}/> <strong>NIT</strong>: {hotel.hotel_nit}
                                    </p>
                                    <p style={{fontSize: '16px', marginBottom: '3px'}}>
                                        <IonIcon icon={bedOutline}/>
                                        <strong>{t('hotel.ability')}</strong>: {hotel.hotel_max_rooms} {t('hotel.rooms')}
                                    </p>

                                    {/* Información de habitaciones si existen */}
                                    {hotel.rooms && hotel.rooms.length > 0 && (
                                        <div className="ion-padding-top" style={{marginBottom: '10px'}}>
                                            <p style={{
                                                fontSize: '14px',
                                                fontWeight: 'bolder'
                                            }}>{t('hotel.typeAndTotalRooms')}:</p>
                                            {hotel.rooms.map((room) => (
                                                <IonChip
                                                    key={`${room.room_type}-${room.accommodation_type}-${room.quantity}`}
                                                    outline
                                                    style={getRoomChipStyle()}
                                                >
                                                    <IonLabel>
                                                        {room.room_type} - {room.accommodation_type}
                                                        <IonBadge color="primary" style={{marginLeft: '8px'}}>
                                                            {room.quantity}
                                                        </IonBadge>
                                                    </IonLabel>
                                                </IonChip>
                                            ))}
                                        </div>
                                    )}
                                </IonLabel>

                                {/* Botones de acción */}
                                <div
                                    slot="end"
                                    style={{
                                        display: 'flex',
                                        flexDirection: isMobile ? 'column' : 'row',
                                        gap: isMobile ? '8px' : '0',
                                        alignItems: 'center'
                                    }}
                                >
                                    <IonButton
                                        fill="clear"
                                        size={isMobile ? 'small' : 'large'}
                                        onClick={() => handleView(hotel.id)}
                                        style={{
                                            width: isMobile ? '100%' : 'auto',
                                            marginRight: isMobile ? '0' : '8px'
                                        }}
                                    >
                                        <IonIcon slot="icon-only" icon={eyeOutline}/>
                                    </IonButton>
                                    <IonButton
                                        fill="clear"
                                        size={isMobile ? 'small' : 'large'}
                                        onClick={() => handleEdit(hotel.id)}
                                        style={{
                                            width: isMobile ? '100%' : 'auto',
                                            marginRight: isMobile ? '0' : '8px'
                                        }}
                                    >
                                        <IonIcon slot="icon-only" icon={createOutline}/>
                                    </IonButton>

                                    <IonButton
                                        fill="clear"
                                        size={isMobile ? 'small' : 'large'}
                                        color="danger"
                                        onClick={() => handleDeleteClick(hotel.id)}
                                        style={{
                                            width: isMobile ? '100%' : 'auto'
                                        }}
                                    >
                                        <IonIcon slot="icon-only" icon={trashOutline}/>
                                    </IonButton>
                                </div>

                            </IonItem>
                        ))}
                    </IonList>

                    {/* Paginación */}
                    <div className="ion-padding ion-text-center">
                        <IonButton
                            fill="clear"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            {t('pagination.previous')}
                        </IonButton>
                        <IonChip>
                            {t('pagination.page')} {currentPage} {t('pagination.of')} {totalPages}
                        </IonChip>
                        <IonButton
                            fill="clear"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            {t('pagination.next')}
                        </IonButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Hotel;