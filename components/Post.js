import styles from "../styles/Post.module.css";
import { Button, Card } from "react-bootstrap";
import { Avatar } from "@material-ui/core";
import db, { auth, provider, storage } from "../firebase";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Post({ post, id, blog }) {
  const [postData, setPostData] = useState(post);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const updateBlog = () => {
    router.push(`/blogUpdate/${id}`);
  };

  const deleteBlog = () => {
    if (postData.postImage) {
      storage.ref(`posts/${id}`).delete();
    }
    db.collection("posts").doc(id).delete();
    alert("You have successfully deleted your blog");
  };

  const like = () => {
    if (!user) {
      auth.signInWithPopup(provider).catch(alert);
    } else {
      db.collection("posts")
        .doc(postData.id)
        .set(
          {
            likes: postData.likes + 1,
          },
          { merge: true }
        )
        .then(() => {
          setPostData({ ...postData, likes: postData.likes + 1 });
        });
    }
  };

  const dislike = () => {
    if (!user) {
      auth.signInWithPopup(provider).catch(alert);
    } else {
      db.collection("posts")
        .doc(postData.id)
        .set(
          {
            dislikes: postData.dislikes - 1,
          },
          { merge: true }
        )
        .then(() => {
          setPostData({ ...postData, likes: postData.likes - 1 });
        });
    }
  };
  return (
    <div className={styles.post}>
      <Card>
        <Card.Body
          style={{ backgroundColor: "rgb(241, 241, 241)", width: "100%" }}
        >
          <Card.Text className={styles.post_header}>
            <Avatar src={postData.photoURL} />
            <h3>{postData.name}</h3>
            {!blog ? (
              <p>Posted on: {new Date(postData?.timestamp).toDateString()}</p>
            ) : (
              <p>
                Posted on:{" "}
                {postData?.timestamp.toDate().toString().slice(0, 25)}
              </p>
            )}
          </Card.Text>

          <Card.Text>
            {postData.postImage && (
              <img
                src={postData?.postImage}
                style={{ height: "300px", width: "100%" }}
              />
            )}
          </Card.Text>
          <Card.Text>
            <h4 className={styles.post_title}>Topic Name: {postData.title}</h4>
            <p style={{ whiteSpace: "pre-wrap" }} className={styles.post_info}>
              {postData.blogDetails}
            </p>
          </Card.Text>
        </Card.Body>
        {!blog && (
          <div className={styles.post_buttons}>
            <Button variant="light" onClick={like}>
              👍 {postData.likes}
            </Button>
            <Button variant="light" onClick={dislike}>
              👎 {postData.dislikes}
            </Button>
          </div>
        )}
        {blog && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              backgroundColor: "rgb(241, 241, 241)",
              paddingBottom: "1rem",
            }}
          >
            <Button variant="success" onClick={updateBlog}>
              Update
            </Button>

            <Button variant="danger" onClick={deleteBlog}>
              Delete
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
