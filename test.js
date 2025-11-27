import { getStudentProfile } from "./call_backend.js";

async function test() {
    const data = await getStudentProfile("SV002");
    console.log(data);
}

test();
