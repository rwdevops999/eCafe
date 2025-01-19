import UserDetails from "@/components/iam/users/view/user-details";
import { separator_equals } from "@/data/constants";

const Users = async ({ params }: { params: { details: string } }) => {
    const {details} = await(params);

    let selectedUser: string | undefined = undefined;

    const getURLDetails = (urlParams: string) => {
      if (urlParams) {
          const userDetails: string[] = urlParams.split(separator_equals);
        
          selectedUser = userDetails[1];
      }
    }
    
    getURLDetails(details);

  return (
    <UserDetails _selectedUser={selectedUser}/>
  )
}

export default Users;