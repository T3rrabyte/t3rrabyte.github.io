import random from "random";

export async function GET(request) {
    return Response.json(random.float());
}
