import styles from "../styles/Post.module.css";
import { Button, Card } from "react-bootstrap";
import { Avatar } from "@material-ui/core";
import db, { auth, provider } from "../firebase";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Post({ post, id, blog }) {
  const [posts, setPosts] = useState();
  const [user] = useAuthState(auth);
  const router = useRouter();
  db.collection("posts")
    .doc(post.id)
    .onSnapshot((snapshot) => {
      setPosts(snapshot.data());
    });
  // console.log(posts?.docs?.map((post) => console.log(post.data())));
  if (posts) {
    // posts?.docs?.forEach((post) => console.log(post.data()));
    // console.log(posts);
    post.likes = posts.likes;
    post.dislikes = posts.dislikes;
  }

  const updateBlog = () => {
    router.push(`/blogUpdate/${id}`);
  };

  const like = () => {
    if (!user) {
      auth.signInWithPopup(provider).catch(alert);
    } else {
      db.collection("posts")
        .doc(post.id)
        .set(
          {
            likes: post.likes + 1,
          },
          { merge: true }
        );
    }
  };

  const dislike = () => {
    if (!user) {
      auth.signInWithPopup(provider).catch(alert);
    } else {
      db.collection("posts")
        .doc(post.id)
        .set(
          {
            dislikes: post.dislikes - 1,
          },
          { merge: true }
        );
    }
  };
  return (
    <div className={styles.post}>
      <Card>
        <Card.Body
          style={{ backgroundColor: "rgb(241, 241, 241)", width: "100%" }}
        >
          <Card.Text className={styles.post_header}>
            <Avatar src={post.photoURL} />
            <h3>{post.name}</h3>
            {!blog ? (
              <p>Posted on: {new Date(post?.timestamp).toDateString()}</p>
            ) : (
              <p>
                Posted on: {post?.timestamp.toDate().toString().slice(0, 25)}
              </p>
            )}
          </Card.Text>

          <Card.Text>
            {post.postImage && (
              <Image src={post?.postImage} height="300px" width="1100px" />
            )}
          </Card.Text>
          <Card.Text>
            <h4 className={styles.post_title}>Topic Name: {post.title}</h4>
            <p style={{ whiteSpace: "pre-wrap" }} className={styles.post_info}>
              {post.blogDetails}
            </p>
          </Card.Text>
        </Card.Body>
        <div className={styles.post_buttons}>
          <Button variant="light" onClick={like}>
            👍 {post.likes}
          </Button>
          <Button variant="light" onClick={dislike}>
            👎 {post.dislikes}
          </Button>
        </div>
        {blog && (
          <Button variant="success" onClick={updateBlog}>
            Update
          </Button>
        )}
      </Card>
    </div>
  );
}
