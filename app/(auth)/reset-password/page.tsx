import ResetPasswordForm from "../_components/ResetpasswordForm";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const query = await searchParams;
    const token = query.token as string | undefined;

  if (!token) {
    return (
      <div className="p-6">
        <p className="text-red-600">Invalid or missing token</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ResetPasswordForm token={token} />
    </div>
  );
}
