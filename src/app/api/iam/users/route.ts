import { ConsoleLogger } from "@/lib/console.logger";
import prisma from "@/lib/prisma";
import { decrypt, encrypt } from "@/lib/utils";
import { ExtendedUserType } from "@/types/ecafe";
import { NextRequest, NextResponse } from "next/server";

const logger = new ConsoleLogger({ level: 'debug' });

const provisionUserForCreate = (data: ExtendedUserType) => {
  return ({
    name: data.name,
    firstname: data.firstname,
    phone: (data.phone ? data.phone : ""),
    email: data.email,
    password: data.passwordless ? "" : encrypt(data.password!),
    passwordless: data.passwordless,
    OTP: data.OTP,
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

const  provisionUserForUpdate = (data: ExtendedUserType) => {
  return ({
    id: data.id,
    name: data.name,
    firstname: data.firstname,
    phone: (data.phone ? data.phone : ""),
    email: data.email,
    password: data.passwordless ? "" : encrypt(data.password!),
    passwordless: data.passwordless,
    OTP: data.OTP,
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
  const data: ExtendedUserType = await req.json();

  logger.debug("API", "USER TO CREATE", JSON.stringify(data));

  const user: any = provisionUserForCreate(data);

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
    if (!user.passwordless) {
      user.password = decrypt(user.password);
    }
  });

  return users;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const _email = searchParams.get('email');  // passed as ...?service=Stock => service = "Stock"

    if (_email) {
      const user = await prisma.user.findFirst({
        where: {
          email: _email
        }
      })

      return Response.json(user ? [user] : null);
    }

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
  });

  return user;
}
  
const deleteAddressByUserId = async (_userId: number) => {
  await prisma.address.delete(
    {
      where: {
        userId: _userId,
      }
    },
  ).then((response) => {
  });
}
  
export async function DELETE(request: NextRequest) {
  const urlParams = request.nextUrl.searchParams
  const userId = urlParams.get('userId');

  if  (userId) {
    await deleteAddressByUserId(parseInt(userId));
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
  const data: ExtendedUserType = await req.json();

  const  updatedUser = await prisma.user.update({
    where: {
      id: data.id
    },
    data: provisionUserForUpdate(data) as any
  });

  return NextResponse.json(updatedUser);
}