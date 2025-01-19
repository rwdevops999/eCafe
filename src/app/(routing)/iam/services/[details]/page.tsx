import ServiceDetails from "@/components/iam/services/view/service-details";
import { separator_equals } from "@/data/constants";

const Services = async ({ params }: { params: { details: string } }) => {
    const {details} = await(params);

    let selectedService: string | undefined = undefined;

    const getURLDetails = (urlParam: string) => {
        const serviceDetails: string[] = urlParam.split(separator_equals);
        
        selectedService = serviceDetails[1];
    }
    
    getURLDetails(details);

    return (
        <ServiceDetails selectedService={selectedService}></ServiceDetails>
    )
}

export default Services;