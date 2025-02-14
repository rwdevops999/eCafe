'use client'

import TestStorage from "./storage";

const Test = () => {

  const ftest = () => {
  }

  ftest();

  const renderComponent = () => {
    return (<TestStorage />);
    };

  return (<>{renderComponent()}</>);
}

export default Test;