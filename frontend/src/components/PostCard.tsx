import Image from "next/image"
import styles from "@/styles/PostCard.module.scss";
import { Post } from "@/types/Post";

type PostCardProps = {
    post: Post
}
export default function PostCard(props: PostCardProps) {
  return (
    <div className={styles.card}>
    <div className={styles.card_header}>
      <Image className={styles.account_icon} width={50} height={50} src={props.post.user_image} alt="Account Icon" />
      <div className={styles.account_info}>
        <div className={styles.account_name}>{props.post.user_name}</div>
        <div className={styles.account_id}>{props.post.user_email}</div>
      </div>
    </div>
    <div className={styles.card_text}> {props.post.text} </div>
  </div>
  );
}