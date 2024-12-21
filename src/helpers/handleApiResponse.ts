import { t } from "i18next";

export const handleApiResponse = (response: any, actionType: string) => {
    if (response?.status >= 200 && response?.status < 300) {
        switch (actionType) {
            case 'create':
                return t('messages.createSuccess');
            case 'update':
                return t('messages.updateSuccess');
            case 'delete':
                return t('messages.deleteSuccess');
            default:
                return t('messages.success');
        }
    } else {

        // Manejo de errores
        let errorMessage = t('messages.unexpectedError');

        if (response?.response) {
            const { status, data } = response.response;

            // Verificar si es un error 422 y hay errores detallados
            if (status === 422 && data?.message) {
                errorMessage = data.message;
            } else if (status === 400 && data?.detail) {
                errorMessage = data.detail;
            } else {
                // Maneja otros códigos de error
                switch (status) {
                    case 400:
                        errorMessage = t('messages.badRequest');
                        break;
                    case 401:
                        errorMessage = t('messages.unauthorized');
                        break;
                    case 403:
                        errorMessage = t('messages.forbidden');
                        break;
                    case 404:
                        errorMessage = t('messages.notFound');
                        break;
                    case 429:
                        errorMessage = t('messages.manyRequest');
                        break;
                    case 500:
                        errorMessage = t('messages.serverError');
                        break;
                    default:
                        errorMessage = t('messages.unexpectedServerError');
                }
            }
        } else if (response?.request) {
            if (response.code === 'ERR_NETWORK') {
                errorMessage = t('messages.networkError');
            } else {
                errorMessage = t('messages.noResponse');
            }
        } else {
            errorMessage = t('messages.requestError');
        }

        return errorMessage;
    }
};