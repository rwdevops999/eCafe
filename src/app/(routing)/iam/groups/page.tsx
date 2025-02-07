import GroupDetails from "@/components/iam/groups/view/group-details";
import { separator_equals } from "@/data/constants";

const Groups = async ({ params }: { params: { details: string } }) => {
    const {details} = await(params);

    let selectedGroup: string | undefined = undefined;

    const getURLDetails = (urlParams: string) => {
      if (urlParams) {
          const userDetails: string[] = urlParams.split(separator_equals);
        
          selectedGroup = userDetails[1];
      }
    }
    
    getURLDetails(details);

  return (
    <GroupDetails _selectedGroup={selectedGroup}/>
  )
}
export default Groups;