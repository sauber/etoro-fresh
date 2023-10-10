import LoginForm from "../islands/LoginForm.tsx";
export default function UserLogin() {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      <h1 class="my-6 text-3xl">
        Login to your account and start blogging! 📝
      </h1>
      <LoginForm />
    </div>
  );
}