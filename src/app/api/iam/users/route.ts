import prisma from "@/lib/prisma";
import { createApiResponse, decrypt, encrypt } from "@/lib/utils";
import { ExtendedUserType, UserType } from "@/types/ecafe";
import { create } from "domain";
import { NextRequest, NextResponse } from "next/server";

const provisionUserForCreate = (data: ExtendedUserType) => {
  return ({
    name: data.name,
    firstname: data.firstname,
    phone: (data.phone ? data.phone : ""),
    email: data.email,
    password: data.passwordless ? "" : encrypt(data.password!),
    passwordless: data.passwordless,
    attemps: 0,
    blocked: false,
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
    attemps: data.attemps,
    blocked: data.blocked,
    address: {
      update: {
        street: data.address!.street,
        number: data.address!.number,
        box: data.address!.box,
        city: data.address!.city,
        postalcode: data.address!.postalcode,
        county: data.address?.county,
        country: {
          connect: {
            id: (data.address && data.address.country ? data.address.country.id : 0)
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

  const user: any = provisionUserForCreate(data);

  const createdUser: UserType = await prisma.user.create({data: user});

  return Response.json(createApiResponse(201, "Payload: UserType", createdUser));
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

  console.log("Decrypt passwords");
  users.forEach(user => {
    if (!user.passwordless) {
      console.log("Decrypt password for " + user.name);
      user.password = decrypt(user.password);
      console.log("password for " + user.name + " is " + user.password);
    }
  });

  return users;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const _email: string|null = searchParams.get('email');  // passed as ...?service=Stock => service = "Stock"
    const _id: string|null = searchParams.get('id');  // passed as ...?service=Stock => service = "Stock"

    if (_email) {
      const user: UserType|null = await prisma.user.findFirst({
        where: {
          email: _email
        },
        include: {
          address: {
            include: {
              country: true
            },
          },
        }
      })

      if (user) {
        if (!user.passwordless) {
          console.log("Decrypt password for " + user.name);
          user.password = decrypt(user.password);
          console.log("password for " + user.name + " is " + user.password);
        }
    
        return Response.json(createApiResponse(200, "Payload: UserType", user));
      }
    }

    if (_id) {
      const user: UserType|null = await prisma.user.findFirst({
        where: {
          id: parseInt(_id)
        },
        include: {
          address: {
            include: {
              country: true
            },
          },
        }
      })

      if (user) {
        if (!user.passwordless) {
          console.log("Decrypt password for " + user.name);
          user.password = decrypt(user.password);
          console.log("password for " + user.name + " is " + user.password);
        }

        return Response.json(createApiResponse(200, "Payload: UserType", user));
      }

      return Response.json(createApiResponse(404, "user not found"));
    }

    const users: UserType[] = await findAllUsers();

    return Response.json(createApiResponse(200, "Payload: UserType[]", users))
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
    const user: UserType = await deleteUserById(parseInt(userId));

    return Response.json(createApiResponse(200, "Payload: UserType", user));
  }

  return Response.json(createApiResponse(400, "User not deleted without id"));
}

export async function PUT(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const userId = searchParams.get('userId');  // passed as ...?service=Stock => service = "Stock"

  if (! userId) {
    const data: ExtendedUserType = await req.json();

    console.log("[API] UPDATE USER", JSON.stringify(data));
  
    const updatedUser: UserType = await prisma.user.update({
        where: {
        id: data.id
      },
      data: provisionUserForUpdate(data) as any
    });

    return Response.json(createApiResponse(200, "Payload: UserType", updatedUser));
  }

  // UNBLOCK USER
  const updatedUser: UserType = await prisma.user.update({
    where: {
      id: parseInt(userId)
    },
    data: {
      attemps: 0,
      blocked: false
    }
  });

  return Response.json(createApiResponse(200, "Payload: UserType", updatedUser));
}