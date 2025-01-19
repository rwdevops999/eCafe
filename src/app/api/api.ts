import { NextRequest, NextResponse } from "next/server";
import connectionPool from "../../../db";

export default async function handler(req: NextRequest, resp: NextResponse, sql: string) {
    // handler(req, resp);
    try {
        const result = await connectionPool.query(sql);
        return new Response(JSON.stringify(result.rows), {
            headers: { "content-type": "application/json" },
            status: 200,
         });
    } catch (err) {
        console.error("Error executing query", err);
        return new Response("Internal Server Error", {
            headers: { "content-type": "application/json" },
            status: 500,
         });
    }
}
