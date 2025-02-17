import ServiceDetails from "@/components/iam/services/view/service-details";
import { separator_equals } from "@/data/constants";
import { isNumber, js } from "@/lib/utils";

const Services = async ({ params }: { params: { details: string } }) => {
    const {details} = await(params);

    console.log("Services IN: PARAMS", js(details));

    let selectedService: string | number = "*";

    const getURLDetails = (urlParam: string) => {
        const serviceDetails: string[] = urlParam.split(separator_equals);
        
        selectedService = serviceDetails[1];
        console.log("Services SELECTED SERVICE", selectedService);

        if (isNumber(selectedService)) {
            selectedService = parseInt(selectedService);
        }
        
    }
    
    getURLDetails(details);

    return (
        <ServiceDetails selectedService={selectedService}></ServiceDetails>
    )
}

export default Services;