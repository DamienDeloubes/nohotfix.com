import * as React from 'react';

export interface RunDecisionRecordedProps {
  runName: string;
  orgName: string;
  decision: 'go' | 'no_go';
  decisionBy: string;
  runUrl: string;
}

export function RunDecisionRecorded({ runName, orgName, decision, decisionBy, runUrl }: RunDecisionRecordedProps): React.JSX.Element {
  return (
    <div>
      <h1>Run decision recorded: {decision === 'go' ? 'Go' : 'No-Go'}</h1>
      <p>
        {decisionBy} has recorded a <strong>{decision === 'go' ? 'Go' : 'No-Go'}</strong> decision for run <strong>{runName}</strong> in {orgName}.
      </p>
      <a href={runUrl}>View Run</a>
    </div>
  );
}
