import random from "random";
import seedrandom from "seedrandom";

export async function GET(request, { params }) {
    random.use(seedrandom(params.seed));
    return Response.json(random.float());
}
