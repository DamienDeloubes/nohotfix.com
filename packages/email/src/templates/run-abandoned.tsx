import * as React from 'react';

export interface RunAbandonedProps {
  runName: string;
  orgName: string;
  abandonedBy: string;
  reason: string;
  runUrl: string;
}

export function RunAbandoned({ runName, orgName, abandonedBy, reason, runUrl }: RunAbandonedProps): React.JSX.Element {
  return (
    <div>
      <h1>Run abandoned</h1>
      <p>
        {abandonedBy} has abandoned run <strong>{runName}</strong> in {orgName}.
      </p>
      <p>
        <strong>Reason:</strong> {reason}
      </p>
      <a href={runUrl}>View Run</a>
    </div>
  );
}
