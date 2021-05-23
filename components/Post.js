import styles from "../styles/Post.module.css";
import { Button, Card } from "react-bootstrap";
import { Avatar } from "@material-ui/core";
import { useCollection } from "react-firebase-hooks/firestore";
import db from "../firebase";
import { useEffect, useState } from "react";

export default function Post({ post }) {
  const [posts, setPosts] = useState();
  db.collection("posts")
    .doc(post.id)
    .onSnapshot((snapshot) => {
      setPosts(snapshot.data());
    });
  // console.log(posts?.docs?.map((post) => console.log(post.data())));
  if (posts) {
    // posts?.docs?.forEach((post) => console.log(post.data()));
    console.log(posts);
    post.likes = posts.likes;
    post.dislikes = posts.dislikes;
  }

  const like = () => {
    db.collection("posts")
      .doc(post.id)
      .set(
        {
          likes: post.likes + 1,
        },
        { merge: true }
      );
  };

  const dislike = () => {
    db.collection("posts")
      .doc(post.id)
      .set(
        {
          dislikes: post.dislikes - 1,
        },
        { merge: true }
      );
  };
  return (
    <div className={styles.post}>
      <Card>
        <Card.Body style={{ backgroundColor: "rgb(241, 241, 241)" }}>
          <Card.Text className={styles.post_header}>
            <Avatar src={post.photoURL} />
            <h3>{post.name}</h3>
            <p>Posted on: {new Date(post?.timestamp).toDateString()}</p>
          </Card.Text>
          <Card.Img
            variant="top"
            src="https://www.livehappy.com/sites/default/files/styles/article_featured/public/main/articles/peppers-pan-stove-flame.jpg?itok=Po__tNob"
            className={styles.post_image}
          />
          <Card.Text>
            <h4 className={styles.post_title}>Topic Name: {post.title}</h4>
            <p style={{ whiteSpace: "pre-wrap" }} className={styles.post_info}>
              {post.blogDetails}
            </p>
          </Card.Text>
        </Card.Body>
        <div className={styles.post_buttons}>
          <Button variant="light" onClick={like}>
            Like {post.likes}
          </Button>
          <Button variant="light" onClick={dislike}>
            Dislike {post.dislikes}
          </Button>
        </div>
      </Card>
    </div>
  );
}
