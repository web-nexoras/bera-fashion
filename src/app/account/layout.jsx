import { AccountSidebar } from "@/components/account/account-sidebar";
import { AccountTopbar } from "@/components/account/account-topbar";
import { requireUser } from "@/lib/auth";
export default async function AccountLayout({ children }) {
    const session = await requireUser("/account");
    const initialUser = session.user;
    return (<div className="min-h-screen bg-canvas">
      <div className="lg:flex">
        <AccountSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AccountTopbar initialUser={{
            name: initialUser.name,
            email: initialUser.email,
            avatar: initialUser.avatar,
        }}/>
          <main className="container-x w-full flex-1 py-8">{children}</main>
        </div>
      </div>
    </div>);
}
