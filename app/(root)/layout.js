import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import {API_KEY, JWT_SECRET} from "../../config/env";
import User from "../../models/user.model";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { CopilotPopup } from "@copilotkit/react-ui";

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
            <section className='flex h-full flex-1 flex-col'>
                <Navbar {...UserDetail}/>
                <CopilotKit publicApiKey={API_KEY}>
                    {children}
                    <CopilotPopup
                        instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
                        labels={{
                            title: "Popup Assistant",
                            initial: "Need any help?",
                        }}
                    />
                </CopilotKit>
            </section>
        </main>
    );
};

export default Layout;
