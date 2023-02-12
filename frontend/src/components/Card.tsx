import Image from "next/image"
import styles from "@/styles/Card.module.scss";
import { Account } from "@/types/Account";

type CardProps = {
    account: Account
    text: string
}
export default function Card(props: CardProps) {
  return (
    <div className={styles.card}>
    <div className={styles.card_header}>
      <Image className={styles.account_icon} width={50} height={50} src={props.account.image} alt="Account Icon" />
      <div className={styles.account_info}>
        <div className={styles.account_name}>{props.account.name}</div>
        <div className={styles.account_id}>@{props.account.id}</div>
      </div>
    </div>
    <div className={styles.card_text}> {props.text} </div>
  </div>
  );
}