import RoleDetails from "@/components/iam/roles/view/role-details"
import { separator_equals } from "@/data/constants";

const Roles = async ({ params }: { params: { details: string } }) => {
    const {details} = await(params);

    let selectedRole: string | undefined = undefined;

    const getURLDetails = (urlParams: string) => {
      if (urlParams) {
          const roleDetails: string[] = urlParams.split(separator_equals);
        
          selectedRole = roleDetails[1];
      }
    }
    
    getURLDetails(details);

  return (
    <RoleDetails _selectedRole={selectedRole}/>
  )
}

export default Roles