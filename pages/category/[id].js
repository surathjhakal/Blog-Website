import Head from "next/head";
import styles from "../../styles/Home.module.css";
import Header from "../../components/Header";
import HomeBlog from "../../components/HomeBlog";
import db from "../../firebase";

function PostData({ posts }) {
  console.log(posts);
  return (
    <div className={styles.home}>
      <Head>
        <title>Blogue</title>
        <meta name="description" content="My Blog Site!!!" />
        <link
          rel="icon"
          href="https://e7.pngegg.com/pngimages/76/607/png-clipart-blog-logo-others-text-service.png"
        />
      </Head>

      <div className={styles.home_content}>
        <Header />
        <HomeBlog posts={posts} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const categorydata = await db
    .collection("category")
    .doc(context.query.id)
    .get();
  console.log("hello", categorydata.data());
  const postsCollection = await db
    .collection("posts")
    .where("category", "==", categorydata.data().name)
    .orderBy("likes", "desc")
    .get();

  const posts = postsCollection.docs.map((post) => {
    // console.log(post);
    return {
      id: post.id,
      ...post.data(),
      timestamp: post.data().timestamp.toDate().getTime(),
    };
  });
  return {
    props: {
      posts: JSON.stringify(posts),
    },
  };
}

export default PostData;
