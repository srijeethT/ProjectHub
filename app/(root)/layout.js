import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env";
import User from "../../models/user.model";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import MobileNavigation from "@/components/mobileNavigation";

const Layout = async ({ children }) => {
    let currentUser = null;
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;
    let UserDetail=null;

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            currentUser = await User.findById(decoded.userId);
            UserDetail={
                _id: currentUser._id.toString(),
                    email: currentUser.email,
            }
            if (!currentUser) {
                redirect("/signin");
            }
        } catch (e) {
            redirect("/signin");
        }
    } else {
        redirect("/signin");
    }

    return (
        <main className=' flex bg-blue-100'>
          <Sidebar {...UserDetail}/>
            <section className='flex h-full flex-1 flex-col'>
                <Navbar {...UserDetail}/>
                {children}
            </section>


        </main>
    );
};

export default Layout;
