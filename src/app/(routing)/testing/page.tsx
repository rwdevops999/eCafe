'use client'

const Test = () => {

  const ftest = () => {
    let s: string = "2025-02-13T20:49:07.000Z";

    s = s.replace('T', ' ').slice(0,s.length - 1);

    let date: Date = new Date(s);
    console.log(date.toISOString());
}

ftest();

const renderComponent = () => {
  return (<></>);
  };

  return (<>{renderComponent()}</>);
}

export default Test;