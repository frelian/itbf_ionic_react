import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import {Provider} from "react-redux";
import {store} from './redux/store';
import './i18n';
import {ThemeProvider} from "./context/ThemeContext";

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <Provider store={store}>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </Provider>,
);