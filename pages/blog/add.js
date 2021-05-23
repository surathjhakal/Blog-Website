import Head from "next/head";
import styles from "../../styles/Home.module.css";
import Header from "../../components/Header";
import { useAuthState } from "react-firebase-hooks/auth";
import db, { auth, provider } from "../../firebase";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import firebase from "firebase";

export default function add() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [blogDetails, setBlogDetails] = useState("");
  const [user] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // console.log(router);
      router.push("../");
    }
  }, [user]);

  //   Here I'll tell you how to make a chocolate cake..

  // 1) first try to do this and that
  // 1) first try to do this and that
  // 1) first try to do this and that
  // 1) first try to do this and that
  // 1) first try to do this and that

  // Now your cake is ready , enjoy!!
  const addBlog = () => {
    db.collection("posts")
      .add({
        name: user.displayName,
        title: title,
        category: category,
        blogDetails: blogDetails,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        likes: 0,
        dislikes: 0,
        photoURL: user.photoURL,
      })
      .then(() => {
        alert("You have successfully posted your blog");
      });
    setTitle("");
    setBlogDetails("");
    setCategory("");
  };

  return (
    <>
      {user && (
        <div className={styles.home}>
          <Head>
            <title>My Blog</title>
            <meta name="description" content="My Blog Site!!!" />
            <link
              rel="icon"
              href="/favicon.icTopic Name: How to make a chocolate cake
   Here I'll tell you how to make a chocolate cake..

  1) first try to do this and that
  1) first try to do this and that
  1) first try to do this and that
  1) first try to do this and that
  1) first try to do this and that

  Now your cake is ready , enjoy!!o"
            />
          </Head>

          <div className={styles.home_content}>
            <Header />
            <div
              className={styles.addBlog}
              style={{
                width: "70vw",
                border: "1px solid lightgrey",
                margin: "auto",
                marginTop: "2rem",
                padding: "3rem",
              }}
            >
              <h2
                style={{
                  marginBottom: "1rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid grey",
                  width: "280px",
                }}
              >
                Create a Blog Post
              </h2>
              <Form>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    value={title}
                    type="text"
                    placeholder="Enter the title of the blog"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Select Category</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="Health">Health</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Finance">Finance</option>
                    <option value="Sports">Sports</option>
                    <option value="Inspirational Stories">
                      Inspirational Stories
                    </option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Enter the content :</Form.Label>
                  <Form.Control
                    style={{ whiteSpace: "pre-wrap" }}
                    as="textarea"
                    rows={15}
                    value={blogDetails}
                    onChange={(e) => setBlogDetails(e.target.value)}
                  />
                </Form.Group>
                <Button
                  onClick={addBlog}
                  style={{ padding: "0.5rem 1rem" }}
                  variant="primary"
                >
                  Submit
                </Button>{" "}
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
