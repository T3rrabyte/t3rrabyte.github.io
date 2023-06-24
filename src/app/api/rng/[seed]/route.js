import random from "random";
import seedrandom from "seedrandom";

export function GET(request, { params }) {
    random.use(seedrandom(params.seed));
    return Response.json(random.float());
}
