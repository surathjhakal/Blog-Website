import { Nav, Navbar } from "react-bootstrap";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, provider } from "../firebase";
import { Avatar } from "@material-ui/core";
import { useRouter } from "next/router";

export default function Header() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };
  const signOut = () => {
    auth.signOut();
  };
  return (
    <Navbar
      bg="light"
      expand="lg"
      style={{
        padding: " 0.5rem 5vw",
        borderBottom: "1px solid lightgrey",
        fontSize: "20px",
      }}
    >
      <Navbar.Brand href="#">MY BLOG</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link href="/" passHref>
            <Nav.Link>Home</Nav.Link>
          </Link>
          {user && (
            <Link href={`/YourBlog`} passHref>
              <Nav.Link style={{ marginLeft: "20px" }}>My Blogs</Nav.Link>
            </Link>
          )}
        </Nav>
        <Nav>
          <Link href="" passHref style={{ marginLeft: "auto" }}>
            {user ? (
              <>
                <Avatar src={user.photoURL} />
                <Nav.Link>
                  {user.displayName},<span onClick={signOut}> Sign Out</span>
                </Nav.Link>
              </>
            ) : (
              <Nav.Link onClick={signIn}>Sign In</Nav.Link>
            )}
          </Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

{
  /* <Link href="/" passHref>
    <Nav.Link>Home</Nav.Link>
</Link>
<Link href="/contact" passHref>
    <Nav.Link>Contact</Nav.Link>
</Link> */
}
