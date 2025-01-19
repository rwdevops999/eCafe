import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertType } from "@/data/types";
import { Terminal } from "lucide-react"

const AlertMessage = ({alert}:{alert: AlertType}) => {
  return (
    <div className="w-[100%] h-[100%] flex justify-center">
        <div className="flex w-[50%] align-middle items-center">
            <Alert variant={alert.error ? "destructive" : "default"}>
                <div className="flex justify-between">
                    <div>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>{alert.title}</AlertTitle>
                        <AlertDescription>
                            {alert.message}
                        </AlertDescription>
                    </div>
                    <div>
                        {alert.child ? alert.child : null}
                    </div>
                </div>
            </Alert>
        </div>
    </div>
  );
}

export default AlertMessage;