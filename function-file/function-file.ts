/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/// <reference types="@types/office-js" />

export interface IMail {
  subject: string;
  body?: string;
  id: string;
}

(() => {
  Office.initialize = () => {
  };

  // Add any ui-less function here
})();
