import { ConsoleLogger } from "@/lib/console.logger";
import prisma from "@/lib/prisma";
import { decrypt, encrypt, log } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

const logger = new ConsoleLogger({ level: 'debug' });

const  setUserForCreate = (data: NewExtendedUserType) => {
  return ({
    name: data.name,
    firstname: data.firstname,
    phone: (data.phone ? data.phone : ""),
    email: data.email,
    password: encrypt(data.password!),
    // password: data.password,
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

  users.forEach(user => {
    user.password = decrypt(user.password);
  });

  return users;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams

    const users = await findAllUsers();

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