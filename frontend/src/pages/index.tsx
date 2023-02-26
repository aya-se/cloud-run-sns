import Head from "next/head";
import AccountCard from "@/components/AccountCard";
import PostCard from "@/components/PostCard";
import { Account } from "@/types/Account";
import { Post } from "@/types/Post";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.scss";
import { GoogleAuth } from "google-auth-library";

type Props = {
  data: Array<Post>;
};
export async function getServerSideProps() {
  const API_URL = process.env.API_URL;
  /*
  const auth = new GoogleAuth();
  const client = await auth.getIdTokenClient(API_URL ?? "");
  const res = await client.request({ url: `${API_URL}/posts` });
  const data = (await res.data) as Array<Post>;
  */
  const res = await fetch(`${API_URL}/posts`);
  const data = (await res.json()) as Array<Post>;
  // const data = new Array<Post>();
  const props: Props = {
    data: data,
  };
  return {
    props: props,
  };
}
export default function Home(props: Props) {
  const { data: session } = useSession();
  const [myAccount, setMyAccount] = useState<Account>({
    user_name: "Account Name",
    user_email: "example@gmail.com",
    user_image: "/google-cloud.png",
  });
  useEffect(() => {
    if (session && session.user) {
      setMyAccount({
        user_email: session.user.email ?? "",
        user_name: session.user.name ?? "",
        user_image: session.user.image ?? "",
      });
    }
  }, [session]);
  return (
    <>
      <Head>
        <title>Cloud Run SNS</title>
        <link rel="icon" href="/google-cloud.png" />
      </Head>
      <main className={styles.home}>
        <AccountCard account={myAccount} />
        {props.data.map((post, idx) => {
          return <PostCard key={idx} post={post} />;
        })}
      </main>
    </>
  );
}
