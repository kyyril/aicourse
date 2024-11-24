import { NextResponse } from "next/server";

const sleepTime = async () =>
  new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 4000);
  });

export async function POST(req: Request, res: Response) {
  try {
    await sleepTime();
    return NextResponse.json({ message: "halo" });
  } catch (error) {}
}
