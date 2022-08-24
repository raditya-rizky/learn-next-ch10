import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import { Container } from "react-bootstrap";
import { authOptions } from "../api/auth/[...nextAuth]";

export async function getServerSideProps({ req, res, params }) {
  const session = await unstable_getServerSession(req, res, authOptions);

  const response = await fetch(`http://localhost:4000/articles/${params.id}`, {
    headers: {
      Authorization: session.user.accessToken,
    },
  });

  if (response.status === 404) {
    return {
      notFound: true,
    };
  }

  const article = await response.json();

  return {
    props: {
      article,
    },
  };
}

export default function ArticleDetail({ article }) {
  return (
    <Container className="mt-3">
      <Head>
        <title>{article.title}</title>
      </Head>

      <h1>{article.title}</h1>
      <p>{article.body}</p>
    </Container>
  );
}
