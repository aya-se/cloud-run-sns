import Image from "next/image";
import styles from "@/styles/PostCard.module.scss";
import { Post } from "@/types/Post";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type PostCardProps = {
  post: Post;
};
export default function PostCard(props: PostCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [datetime, setDatetime] = useState("");
  useEffect(() => {
    const date = new Date(props.post.timestamp);
    setDatetime(date.toLocaleString("ja-JP"));
  }, []);
  const handleDeletePost = async () => {
    if (
      !session ||
      !session.user ||
      session.user.email !== props.post.user_email
    )
      return;
    await fetch(`/api/posts/?id=${props.post.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session?.user.idToken}` ?? "",
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ id: props.post.id }),
    });
    router.reload();
  };
  return (
    <div className={styles.card}>
      <div className={styles.card_header}>
        <Image
          className={styles.account_icon}
          width={50}
          height={50}
          src={props.post.user_image}
          alt="Account Icon"
        />
        <div className={styles.account_info}>
          <div className={styles.account_name}>{props.post.user_name}</div>
          <div className={styles.account_id}>
            {props.post.user_email}・{datetime}
          </div>
        </div>
        {session &&
          session.user &&
          session.user.email === props.post.user_email && (
            <button
              className={styles.delete_button}
              onClick={() => handleDeletePost()}
            >
              削除
            </button>
          )}
      </div>
      <div className={styles.card_text}> {props.post.text} </div>
    </div>
  );
}
