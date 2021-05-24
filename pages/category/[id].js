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
        <title>My Blog</title>
        <meta name="description" content="My Blog Site!!!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.home_content}>
        <Header />
        <HomeBlog posts={posts} />
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const categories = await db.collection("category").get();
  // Retrieve all categories data from database
  const paths = categories.docs.map((category) => ({
    params: { id: category.id },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const categoryName = await db.collection("category").doc(id).get();
  const postCollection = await db
    .collection("posts")
    .where("category", "==", categoryName.data().name)
    .orderBy("likes", "desc")
    .get();

  const posts = postCollection.docs
    .map((post) => ({
      id: post.id,
      ...post.data(),
    }))
    .map((post) => ({
      ...post,
      timestamp: post.timestamp.toDate().getTime(),
    }));

  return {
    props: {
      posts: JSON.stringify(posts),
    },
    revalidate: 1,
  };
}

export default PostData;
