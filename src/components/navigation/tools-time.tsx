import { useEffect, useState } from "react";

const ToolsTime = () => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [timestr, setTimestr] = useState<string>(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsClient(true);
      let now = new Date();
      setTimestr(now.toLocaleTimeString());
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };

    // eslint-disable-next-line
  });

  const renderComponent = () => {
        return (<div className="ml-1">{isClient ? timestr : "00:00:00"}</div>);
        }

  return (<>{renderComponent()}</>
  )
}

export default ToolsTime;

