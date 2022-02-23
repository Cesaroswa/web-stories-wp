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
import {
  THEME_CONSTANTS,
  Text,
  BUTTON_TYPES,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  Icons,
  Button,
  PLACEMENT,
  Popup,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import styled from 'styled-components';
import { useCallback, useRef, useState } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useStory, useConfig } from '../../../../../app';
import { PRESET_TYPES } from '../../../../../constants';
import useAddPreset from '../../../../../utils/useAddPreset';
import { DEFAULT_PRESET } from '../textPresets';
import { focusStyle } from '../../../../panels/shared';
import StyleGroup from '../../../../styleManager/styleGroup';
import StyleManager from '../../../../styleManager';
import useLibrary from '../../../useLibrary';
import { areAllType } from '../../../../../utils/presetUtils';
import useApplyStyle from '../../../../styleManager/useApplyStyle';
import updateProperties from '../../../../inspector/design/updateProperties';
import getUpdatedSizeAndPosition from '../../../../../utils/getUpdatedSizeAndPosition';
import InsertionOverlay from '../../shared/insertionOverlay';

const PresetsHeader = styled.div`
  display: flex;
  padding: 8px 0;
  justify-content: space-between;
`;

const StylesWrapper = styled.div``;

const SubHeading = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
  margin: 6px 0;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const StyledButton = styled(Button)`
  margin-left: auto;
`;

const StyledMoreButton = styled(Button)`
  ${focusStyle};
  margin: 12px 0;
  padding: 0 16px;
  justify-content: center;
  align-self: center;
  width: 100%;
  svg {
    transform: rotate(-90deg);
    height: 32px;
    width: 32px;
    margin-left: -4px;
  }
`;

const NoStylesWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% + 32px);
  margin: 0 0 -8px -16px;
  background-color: ${({ theme }) => theme.colors.opacity.black24};
  height: 64px;
`;

const NoStylesText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.tertiary};
`;

const SPACING = { x: 40 };
const TYPE = 'text';

function PresetPanel() {
  const { textStyles, isText, selectedTexts, updateElementsById } = useStory(
    ({ state, actions }) => {
      const isText =
        state.selectedElements && areAllType(TYPE, state.selectedElements);
      return {
        isText,
        textStyles: state.story.globalStoryStyles.textStyles,
        selectedTexts: isText ? state.selectedElements : [],
        updateElementsById: actions.updateElementsById,
      };
    }
  );

  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const buttonRef = useRef(null);
  const stylesRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { isRTL, styleConstants: { topOffset } = {} } = useConfig();
  const hasPresets = textStyles.length > 0;

  const pushUpdate = useCallback(
    (update) => {
      updateElementsById({
        elementIds: selectedTexts.map(({ id }) => id),
        properties: (element) => {
          const updates = updateProperties(element, update, true);
          const sizeUpdates = getUpdatedSizeAndPosition({
            ...element,
            ...updates,
          });
          return {
            ...updates,
            ...sizeUpdates,
          };
        },
      });
    },
    [selectedTexts, updateElementsById]
  );

  const handleApplyStyle = useApplyStyle({ pushUpdate });
  const { addGlobalPreset } = useAddPreset({ presetType: PRESET_TYPES.STYLE });

  const addStyledText = (preset) => {
    insertElement(TYPE, {
      ...DEFAULT_PRESET,
      ...preset,
    });
  };

  const handlePresetClick = (preset) => {
    if (isText) {
      handleApplyStyle(preset);
    } else {
      addStyledText(preset);
    }
  };

  // If it's not text, we're displaying insertion overlay and label for adding a new text.
  const styleItemProps = isText
    ? {}
    : {
        activeItemOverlay: <InsertionOverlay />,
        applyLabel: __('Add new text', 'web-stories'),
      };

  return (
    <>
      <PresetsHeader>
        <SubHeading size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {__('Saved Styles', 'web-stories')}
        </SubHeading>
        <StyledButton
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.SMALL}
          variant={BUTTON_VARIANTS.SQUARE}
          onClick={addGlobalPreset}
          aria-label={__('Add style', 'web-stories')}
          disabled={!isText}
        >
          <Icons.Plus />
        </StyledButton>
      </PresetsHeader>
      {hasPresets && (
        <>
          <StylesWrapper ref={stylesRef}>
            {/* We only show the insertion overlay if we're inserting -> this means selected elements are not texts */}
            <StyleGroup
              styles={[...textStyles].reverse().slice(0, 2)}
              handleClick={handlePresetClick}
              {...styleItemProps}
            />
          </StylesWrapper>
          <StyledMoreButton
            ref={buttonRef}
            type={BUTTON_TYPES.PLAIN}
            size={BUTTON_SIZES.SMALL}
            variant={BUTTON_VARIANTS.RECTANGLE}
            onClick={() => setIsPopupOpen(true)}
          >
            {__('More styles', 'web-stories')}
            <Icons.ChevronDownSmall />
          </StyledMoreButton>
          <Popup
            topOffset={topOffset}
            isRTL={isRTL}
            anchor={buttonRef}
            isOpen={isPopupOpen}
            placement={PLACEMENT.RIGHT_START}
            spacing={SPACING}
            renderContents={() => (
              <StyleManager
                styles={textStyles}
                applyStyle={handlePresetClick}
                onClose={() => setIsPopupOpen(false)}
                {...styleItemProps}
              />
            )}
          />
        </>
      )}
      {!hasPresets && (
        <NoStylesWrapper>
          <NoStylesText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {__('No Styles Saved', 'web-stories')}
          </NoStylesText>
        </NoStylesWrapper>
      )}
    </>
  );
}

PresetPanel.propTypes = {};

export default PresetPanel;
