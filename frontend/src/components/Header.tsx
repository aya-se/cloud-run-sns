import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/Header.module.scss";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className={styles.header}>
      <div className={styles.header_contents}>
        <Image
          className={styles.header_icon}
          width={50}
          height={50}
          src="/google-cloud.png"
          alt="Header Icon"
        />
        <Link href="/" className={styles.header_title}>
          Cloud Run SNS
        </Link>
        {session && session.user ? (
          <button className={styles.header_button} onClick={() => signOut()}>
            サインアウト
          </button>
        ) : (
          <button
            className={styles.header_button}
            onClick={() => signIn("google")}
          >
            サインイン
          </button>
        )}
      </div>
    </header>
  );
}
