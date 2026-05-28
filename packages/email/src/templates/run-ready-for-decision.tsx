import * as React from 'react';

export interface RunReadyForDecisionProps {
  runName: string;
  orgName: string;
  runUrl: string;
}

export function RunReadyForDecision({ runName, orgName, runUrl }: RunReadyForDecisionProps): React.JSX.Element {
  return (
    <div>
      <h1>Run ready for decision</h1>
      <p>
        The run <strong>{runName}</strong> in {orgName} has completed all specs and is awaiting a go/no-go decision.
      </p>
      <a href={runUrl}>Review Run</a>
    </div>
  );
}
