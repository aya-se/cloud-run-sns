import Image from "next/image"
import styles from "@/styles/AccountCard.module.scss";
import { Account } from "@/types/Account";
import { useState } from "react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";

type CardProps = {
    account: Account,
    session: Session,
}
export default function Card(props: CardProps) {
  const [newText, setNewText] = useState<string>("");
  const handleSubmitPost = async () => {
    return;
  }
  if (props.session && props.session.user) {
    return (
      <div className={styles.card}>
        <div className={styles.card_header}>
          <Image className={styles.account_icon} width={50} height={50} src={props.account.image} alt="Account Icon" />
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