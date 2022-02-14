<?php
/**
 * Class Rewrite_Flush
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
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

namespace Google\Web_Stories\Migrations;

use const WPCOM_IS_VIP_ENV;

/**
 * Class Rewrite_Flush
 */
class Rewrite_Flush extends Migrate_Base {

	/**
	 * Flush rewrite rules.
	 *
	 * @since 1.7.0
	 *
	 * @return void
	 */
	public function migrate(): void {
		if ( ! \defined( '\WPCOM_IS_VIP_ENV' ) || false === WPCOM_IS_VIP_ENV ) {
			flush_rewrite_rules( false );
		}
	}
}
