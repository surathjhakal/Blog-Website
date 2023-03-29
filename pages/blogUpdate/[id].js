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
  const [postData, setPostData] = useState(postDetails);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const setBlog = () => {
    db.collection("posts")
      .doc(router.query.id)
      .set(
        {
          ...postData,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      )
      .then((doc) => {
        if (image != postDetails.postImage) {
          console.log(image);
          const uploadTask = storage
            .ref(`posts/${router.query.id}`)
            .putString(image);
          removeImage();
          uploadTask.on(
            "state_changed",
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

  console.log(image);

  const handleOnChangePostData = (value, attribute) => {
    setPostData({ ...postData, [attribute]: value });
  };

  return (
    <>
      {user && (
        <div className={styles.home}>
          <Head>
            <title>Blogue</title>
            <meta name="description" content="My Blog Site!!!" />
            <link
              rel="icon"
              href="https://e7.pngegg.com/pngimages/76/607/png-clipart-blog-logo-others-text-service.png"
            />
          </Head>

          <div className={styles.blogUpdate}>
            <Header />
            <div className={styles.addBlog}>
              <h2 className={styles.updateBlog_title}>Update your Blog Post</h2>
              <Form>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    value={postData.title}
                    type="text"
                    placeholder="Enter the title of the blog"
                    onChange={(e) =>
                      handleOnChangePostData(e.target.value, "title")
                    }
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Select Category</Form.Label>
                  <Form.Control
                    as="select"
                    value={postData.category}
                    onChange={(e) =>
                      handleOnChangePostData(e.target.value, "category")
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <option value="Adventure">Adventure</option>
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
                    value={postData.blogDetails}
                    onChange={(e) =>
                      handleOnChangePostData(e.target.value, "blogDetails")
                    }
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        style={{
                          height: "100px",
                          width: "120px",
                          margin: "10px 10px 0 0",
                        }}
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
