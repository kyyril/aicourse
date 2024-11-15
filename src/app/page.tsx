import { signIn, auth } from "@/config/auth";

export default async function SignIn() {
  const session = await auth();
  console.log(session?.user);
  if (!session)
    return (
      <div>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button type="submit">Signin with Google</button>
        </form>
      </div>
    );

  return (
    <div>
      <img src={session.user.image} alt="User Avatar" />
    </div>
  );
}
