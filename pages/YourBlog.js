import Head from "next/head";
import styles from "../styles/addBlog.module.css";
import Header from "../components/Header";
import db, { auth } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import Post from "../components/Post";
import { useEffect, useState } from "react";

function YourBlog() {
  const [blogs, setBlogs] = useState([]);
  const [user] = useAuthState(auth);
  db.collection("posts")
    .orderBy("likes", "desc")
    .where("email", "==", "jhakal.surath@gmail.com")
    .onSnapshot((snapshot) => {
      setBlogs(snapshot.docs.map((doc) => [doc.id, doc.data()]));
    });
  const router = useRouter();
  console.log(blogs);

  return (
    <div>
      <Head>
        <title>My Blog</title>
        <meta name="description" content="My Blog Site!!!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.myBlog_header}>
        <Header />
        <div className={styles.myBlog}>
          <h1 className={styles.blogTitle}>My Blogs</h1>
          {blogs?.map((blog) => (
            <Post post={blog[1]} key={blog[0]} id={blog[0]} blog />
          ))}
        </div>
      </div>
    </div>
  );
}

export default YourBlog;
