import Card from '@/components/Card'
import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import { Account } from '@/types/Account'
import { useSession, signIn, signOut } from "next-auth/react"

export async function getServerSideProps() {
  const API_URL = process.env.API_URL
  const res = await fetch(`${API_URL}/hello?name=Next`)
  const data = await res.json()
  return {
    props: {
      data,
    },
  }
}
export default function Home(props: any) {
  const { data: session } = useSession();
  console.log(session);
  const account: Account = {
    id: "Account ID",
    name: "Account Name",
  };
  const text = "東京工業大学は、創立から140年を越える歴史をもつ国立大学であり、2018年3月には指定国立大学法人の指定を受けた理工系総合大学です。大岡山、すずかけ台、田町の3つのキャンパスに学士課程約5,000人、大学院課程約5,500人の学生が学び、うち、約1,800名が海外からの留学生です。学生の教育研究を支えるのは約1,100人の教員と約600人の職員です。\n\n世界を舞台に科学技術の分野で活躍できる人材の輩出と地球規模で人々の課題を解決する研究成果によって社会に貢献し、長期目標である「世界最高峰の理工系総合大学」の実現を目指します。"
  return (
    <>
      <Head>
        <title>Cloud Run SNS</title>
        <link rel="icon" href="/google-cloud.png" />
      </Head>
      <main className={styles.home}>
        {session && session.user ?
          ( 
            <>
              Signed in as {session.user.email} <br/>
              <button onClick={() => signOut()}>Sign out</button>
            </>
          )
        :
          (
             <>
              Not signed in <br/>
              <button onClick={() => signIn("google")}>Sign in</button>
            </>
          )
        }
        <Card account={account} text={text}/>
        <Card account={account} text={text}/>
        <Card account={account} text={text}/>
      </main>
    </>
  )
}