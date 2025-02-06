'use client'

import { FunctionDefault } from "@/data/types";
import { handleCreateUser } from "@/lib/db";

const user: NewExtendedUserType = {
  id:0,
  name:"test",
  firstname:"test",
  phone:"",
  email:"test@test.com",
  password:"testtest",
  address:{
    id:0,
    street:"",
    number:"",
    box:"",
    city:"",
    postalcode:"",
    county:"",
    country:{
      id:24,
      name:"Belgium",
      dialCode:"+32",
      code:"BE"
    }
  },
  roles:{
    selected:[{id:5},{id:6}],
  }
}

const Test = () => {
    const userCreatedCallback = (_end: FunctionDefault) => {
      console.log("User Created");
    }
  
  const test = () => {
    console.log("User Created");
    handleCreateUser(user, ()=>{}, userCreatedCallback, ()=>{});
  }

const renderComponent = () => {
    return (
      <button onClick={test}>TEST</button>
    );
  };

  return (<>{renderComponent()}</>)
}

export default Test 