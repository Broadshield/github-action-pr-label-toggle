import * as core from '@actions/core';

import { run } from './action';
import { MissingLabelPrefixError } from './label-error';

run().catch((error) => {
  if (error instanceof MissingLabelPrefixError) {
    core.warning(error.message);
  } else if (error instanceof Error) {
    core.setFailed(error.message);
  }
});
