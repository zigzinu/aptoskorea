import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";

export default function Document() {
  const router = useRouter();
  console.log(router.query);
  return (
    <div>
      query text: <h1>{router.query.text}</h1>
    </div>
  );
}
