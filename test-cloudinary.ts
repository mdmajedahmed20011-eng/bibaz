import { uploadImage } from "./lib/cloudinary";

async function test() {
  const dummyBase64 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  console.log("Testing Cloudinary upload...");
  const res = await uploadImage(dummyBase64, "test");
  console.log("Result:", res);
}
test();
