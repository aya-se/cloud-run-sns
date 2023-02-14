import Image from "next/image"
import styles from "@/styles/AccountCard.module.scss";
import { Account } from "@/types/Account";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

type CardProps = {
    account: Account
}
export default function Card(props: CardProps) {
  const router = useRouter()
  const [newText, setNewText] = useState<string>("");
  const { data: session } = useSession();
  const handleSubmitPost = async () => {
    if (newText === "") return;
    await fetch("/api/post", {
      method: "POST",
      body: JSON.stringify({
        ...props.account,
        text: newText
      })
    });
    router.reload();
  };
  if (session && session.user) {
    return (
      <div className={styles.card}>
        <div className={styles.card_header}>
          <Image className={styles.account_icon} width={50} height={50} src={props.account.user_image} alt="Account Icon" />
        </div>
        <textarea className={styles.textarea} placeholder="新しい投稿を開始" value={newText} onChange={(e) => setNewText(e.target.value)}/>
        <button className={styles.submit_button} onClick={() => {handleSubmitPost()}}>投稿</button>
      </div>
    );
  }
  else {
    return (
      <div className={styles.card}>
        <div className={styles.card_text}>
          <p>ログインして投稿を開始しましょう。</p>
        </div>
        <button className={styles.submit_button} onClick={() => signIn("google")}>サインイン</button>
      </div>
    )
  }
}