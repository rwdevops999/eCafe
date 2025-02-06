import { PolicyType, UserType } from "@/data/iam-scheme";
import { ConsoleLogger } from "@/lib/console.logger";
import prisma from "@/lib/prisma";
import { decrypt, difference, encrypt, log } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { group } from "console";
import { NextRequest, NextResponse } from "next/server";

const logger = new ConsoleLogger({ level: 'debug' });

const  setUserForCreate = (data: NewExtendedUserType) => {
  return ({
    name: data.name,
    firstname: data.firstname,
    phone: (data.phone ? data.phone : ""),
    email: data.email,
    // password: encrypt(data.password!),
    password: data.password,
    address: {
      create: {
        street: (data.address?.street ? data.address.street : ""),
        number: (data.address?.number ? data.address.number : ""),
        box: (data.address?.box ? data.address.box : ""),
        city: (data.address?.city ? data.address.city : ""),
        postalcode: (data.address?.postalcode ? data.address.postalcode : ""),
        county: (data.address?.county ? data.address.county : ""),
        country: {
          connect: {
            id: (data.address?.country ? data.address.country.id : null)
          }
        }
      },
    },
    roles: {
      disconnect: data.roles?.removed,
      connect: data.roles?.selected,
    },
    policies: {
      disconnect: data.policies?.removed,
      connect: data.policies?.selected,
    },
    groups: {
      disconnect: data.groups?.removed,
      connect: data.groups?.selected,
    }
  });
}

const  setUserForUpdate = (data: NewExtendedUserType) => {
  return ({
    id: data.id,
    name: data.name,
    firstname: data.firstname,
    phone: (data.phone ? data.phone : ""),
    email: data.email,
    password: encrypt(data.password!),
    address: {
      update: {
        // id: data.address.id,
        street: (data.address?.street ? data.address.street : ""),
        number: (data.address?.number ? data.address.number : ""),
        box: (data.address?.box ? data.address.box : ""),
        city: (data.address?.city ? data.address.city : ""),
        postalcode: (data.address?.postalcode ? data.address.postalcode : ""),
        county: (data.address?.county ? data.address.county : ""),
        country: {
          connect: {
            id: (data.address?.country ? data.address.country.id : null)
          }
        }
      }
    },
    roles: {
      disconnect: data.roles?.removed,
      connect: data.roles?.selected
    },
    policies: {
      disconnect: data.policies?.removed,
      connect: data.policies?.selected
    },
    groups: {
      disconnect: data.groups?.removed,
      connect: data.groups?.selected
    }
  });
}

export async function POST(req: NextRequest) {
    const data: NewExtendedUserType = await req.json();

    logger.debug("API", "USER TO CREATE", JSON.stringify(data));

    const user: any = setUserForCreate(data);
    logger.debug("API", "PREPARED USER", JSON.stringify(user));

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
        roles: {
          include: {
            policies: {
              include: {
                statements: {
                  include: {
                    actions: true
                  }
                }
              }
            }
          }
        },
        policies: {
          include: {
            statements: {
              include: {
                actions: true
              }
            }
          }
        },
        groups: {
          include: {
            roles: {
              include: {
                policies: {
                  include: {
                    statements: {
                      include: {
                        actions: true
                      }
                    }
                  }
                }
              }
            },
            policies: {
              include: {
                statements: {
                  include: {
                    actions: true
                  }
                }
              }
            }
          }
        }
      }
    }
  );

  // users.forEach(user => {
  //   user.password = decrypt(user.password);
  // });

  return users;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams

    const users = await findAllUsers();

    // const _users: UserType[] = users.map((_user) => {
    //   let user: any = {
    //     id: _user.id,
    //     firstname: _user.firstname,
    //     name: _user.name,
    //     email: _user.email,
    //     password: _user.password,
    //     phone: _user.phone,
    //     phonecode: "",
    //     address: {
    //       id: (_user.address ? _user.address.id : 0),
    //       street: (_user.address ? _user.address.street : ""),
    //       number: (_user.address ? _user.address.number : ""),
    //       box: (_user.address ? _user.address.box : ""),
    //       city: (_user.address ? _user.address.city : ""),
    //       postalcode: (_user.address ? _user.address.postalcode : ""),
    //       county: (_user.address ? _user.address.county : ""),
    //       country: {
    //         id: (_user.address ? _user.address.country.id : 0),
    //         name: (_user.address ? (_user.address.country.name ? _user.address.country.name : "") : ""),
    //         dialCode: (_user.address ? (_user.address.country.dialCode ? _user.address.country.dialCode : "") : ""),
    //         code: (_user.address ? (_user.address.country.code ? _user.address.country.code : "") : "")
    //       }
    //     },
    //     roles: {
    //       original: _user.roles,
    //     },
    //     policies: {
    //       original: _user.policies
    //     },
    //     groups: {
    //       original: _user.groups,
    //     }
    //   };

    //   return user;
    // });

    return Response.json(users);
  }

  const deleteUserById = async (userId: number) => {
    let user: any;
  
    await prisma.user.delete(
      {
        where: {id: userId},
      }
    ).then((response) => {
      user = response;
      log(true, "API(users)", "User deleted", user.id);
    });
  
    return user;
  }
  
  const deleteAddressByUserId = async (_userId: number) => {
    let address: any;
  
    await prisma.address.delete(
      {
        where: {
          userId: _userId,
        }
      },
    ).then((response) => {
      address = response;
      log(true, "API(users)", "Address deleted", address.id);
    });
  
    return address;
  }
  
  export async function DELETE(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams
  const userId = urlParams.get('userId');

  if  (userId) {
    log(true, "API(users)", "DELETING Address from userId", userId);
    log(true, "API(users)", "DELETING User by Id", userId);
    const address = await deleteAddressByUserId(parseInt(userId));
    const user = await deleteUserById(parseInt(userId));

    return new Response(JSON.stringify(`deleted ${user}`), {
      headers: { "content-type": "application/json" },
      status: 200,
   });
  }

  return new Response(JSON.stringify(`user not deleted`), {
      headers: { "content-type": "application/json" },
      status: 400,
   });
}

export async function PUT(req: NextRequest) {
  const data: NewExtendedUserType = await req.json();

  const  updatedUser = await prisma.user.update({
    where: {
      id: data.id
    },
    data: setUserForUpdate(data) as any
  });

  return NextResponse.json(updatedUser);
}