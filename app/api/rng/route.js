import random from "random";
import seedrandom from "seedrandom";

export function GET() {
    random.use(seedrandom(new Date().getTime()));
    return Response.json(random.float());
}
