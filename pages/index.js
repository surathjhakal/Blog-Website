import Head from "next/head";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import HomeBlog from "../components/HomeBlog";

export default function Home() {
  return (
    <div className={styles.home}>
      <Head>
        <title>My Blog</title>
        <meta name="description" content="My Blog Site!!!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.home_content}>
        <Header />
        <HomeBlog />
      </div>
    </div>
  );
}
