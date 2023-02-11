import Link from "next/link";
import Image from "next/image"
import styles from "../styles/Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header_contents}>
        <Image className={styles.header_icon} width={50} height={50} src="/google-cloud.png" alt="Header Icon" />
        <Link href="/" className={styles.header_title}>
          Cloud Run SNS
        </Link>
      </div>
    </header>
  );
}