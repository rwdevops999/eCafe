// called as 
// - http://localhost:3000/iam/policies/policy=*
// - http://localhost:3000/iam/policies/policy=PolicyName

import PolicyDetails from "@/components/iam/policies/view/policy-details";
import { separator_equals } from "@/data/constants";

const Policies = async ({ params }: { params: { details: string } }) => {
    const {details} = await(params);

    let selectedPolicy: string | undefined = undefined;

    const getURLDetails = (urlParam: string) => {
        const policyDetails: string[] = urlParam.split(separator_equals);
        
        selectedPolicy = policyDetails[1];
    }
    
    getURLDetails(details);

    return (
        <PolicyDetails _policy={selectedPolicy}></PolicyDetails>
    )
}

export default Policies;
