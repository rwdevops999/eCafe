// called as 
// - http://localhost:3000/iam/statements/service=*
// - http://localhost:3000/iam/statements/service=ServiceName
// - http://localhost:3000/iam/statements/service=ServiceName&sid=SID

import StatementDetails from "@/components/iam/statements/view/statement-details";
import { separator_ampersand, separator_equals } from "@/data/constants";
import { isNumber } from "@/lib/utils";

const Statement = async ({ params }: { params: { details: string } }) => {
  const {details} = await(params);

    let statementId: number|undefined = undefined;

    const getURLDetails = (details: string) => {
      const  serviceDetails: string[] = details.split(separator_equals);

      const sid: string = serviceDetails[1];
      
      if (isNumber(sid)) {
        statementId = parseInt(sid);
        if (statementId === 0) {
          statementId = undefined;
        }
      }
    }

    getURLDetails(details);

    return (
      <StatementDetails _statementId={statementId} />
  )
}

export default Statement;