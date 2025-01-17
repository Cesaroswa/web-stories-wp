/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
// The __webpack_public_path__ assignment will be done after the imports.
// That's why the public path assignment is in its own dedicated module and imported here at the very top.
// See https://webpack.js.org/guides/public-path/#on-the-fly
import './publicPath';
import './style.css'; // This way the general dashboard styles are loaded before all the component styles.

// We need to load translations before any other imports happen.
// That's why this is in its own dedicated module imported here at the very top.
import './setLocaleData';

/**
 * External dependencies
 */
import { Dashboard } from '@googleforcreators/dashboard';
import { domReady, setAppElement } from '@googleforcreators/design-system';
import { StrictMode, render } from '@googleforcreators/react';
import { updateSettings } from '@googleforcreators/date';
import { initializeTracking } from '@googleforcreators/tracking';

/**
 * Internal dependencies
 */
import getApiCallbacks from './api/utils/getApiCallbacks';
import { GlobalStyle } from './theme';
import { LEFT_RAIL_SECONDARY_NAVIGATION, TOOLBAR_HEIGHT } from './constants';
import { Layout } from './components';

window.webStories = window.webStories || {};
window.webStories.domReady = domReady;

/**
 * Initializes the Web Stories dashboard screen.
 *
 * @param {string} id       ID of the root element to render the screen in.
 * @param {Object} config   Story editor settings.
 */
window.webStories.initializeStoryDashboard = (id, config) => {
  const appElement = document.getElementById(id);

  // see http://reactcommunity.org/react-modal/accessibility/
  setAppElement(appElement);

  updateSettings(config.locale);

  // Already tracking screen views in AppContent, no need to send page views as well.
  initializeTracking('Dashboard', false);

  const dashboardConfig = {
    ...config,
    apiCallbacks: getApiCallbacks(config),
    leftRailSecondaryNavigation: LEFT_RAIL_SECONDARY_NAVIGATION,
    styleConstants: {
      topOffset: TOOLBAR_HEIGHT,
    },
  };

  render(
    <StrictMode>
      <Dashboard config={dashboardConfig}>
        <GlobalStyle />
        <Layout />
      </Dashboard>
    </StrictMode>,
    appElement
  );
};
