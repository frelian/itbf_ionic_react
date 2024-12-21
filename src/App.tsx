import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Hotel from './pages/Hotel';
import About from "./pages/About";
import HotelView from "./pages/HotelView";
import HotelCreateOrUpdate from "./pages/HotelCreateOrUpdate";
import HotelRoom from "./pages/HotelRoom";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  return (
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <Route path="/" exact={true}>
                <Redirect to="/hotels" />
              </Route>
              <Route path="/hotels/:name" exact={true}>
                <Hotel />
              </Route>
              <Route path="/hotels/view/:id" exact={true}>
                <HotelView />
              </Route>
              <Route path="/hotels/new" exact={true}>
                <HotelCreateOrUpdate />
              </Route>
              <Route path="/hotels/edit/:id" exact={true}>
                <HotelCreateOrUpdate />
              </Route>
              <Route path="/hotels" exact={true}>
                <Hotel />
              </Route>

              <Route path="/hotels/:hotelId/room/new" exact={true}>
                <HotelRoom />
              </Route>
              <Route path="/hotels/:hotelId/room/edit/:roomId" exact={true}>
                <HotelRoom />
              </Route>

              <Route path="/about" exact={true}>
                <About />
              </Route>
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
  );
};

export default App;
