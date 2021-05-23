import Post from "./Post";
import styles from "../styles/Posts.module.css";

export default function Posts({ posts }) {
  return (
    <div className={styles.posts}>
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </div>
  );
}
