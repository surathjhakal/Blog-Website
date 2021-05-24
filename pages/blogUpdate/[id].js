import Head from "next/head";
import styles from "../../styles/addBlog.module.css";
import Header from "../../components/Header";
import { useAuthState } from "react-firebase-hooks/auth";
import db, { auth, storage } from "../../firebase";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import firebase from "firebase";

export default function update({ postDetails }) {
  postDetails = JSON.parse(postDetails);
  const [image, setImage] = useState(postDetails.postImage);
  const [blogDetails, setBlogDetails] = useState(postDetails.blogDetails);
  const [user] = useAuthState(auth);
  const router = useRouter();
  console.log(postDetails);

  const setBlog = () => {
    db.collection("posts")
      .doc(router.query.id)
      .set(
        {
          blogDetails: blogDetails,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      )
      .then((doc) => {
        if (image) {
          const uploadTask = storage
            .ref(`posts/${router.query.id}`)
            .putString(image, "data_url");
          removeImage();
          uploadTask.on(
            "state_change",
            null,
            (err) => console.log(err),
            () => {
              storage
                .ref(`posts/${router.query.id}`)
                .getDownloadURL()
                .then((url) => {
                  db.collection("posts").doc(router.query.id).set(
                    {
                      postImage: url,
                    },
                    { merge: true }
                  );
                });
            }
          );
        }
      })
      .then(() => {
        alert("You have successfully updated your blog");
      });
    router.push("../");
  };

  const addImage = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setImage(readerEvent.target.result);
    };
  };
  const removeImage = () => {
    setImage(null);
  };

  return (
    <>
      {user && (
        <div className={styles.home}>
          <Head>
            <title>My Blog</title>
            <meta name="description" content="My Blog Site!!!" />
            <link rel="icon" href="/favicon.ic" />
          </Head>

          <div className={styles.blogUpdate}>
            <Header />
            <div className={styles.addBlog}>
              <h2 className={styles.updateBlog_title}>Update your Blog Post</h2>
              <Form>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    value={postDetails.title}
                    // value={title}
                    type="text"
                    placeholder="Enter the title of the blog"
                    // onChange={(e) => setTitle(e.target.value)}
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Select Category</Form.Label>
                  <Form.Control
                    disabled
                    as="select"
                    value={postDetails.category}
                    // onChange={(e) => setCategory(e.target.value)}
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
                <Form.Group>
                  <Form.Label>Upload blog image :</Form.Label>
                  <Form.File
                    className="position-relative"
                    required
                    name="file"
                    onChange={addImage}
                    id="validationFormik107"
                    feedbackTooltip
                  />
                  {image && (
                    <div>
                      <img
                        style={{ height: "50px", margin: "10px 10px 0 0" }}
                        src={image}
                        alt="image selected"
                      />
                      <Button variant="info" onClick={removeImage}>
                        Remove
                      </Button>
                    </div>
                  )}
                </Form.Group>
                <Button
                  onClick={setBlog}
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

export async function getServerSideProps(context) {
  const postDoc = await db.collection("posts").doc(context.query.id).get();

  const postDetails = postDoc.data();
  postDetails.timestamp = postDetails.timestamp.toDate().getTime();

  return {
    props: {
      postDetails: JSON.stringify(postDetails),
    },
  };
}
