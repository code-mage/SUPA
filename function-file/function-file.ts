/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/// <reference types="@types/office-js" />
import {Devops} from '../devops/devops';
import {
  WorkItemQueryResult
} from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';

export interface IMail {
  subject: string;
  body?: string;
  id: string;
}

(() => {
  let devops: Devops;

  Office.initialize = () => {
    if (!devops) {
      devops = new Devops();
    }
    dummyCalls();
  };

  function dummyCalls() {
    getWorkItem(null);
  }

  function getWorkItem(event) {
      let mail = Office.context.mailbox.item as Office.MessageRead;
      let mailInfo = getMailInfo(mail);

      mail.notificationMessages.addAsync('subject', {
        type:
          Office.MailboxEnums.ItemNotificationMessageType
            .InformationalMessage,
        icon: 'blue-icon-16',
        message: 'Fetching WIT details',
        persistent: false
      });

      devops.getWorkItem(mailInfo.id).then(
        (queryResult: WorkItemQueryResult) => {
          mail.notificationMessages.addAsync('subject', {
            type:
              Office.MailboxEnums.ItemNotificationMessageType
                .InformationalMessage,
            icon: 'blue-icon-16',
            message: 'Id: ' + queryResult.workItems[0].id.toString(),
            persistent: false
          });

          if (event) {
            event.completed();
          }
        },
        () => {
          mail.notificationMessages.addAsync('subject', {
            type:
              Office.MailboxEnums.ItemNotificationMessageType
                .InformationalMessage,
            icon: 'blue-icon-16',
            message: 'Error while fetching workitem',
            persistent: false
          });

          if (event) {
            event.completed();
          }
        }
      );
  }

  function getMailInfo(mail: Office.MessageRead): IMail {
    return {
      subject: mail.subject,
      id: mail.conversationId
    };
  }

  // Add any ui-less function here
})();
