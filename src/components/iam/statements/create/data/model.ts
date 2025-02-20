export interface StatementEntity {
    sid: string;
    description: string;
    managed: boolean;
    access: string;

    statementId: number|undefined,
    serviceIdentifier: number|string|undefined;
  }
  