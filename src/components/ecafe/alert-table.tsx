import { Alert } from "@/components/ui/alert"
import PageTitle from "./page-title";
import { AlertTableType } from "@/types/ecafe";

const AlertTable = ({alert}:{alert: AlertTableType}) => {
  return (
    <div className="w-[100%] h-[100%] flex justify-center">
        <div className="flex w-[70%] align-middle items-center">
            <Alert variant={alert.error ? "destructive" : "default"}>
                <div>
                    <PageTitle title={alert.title}/>
                </div>
                <div className="grid grid-cols-12 mb-1">
                    <div className="col-span-11">
                        {alert.table ? alert.table : null}
                    </div>
                    <div className="col-span-1">
                        {alert.child ? alert.child : null}
                    </div>
                </div>
            </Alert>
        </div>
    </div>
  );
}

export default AlertTable;