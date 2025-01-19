// called as 
// - http://localhost:3000/iam/statements/service=*
// - http://localhost:3000/iam/statements/service=ServiceName
// - http://localhost:3000/iam/statements/service=ServiceName&sid=SID

import StatementDetails from "@/components/iam/statements/view/statement-details";
import { separator_ampersand, separator_equals } from "@/data/constants";
import { isNumber, log } from "@/lib/utils";

const Statement = async ({ params }: { params: { details: string } }) => {
  const {details} = await(params);

  let selectedService: string | number = "*";
  let selectedSid: string = "*";

    const getURLDetails = (urlParam: string) => {
      const  urlDetails: string[] = urlParam.split(separator_ampersand);
      const  serviceDetails: string[] = urlDetails[0].split(separator_equals);

      selectedService = serviceDetails[1];
      
      if (isNumber(selectedService)) {
        selectedService = parseInt(selectedService);
      }

      if (urlDetails[1]) {
        const sidDetails: string[] = urlDetails[1].split(separator_equals);
  
        selectedSid = sidDetails[1];
      }
    }

    getURLDetails(details);

    return (
      <StatementDetails _service={selectedService} _sid={selectedSid} />
  )
}

export default Statement;