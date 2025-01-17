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
 * External dependencies
 */
const webpack = require('webpack');

module.exports = {
  stories: [
    './stories/**/*.js',
    '../packages/dashboard/src/**/stories/*.@(js|mdx)',
    '../packages/story-editor/src/**/stories/*.@(js|mdx)',
    '../packages/wp-dashboard/src/**/stories/*.@(js|mdx)',
    '../packages/wp-story-editor/src/**/stories/*.@(js|mdx)',
    '../packages/activation-notice/src/**/stories/*.@(js|mdx)',
    '../packages/design-system/src/**/stories/*.@(js|mdx)',
  ],
  addons: [
    '@storybook/addon-a11y/register',
    '@storybook/addon-essentials',
    '@storybook/addon-storysource/register',
  ],
  reactOptions: {
    fastRefresh: true,
    strictMode: true,
  },
  //eslint-disable-next-line require-await -- Negligible.
  webpackFinal: async (config) => {
    // Modifies storybook's webpack config to use svgr instead of file-loader.
    // see https://github.com/storybookjs/storybook/issues/5613

    const assetRule = config.module.rules.find(({ test }) => test.test('.svg'));
    const assetLoader = {
      loader: assetRule.loader,
      options: assetRule.options || assetRule.query,
    };

    // These should be sync'd with the config in `webpack.config.cjs`.

    config.resolve = {
      // Fixes resolving packages in the monorepo so we use the "src" folder, not "dist".
      // TODO: Revisit after upgrading to webpack v5 or when splitting repository.
      mainFields: ['browser', 'module', 'main', 'source'],
    };
    config.plugins.push(
      new webpack.DefinePlugin({
        WEB_STORIES_CI: JSON.stringify(process.env.CI),
        WEB_STORIES_ENV: JSON.stringify(process.env.NODE_ENV),
        WEB_STORIES_DISABLE_ERROR_BOUNDARIES: JSON.stringify(
          process.env.DISABLE_ERROR_BOUNDARIES
        ),
        WEB_STORIES_DISABLE_OPTIMIZED_RENDERING: JSON.stringify(
          process.env.DISABLE_OPTIMIZED_RENDERING
        ),
        WEB_STORIES_DISABLE_PREVENT: JSON.stringify(
          process.env.DISABLE_PREVENT
        ),
        WEB_STORIES_DISABLE_QUICK_TIPS: JSON.stringify(
          process.env.DISABLE_QUICK_TIPS
        ),
      })
    );

    config.module.rules.unshift(
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              titleProp: true,
              svgo: true,
              memo: true,
              svgoConfig: {
                plugins: [
                  {
                    removeViewBox: false,
                    removeDimensions: true,
                    convertColors: {
                      currentColor: /^(?!url|none)/i,
                    },
                  },
                ],
              },
            },
          },
          'url-loader',
          assetLoader,
        ],
        exclude: [/images\/.*\.svg$/],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              titleProp: true,
              svgo: true,
              memo: true,
              svgoConfig: {
                plugins: [
                  {
                    removeViewBox: false,
                    removeDimensions: true,
                    convertColors: {
                      // See https://github.com/googleforcreators/web-stories-wp/pull/6361
                      currentColor: false,
                    },
                  },
                ],
              },
            },
          },
          'url-loader',
        ],
        include: [/images\/.*\.svg$/],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
            },
          },
        ],
      }
    );

    // only the first matching rule is used when there is a match.
    config.module.rules = [{ oneOf: config.module.rules }];

    return config;
  },
};
