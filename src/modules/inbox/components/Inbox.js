import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Wrapper } from 'modules/layout/components';
import { AvatarImg } from 'modules/common/components/filterableList/styles';
import {
  Button,
  Label,
  Icon,
  TaggerPopover,
  Tags
} from 'modules/common/components';
import { BarItems } from 'modules/layout/styles';
import Conversation from './conversation/Conversation';
import AssignBoxPopover from './assignBox/AssignBoxPopover';
import { LeftSidebar, RespondBox } from '../containers';
import ConversationDetails from './sidebar/ConversationDetails';
import { LeftSidebar as RightSidebar } from 'modules/customers/containers';

import {
  PopoverButton,
  ConversationWrapper,
  AssignText,
  AssignWrapper,
  AssignTrigger
} from '../styles';

class Inbox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      attachmentPreview: {}
    };

    this.changeStatus = this.changeStatus.bind(this);
    this.setAttachmentPreview = this.setAttachmentPreview.bind(this);
    this.scrollBottom = this.scrollBottom.bind(this);
  }

  componentDidMount() {
    this.scrollBottom();
  }

  componentDidUpdate() {
    this.scrollBottom();
  }

  scrollBottom() {
    this.node.scrollTop = this.node.scrollHeight;
  }

  setAttachmentPreview(attachmentPreview) {
    this.setState({ attachmentPreview });
  }

  // change resolved status
  changeStatus() {
    const { currentConversation, changeStatus } = this.props;

    let status = currentConversation.status;

    if (status === 'closed') {
      status = 'open';
    } else {
      status = 'closed';
    }

    // call change status method
    changeStatus(currentConversation._id, status);
  }

  renderStatusButton(status) {
    let btnStyle = 'success';
    let text = 'Resolve';
    let icon = <Icon icon="checkmark" />;

    if (status === 'closed') {
      text = 'Open';
      btnStyle = 'warning';
      icon = <Icon icon="refresh" />;
    }

    return (
      <Button btnStyle={btnStyle} onClick={this.changeStatus} size="small">
        {icon} {text}
      </Button>
    );
  }

  render() {
    const {
      queryParams,
      currentConversationId,
      currentConversation,
      onChangeConversation,
      afterTag
    } = this.props;
    const tags = currentConversation.tags || [];
    const assignedUser = currentConversation.assignedUser;

    const tagTrigger = (
      <PopoverButton>
        {tags.length ? (
          <Tags tags={tags} limit={1} />
        ) : (
          <Label lblStyle="default">no tags</Label>
        )}
        <Icon icon="ios-arrow-down" />
      </PopoverButton>
    );

    const assignTrigger = (
      <AssignTrigger>
        {assignedUser && assignedUser._id ? (
          <AvatarImg
            src={assignedUser.details.avatar || '/images/userDefaultIcon.png'}
          />
        ) : (
          <Button btnStyle="simple" size="small">
            Team members
          </Button>
        )}
        <Icon icon="ios-arrow-down" size={13} />
      </AssignTrigger>
    );

    const actionBarRight = (
      <BarItems>
        <TaggerPopover
          targets={[currentConversation]}
          type="conversation"
          trigger={tagTrigger}
          afterSave={afterTag}
        />

        {this.renderStatusButton(
          currentConversation && currentConversation.status
        )}
      </BarItems>
    );

    const actionBarLeft = (
      <AssignWrapper>
        <AssignText>Assign to:</AssignText>
        <AssignBoxPopover
          targets={[currentConversation]}
          trigger={assignTrigger}
        />
      </AssignWrapper>
    );

    const actionBar = (
      <Wrapper.ActionBar right={actionBarRight} left={actionBarLeft} invert />
    );

    const content = (
      <ConversationWrapper
        innerRef={node => {
          this.node = node;
        }}
      >
        <Conversation
          conversation={currentConversation}
          attachmentPreview={this.state.attachmentPreview}
          scrollBottom={this.scrollBottom}
        />
      </ConversationWrapper>
    );

    const breadcrumb = [{ title: 'Inbox' }];

    return (
      <Wrapper
        header={<Wrapper.Header breadcrumb={breadcrumb} />}
        actionBar={actionBar}
        content={content}
        footer={
          currentConversation._id ? (
            <RespondBox
              conversation={currentConversation}
              setAttachmentPreview={this.setAttachmentPreview}
            />
          ) : null
        }
        leftSidebar={
          <LeftSidebar
            queryParams={queryParams}
            currentConversationId={currentConversationId}
            onChangeConversation={onChangeConversation}
          />
        }
        rightSidebar={
          currentConversation._id ? (
            <RightSidebar
              conversation={currentConversation}
              sections={
                <ConversationDetails conversation={currentConversation} />
              }
              id={currentConversation.customer._id}
            />
          ) : null
        }
      />
    );
  }
}

Inbox.propTypes = {
  queryParams: PropTypes.object,
  title: PropTypes.string,
  onChangeConversation: PropTypes.func,
  changeStatus: PropTypes.func,
  afterTag: PropTypes.func,
  currentConversationId: PropTypes.string,
  currentConversation: PropTypes.object,
  saveCustomer: PropTypes.func,
  customFields: PropTypes.array,
  addCompany: PropTypes.func
};

export default Inbox;
