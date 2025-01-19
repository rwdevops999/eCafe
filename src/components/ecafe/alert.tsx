'use client'

import { AlertDialog, AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog'
import { AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@radix-ui/react-alert-dialog'

const Alert = ({open, setOpen, title, message, notification = "ok"}:{open:boolean; setOpen(x:boolean): any; title: string; message: string; notification?: string}) => {
    const getImageIcon = (notifcation: string): string => {
        let src: string = '/icons/ok.png';

        switch (notification) {
            case "warning":
                src = '/icons/warning.png'
                break;
            case "error":
                src = '/icons/error.png'
                break;
            default:
                break;
        }

        return src;
    }

    const renderComponent = () => {
        return (
            <div className='border-2 w-[50%] h-auto rounded-xl'>
                <AlertDialog open={open}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>
                    <div className='flex space-x-2 justify-center'>
                        {title}
                        </div>
                        </AlertDialogTitle>
                    <AlertDialogDescription>
                    </AlertDialogDescription>
                    <div className='flex space-x-2 justify-center p-5'>
                    <img src={getImageIcon(notification)} width={24} height={24}/>
                            {message}
                    </div>
                    </AlertDialogHeader>
                    <div className='flex items-center justify-center'>
                        <div>
                        <AlertDialogFooter>
                            <AlertDialogAction onClick={() => setOpen(false)}>OK</AlertDialogAction>
                        </AlertDialogFooter>
                        </div>
                    </div>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        )
    };
    
  return (
    <>{renderComponent()}</>
  )
}

export default Alert