import { DialogDataType } from "@/components/iam/users/manage/tabs/data/data";
import { UserType } from "@/data/iam-scheme";
import prisma from "@/lib/prisma";
import { decrypt, encrypt, log } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const  setUserForCreate = (data: UserType) => {
  return ({
    name: data.name,
    firstname: data.firstname,
    phone: (data.phone ? data.phone : ""),
    email: data.email,
    password: encrypt(data.password),
    address: {
      create: {
        street: (data.address.street ? data.address.street : ""),
        number: (data.address.number ? data.address.number : ""),
        box: (data.address.box ? data.address.box : ""),
        city: (data.address.city ? data.address.city : ""),
        postalcode: (data.address.postalcode ? data.address.postalcode : ""),
        county: (data.address.county ? data.address.county : ""),
        country: {
          connect: {
            id: data.address.country.id,
          }
        }
      },
    },
    roles: {
      connect: data.roles
    },
    policies: {
      connect: data.policies
    }
  });
}

const  setUserForUpdate = (data: UserType) => {
  return ({
    id: data.id,
    name: data.name,
    firstname: data.firstname,
    phone: (data.phone ? data.phone : ""),
    email: data.email,
    password: encrypt(data.password),
    address: {
      update: {
        // id: data.address.id,
        street: (data.address.street ? data.address.street : ""),
        number: (data.address.number ? data.address.number : ""),
        box: (data.address.box ? data.address.box : ""),
        city: (data.address.city ? data.address.city : ""),
        postalcode: (data.address.postalcode ? data.address.postalcode : ""),
        county: (data.address.county ? data.address.county : ""),
        country: {
          connect: {
            id: data.address.country.id,
          }
        }
      }
    },
    roles: {
      connect: data.roles
    },
    policies: {
      connect: data.policies
    }
  });
}

export async function POST(req: NextRequest) {
    const data: UserType = await req.json();

    log(true, "API", "createUser", data, true);
    const user: any = setUserForCreate(data);

    const createdUser = await prisma.user.create({data: user});

    return new Response(JSON.stringify(createdUser), {
        headers: { "content-type": "application/json" },
        status: 201,
     });

    // return new Response(JSON.stringify("OK"), {
    //     headers: { "content-type": "application/json" },
    //     status: 201,
    //  });
  }

const findAllUsers = async () => {
  const users = await prisma.user.findMany(
    {
      include: {
        address: {
          include: {
            country: true
          },
        },
        roles: true,
        policies: true,
      }
    }
  );

  users.forEach(user => {
    user.password = decrypt(user.password);
  });

  return users;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams

    const users = await findAllUsers();

    const _users: UserType[] = users.map((_user) => {
      let user: any = {
        id: _user.id,
        firstname: _user.firstname,
        name: _user.name,
        email: _user.email,
        password: _user.password,
        phone: _user.phone,
        phonecode: "",
        // address: {
        address: {
          id: (_user.address ? _user.address.id : 0),
          street: (_user.address ? _user.address.street : ""),
          number: (_user.address ? _user.address.number : ""),
          box: (_user.address ? _user.address.box : ""),
          city: (_user.address ? _user.address.city : ""),
          postalcode: (_user.address ? _user.address.postalcode : ""),
          county: (_user.address ? _user.address.county : ""),
          country: {
            id: (_user.address ? _user.address.country.id : 0),
            name: (_user.address ? (_user.address.country.name ? _user.address.country.name : "") : ""),
            dialCode: (_user.address ? (_user.address.country.dialCode ? _user.address.country.dialCode : "") : ""),
            code: (_user.address ? (_user.address.country.code ? _user.address.country.code : "") : "")
          }
        },
        roles: _user.roles,
        policies: _user.policies
      };

      return user;
    });

    return Response.json(_users);
  }

  const deleteUser = async (userId: number) => {
    let user: any;
  
    await prisma.user.delete(
      {
        where: {id: userId},
        // include: {
        //   address: true
        // }
      }
    ).then((response) => {
      user = response;
    });
  
    return user;
  }
  
  const deleteAddressByUser = async (_userId: number) => {
    let address: any;
  
    await prisma.address.delete(
      {
        where: {
          userId: _userId,
        }
      },
    //     include: {
    //       address: true
    //     }
    //   }
    ).then((response) => {
      address = response;
    });
  
    return address;
  }
  
  export async function DELETE(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams
  const userId = urlParams.get('userId');

  if  (userId) {
    const address = await deleteAddressByUser(parseInt(userId));
    const user = await deleteUser(parseInt(userId));

    return new Response(JSON.stringify(`deleted ${user}`), {
      headers: { "content-type": "application/json" },
      status: 200,
   });
  }

  return new Response(JSON.stringify(`not deleted: policy id undefined`), {
      headers: { "content-type": "application/json" },
      status: 400,
   });
}

export async function PUT(req: NextRequest) {
  const data: UserType = await req.json();

  const  updatedUser = await prisma.user.update({
    where: {
      id: data.id
    },
    data: setUserForUpdate(data) as any
  });

  return NextResponse.json(data);
}