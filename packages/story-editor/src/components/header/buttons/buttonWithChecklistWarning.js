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
import PropTypes from 'prop-types';
import { __ } from '@googleforcreators/i18n';
import styled from 'styled-components';
import {
  Button as DefaultButton,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Tooltip,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import {
  useCheckpoint,
  PPC_CHECKPOINT_STATE,
  ChecklistIcon,
} from '../../checklist';

const Button = styled(DefaultButton)`
  padding: 4px 6px;
  height: 32px;
  svg {
    width: 24px;
    height: auto;
  }
`;

function InnerButton({
  text,
  checkpoint,
  shouldReviewDialogBeSeen = false,
  ...buttonProps
}) {
  return (
    <Button
      variant={BUTTON_VARIANTS.RECTANGLE}
      type={BUTTON_TYPES.PRIMARY}
      size={BUTTON_SIZES.SMALL}
      {...buttonProps}
    >
      {text}
      {shouldReviewDialogBeSeen && <ChecklistIcon checkpoint={checkpoint} />}
    </Button>
  );
}

InnerButton.propTypes = {
  text: PropTypes.node.isRequired,
  checkpoint: PropTypes.oneOf(Object.values(PPC_CHECKPOINT_STATE)),
  shouldReviewDialogBeSeen: PropTypes.bool,
};

function ButtonWithChecklistWarning({
  text,
  isUploading,
  canPublish,
  ...buttonProps
}) {
  const { checkpoint, shouldReviewDialogBeSeen } = useCheckpoint(
    ({ state: { checkpoint, shouldReviewDialogBeSeen } }) => ({
      checkpoint,
      shouldReviewDialogBeSeen,
    })
  );

  const TOOLTIP_TEXT = {
    [PPC_CHECKPOINT_STATE.ALL]: shouldReviewDialogBeSeen
      ? __(
          'Make updates before publishing to improve discoverability and performance on search engines',
          'web-stories'
        )
      : '',
    [PPC_CHECKPOINT_STATE.ONLY_RECOMMENDED]: __(
      'Review checklist to improve performance before publishing',
      'web-stories'
    ),
    [PPC_CHECKPOINT_STATE.UNAVAILABLE]: '',
  };

  const TOOLTIP_TEXT_UPLOADING = __(
    'Saving is disabled due to media currently being uploaded.',
    'web-stories'
  );

  const TOOLTIP_TEXT_REVIEW = __(
    'Submit your work for review, and an Editor will be able to approve it for you.',
    'web-stories'
  );

  let toolTip = isUploading ? TOOLTIP_TEXT_UPLOADING : TOOLTIP_TEXT[checkpoint];

  if (!canPublish) {
    toolTip = TOOLTIP_TEXT_REVIEW;
  }

  return (
    <Tooltip title={toolTip} hasTail>
      <InnerButton
        text={text}
        {...buttonProps}
        checkpoint={checkpoint}
        shouldReviewDialogBeSeen={shouldReviewDialogBeSeen}
      />
    </Tooltip>
  );
}

ButtonWithChecklistWarning.propTypes = {
  text: PropTypes.node.isRequired,
  isUploading: PropTypes.bool,
  canPublish: PropTypes.bool.isRequired,
};

export default ButtonWithChecklistWarning;
