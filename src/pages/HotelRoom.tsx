import React, {useState, useEffect} from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton, IonCard, IonCardHeader, IonCardTitle, useIonToast
} from '@ionic/react';
import {useParams, useHistory} from 'react-router-dom';
import {useHotelStore} from '../hooks/useHotelStore';
import {useTranslation} from 'react-i18next';
import {resetRoomMessages} from "../redux/hotelSlice";
import {useDispatch, useSelector} from "react-redux";
import {alertCircleOutline, checkmarkCircleOutline} from "ionicons/icons";

interface RoomData {
    id?: string;
    hotel_id: string;
    room_type: string;
    accommodation_type: string;
    quantity: number;
    hotel_name: string
}

const HotelRoom: React.FC = () => {
    const {hotelId, roomId} = useParams<{ hotelId: string, roomId: string }>();
    const history = useHistory();
    const {startSavingHotelRoom, startLoadingHotelRoomById} = useHotelStore();
    const {t} = useTranslation();
    const [loading, setLoading] = useState(true);

    const successRoomMessage = useSelector((state) => state.hotel.successRoomMessage);
    const errorRoomMessage = useSelector((state) => state.hotel.errorRoomMessage);
    const [successMessageToast] = useIonToast();
    const [errorMessageToast] = useIonToast();
    const dispatch = useDispatch();

    // Estado para el formulario de habitación
    const [roomData, setRoomData] = useState<RoomData>({
        hotel_name: "",
        id: "",
        hotel_id: hotelId,
        room_type: '',
        accommodation_type: '',
        quantity: 0
    });

    // Tipos de habitación y acomodación
    const roomTypes = [
        'Estandar',
        'Junior',
        'Suite'
    ];

    const accommodationTypes = [
        'Sencilla',
        'Doble',
        'Triple',
        'Cuadruple'
    ];

    // Cargar datos de la habitación si es edición
    useEffect(() => {
        const loadRoomData = async () => {
            try {
                setLoading(true);

                setRoomData({
                    hotel_name: "",
                    id: "",
                    hotel_id: hotelId,
                    room_type: '',
                    accommodation_type: '',
                    quantity: 0
                });
                if (roomId !== 'new') {
                    const roomDetails = await startLoadingHotelRoomById(roomId);

                    setRoomData({
                        ...roomDetails,
                        hotel_id: hotelId
                    });
                }
            } catch (error) {
                console.error('Error loading room:', error);
            } finally {
                setLoading(false);
            }
        };

        loadRoomData();
    }, [hotelId, roomId]);

    // Mensaje de confirmacion
    useEffect(() => {
        if (successRoomMessage) {
            presentSuccessMessageToast('bottom');

            // Resetear después de un tiempo
            const timer = setTimeout(() => {
                dispatch(resetRoomMessages());
            }, 2000);

            return () => clearTimeout(timer);
        }
        if (errorRoomMessage) {
            presentErrorMessageToast('bottom');

            // Resetear después de un tiempo
            const timer = setTimeout(() => {
                dispatch(resetRoomMessages());
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [successRoomMessage, errorRoomMessage, dispatch]);

    // Mostrar el mensaje de exito en Toast
    const presentSuccessMessageToast = (position: 'bottom') => {
        successMessageToast({
            message: successRoomMessage,
            duration: 1500,
            position: position,
            cssClass: "success-toast",
            icon: checkmarkCircleOutline,
        });
    };

    // Mostrar el mensaje de error en Toast
    const presentErrorMessageToast = (position: 'bottom') => {
        errorMessageToast({
            message: errorRoomMessage,
            duration: 5000,
            position: position,
            cssClass: "error-toast",
            icon: alertCircleOutline,
        });
    };

    // Manejar cambios en los inputs
    const handleInputChange = (e: CustomEvent, field: string) => {
        const value = e.detail.value;
        setRoomData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Guardar habitación
    const handleSaveRoom = async () => {
        try {
            const dataToSave = roomId === 'new'
                ? {
                    hotel_id: hotelId,
                    room_type: roomData.room_type,
                    accommodation_type: roomData.accommodation_type,
                    quantity: roomData.quantity
                }
                : {
                    ...roomData,
                    hotel_id: hotelId
                };

            if (roomId === 'new') {
                await startSavingHotelRoom(hotelId, null, dataToSave);

            } else {
                await startSavingHotelRoom(hotelId, roomId, dataToSave);
            }

            history.push(`/hotels/view/${hotelId}`);
        } catch (error) {
            console.error('Error saving room:', error);
        }
    };

    if (loading) {
        return <div>{t('loading')}...</div>;
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={`/hotels/${hotelId}`}/>
                    </IonButtons>
                    <IonTitle>
                        {roomId === 'new' ? 'Nueva Habitación' : 'Editar Habitación'}
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCard style={{marginTop: '30px'}}>
                    <IonCardHeader>
                        <IonCardTitle style={{fontWeight: 'bolder'}}>
                            {roomId === 'new' ? t('register') : `Habitación en ${roomData.hotel_name}`}
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonList style={{marginRight: '20px'}}>
                        <IonItem>
                            <IonLabel position="stacked">
                                {t('hotel.roomType')}
                            </IonLabel>
                            <IonSelect
                                value={roomData.room_type}
                                placeholder="Selecciona tipo de habitación"
                                onIonChange={(e) => handleInputChange(e, 'room_type')}
                            >
                                {roomTypes.map(type => (
                                    <IonSelectOption key={type} value={type}>
                                        {type}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>

                        <IonItem>
                            <IonLabel position="stacked">
                                {t('hotel.accomodationType')}
                            </IonLabel>
                            <IonSelect
                                value={roomData.accommodation_type}
                                placeholder="Selecciona tipo de acomodación"
                                onIonChange={(e) => handleInputChange(e, 'accommodation_type')}
                            >
                                {accommodationTypes.map(type => (
                                    <IonSelectOption key={type} value={type}>
                                        {type}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>

                        <IonItem>
                            <IonLabel position="stacked"> {t('hotel.totalRooms')}</IonLabel>
                            <IonInput
                                type="number"
                                value={roomData.quantity}
                                onIonChange={(e) => handleInputChange(e, 'quantity')}
                                min={0}
                            />
                        </IonItem>
                    </IonList>

                    <div className="ion-padding-top"
                         style={{marginBottom: '10px', marginLeft: '10px', marginRight: '10px'}}>
                        <IonButton
                            color="secondary"
                            expand="block"
                            onClick={handleSaveRoom}
                            disabled={
                                !roomData.room_type ||
                                !roomData.accommodation_type ||
                                roomData.quantity <= 0
                            }
                        >
                            {t('hotel.saveRoom')}
                        </IonButton>
                    </div>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default HotelRoom;