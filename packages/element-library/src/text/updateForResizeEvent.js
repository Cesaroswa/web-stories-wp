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
import { dataPixels } from '@googleforcreators/units';

/**
 * Internal dependencies.
 */
import { calculateFitTextFontSize, calculateTextHeight } from '../utils/textMeasurements';

function updateForResizeEvent(
  element,
  direction,
  newWidth,
  newHeight,
  lockAspectRatio
) {
  const isResizingWidth = direction[0] !== 0;
  const isResizingHeight = direction[1] !== 0;

  // Diagonal or resizing w/keep ratio.
  if (isResizingHeight || lockAspectRatio) {
    const { fontSize, marginOffset } = calculateFitTextFontSize(
      element,
      newWidth || element.width,
      newHeight
    );

    return {
      fontSize: dataPixels(fontSize),
      marginOffset,
    };
  }

  // Width-only resize: recalc height.
  if (isResizingWidth) {
    return { height: dataPixels(calculateTextHeight(element, newWidth)) };
  }

  return null;
}

export default updateForResizeEvent;
