/*
 * Copyright 2021 Google LLC
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
import Fixture from '../fixture';
import defaultConfig from '../../defaultConfig';

describe('Integration Layer tests : EditorConfig Params :', () => {
  let fixture;

  const MINIMUM_CONFIG = {};

  beforeAll(() => {
    // fixture.setConfig() doesn't overwrite the whole object but merges therefore optional params need to be set undefined explicitly.
    for (const key of Object.keys(defaultConfig)) {
      MINIMUM_CONFIG[key] = undefined;
    }
    MINIMUM_CONFIG.apiCallbacks = {
      fetchStories: () => new Promise.resolve({}),
    };
  });

  afterEach(() => {
    fixture.restore();
  });

  const shouldRenderWithConfig = async (config) => {
    let error;
    try {
      fixture.setConfig(config);
      await fixture.render();
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  };

  it('should work with optional params being undefined', async () => {
    fixture = new Fixture();
    await shouldRenderWithConfig(MINIMUM_CONFIG);
  });
});
