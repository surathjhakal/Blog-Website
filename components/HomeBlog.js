import styles from "../styles/Homeblog.module.css";
import { Button, Carousel, Nav, Navbar } from "react-bootstrap";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import Posts from "./Posts";
import db, { auth, provider } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";

export default function HomeBlog({ posts }) {
  console.log(posts);
  const getCategory = db.collection("category");
  const [categories] = useCollection(getCategory);
  const [user] = useAuthState(auth);
  const router = useRouter();

  const addBlog = () => {
    if (user) {
      router.push("../blogAdd/add");
    } else {
      auth.signInWithPopup(provider).catch(alert);
    }
  };
  return (
    <div className={styles.homeBlog}>
      <Carousel>
        <Carousel.Item interval={2000}>
          <img
            className={styles.homeBlog_carousel_image}
            src="https://www.shoutmeloud.com/wp-content/uploads/2020/12/Your-First-Blog-Post.jpg"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3 className={styles.caption}>
              Aren't you excited to write your first blog
            </h3>
          </Carousel.Caption>
          <Button
            variant="light"
            onClick={addBlog}
            className={styles.homeBlog_createBlog}
          >
            Click here! To Create a Blog Post
          </Button>
        </Carousel.Item>
        <Carousel.Item interval={2000}>
          <img
            className={styles.homeBlog_carousel_image}
            src="https://mythemeshop.com/wp-content/uploads/2017/06/Writing-a-Stunning-Blog-Post.jpg"
            alt="Second slide"
          />
        </Carousel.Item>
      </Carousel>
      <Navbar
        bg="rgb(241, 241, 241)"
        style={{ borderBottom: "1px solid rgb(197 197 197)" }}
      >
        <div className={styles.homeBlog_category}>
          {categories?.docs.map((category) => (
            <Link href={`/category/${category.id}`} passHref>
              <div
                className={
                  router.query.id == category.id
                    ? styles.active
                    : styles.homeBlog_buttons
                }
              >
                {category.data().name}
              </div>
            </Link>
          ))}
        </div>
      </Navbar>
      {posts ? (
        <>
          {JSON.parse(posts).length > 0 ? (
            <div className={styles.HomeBlog_posts}>
              <Posts posts={JSON.parse(posts)} />
            </div>
          ) : (
            <div className={styles.noBlogs}>No Blog Posted over Here</div>
          )}
        </>
      ) : (
        <div className={styles.noCategory_selected}>
          <h1>Select any Category from above options..</h1>
        </div>
      )}
    </div>
  );
}
