import random from "random";
import seedrandom from "seedrandom";

export function GET(request, { params }) {
    random.use(seedrandom(params.seed));
    const out = [];
    for (let i = 0; i < parseInt(params.count); i++) {
        out.push(random.float());
    }
    return Response.json(out);
}
