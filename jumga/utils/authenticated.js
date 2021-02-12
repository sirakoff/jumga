import { tone } from "@chakra-ui/theme-tools";
import nookies from "nookies";
import { verifyIdToken } from "./firebase/admin";

export async function getServerSideProps(context) {
    
    try {
    
        const cookies = nookies.get(context);
        const token = await verifyIdToken(cookies.token);
    
        return {
            props: { session: true, token: cookies.token, uid: token.uid },
        };
    
    } catch (err) {

        console.log(err);

        nookies.destroy(context, 'token', {
            path: '/'
        });
        
        context.res.writeHead(302, { Location: `/login?r=${context.req.url}` });
        context.res.end();
        return { props: {} };

    }

}